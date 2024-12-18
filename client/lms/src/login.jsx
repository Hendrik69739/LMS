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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          <input type="email" id="email" className="login-input" placeholder="Email" onChange={handleUsername} required/>
          <input type="password" id="password" className="login-input" placeholder="Password" onChange={handleUserPassword} required/>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="signup-text">Dont have an account? <Link to="/signup" className="signup-link">Sign up</Link></p>
      </aside>
    </div>
  );
}

export default Login;
