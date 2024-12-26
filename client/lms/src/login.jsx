import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './login.css'

function Login() {
  const [username, setUsername] = useState('');
  const [userpassword, setUserPassword] = useState('');

  const navigate = useNavigate();

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleUserPassword = (e) => {
    setUserPassword(e.target.value);
  };

  const [load, setLoad] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoad(true);

    const loader = document.createElement('div');
    loader.setAttribute('id', 'loader');
    
    const loading = document.createElement('div');
    loading.setAttribute('id', 'loading');
    loading.innerHTML = "Loading";
    
    const container = document.getElementsByClassName('login-container')[0]; // Access the first element in the collection
    
    if (container) { 
        container.appendChild(loader);
        container.appendChild(loading);
    }

    try {
      const response = await fetch('https://lms-tcr1.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password: userpassword }),
        credentials: 'include', 
      });
      
      const data = await response.json();
      
      if (data.redirect) {
        navigate(data.redirect); 
      } else {
        console.log('No redirect URL found in the response.');
      }

      if (data.failed) {
        document.getElementById('loader').remove();
        document.getElementById('loading').remove();
        
        const toast = document.createElement('div');
        toast.innerHTML = 'Unsuccessful Login';
        toast.setAttribute('id', 'alert');
        
        const toasted = document.getElementById('toasted');
        toasted.appendChild(toast);
        
        removeAlert();
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  function removeAlert() {
    setTimeout(() => {
      document.getElementById('alert').remove();
    }, 5000);
  }

  return (
    <div className="login-container">
      <main className="main-content">
        <h1 className="college-name">North College</h1>
      </main>
      <aside className="login-aside">
        <h2 className="login-title">Sign in</h2>
        <form id="form1" className="login-form" onSubmit={handleSubmit}>
          <input type="email" id="email" className="login-input" placeholder="Email" onChange={handleUsername} required />
          <input type="password" id="password" className="login-input" placeholder="Password" onChange={handleUserPassword} required />
          <button type="submit" className="login-button">Login</button>
        </form>
        <Link to='/forgotpass'>forgot password</Link>
        <p className="signup-text">Dont have an account? <Link to="/signup" className="signup-link">Sign up</Link></p>
      </aside>
      <div id="toasted"></div>
    </div>
  );
}

export default Login;
