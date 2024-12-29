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

  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoader(true);

    document.getElementById('login-btn').remove();
    document.getElementsByClassName('login-load')[0].remove()


    const load = document.createElement('div');
    load.className = 'load';

    const loaderContainer = document.getElementsByClassName('login-load')[0];


    if (loaderContainer) {
      loaderContainer.appendChild(load);
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
        document.getElementsByClassName('login-load')[0].style.display = 'none';

        const loginBtnContainer = document.getElementById('log-btn');
        const btn = document.createElement('button');
        btn.id = 'login-btn';
        btn.type = 'submit';
        btn.className = 'login-button';
        btn.innerHTML = 'Login';
        loginBtnContainer.appendChild(btn);

        const toast = document.createElement('div');
        toast.innerHTML = 'Unsuccessful Login';
        toast.id = 'alert';

        const toasted = document.getElementById('toasted');
        toasted.appendChild(toast);

        
    function removeAlert() {
      setTimeout(() => {
        document.getElementById('alert').remove();
      }, 5000);
    }

        removeAlert();
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

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
          <div id="log-btn"><button type="submit" id="login-btn" className="login-button">Login</button></div>
          <div className="login-load"></div>
        </form>
        <Link to='/forgotpass'>forgot password</Link>
        <p className="signup-text">Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link></p>
      </aside>
      <div id="toasted"></div>
    </div>
  );
}

export default Login;
