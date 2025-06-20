import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import './login.css';

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

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
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
        setLoader(false);

        const toast = document.createElement('div');
        toast.innerHTML = data.message;
        toast.id = 'alert2';

        const toasted = document.getElementById('toasted');
        toasted.appendChild(toast);

        removeAlert();
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoader(false);
    }
  };

  function removeAlert() {
    setTimeout(() => {
      document.getElementById('alert2').remove();
    }, 6000);
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
          <div id="log-btn">
            {!loader && <button type="submit" id="login-btn" className="login-button">Login</button>}
            {loader && <LoadingSpinner />}
          </div>
          <div className="login-load"></div>
        </form>
        <Link to='/forgotpass'>forgot password</Link>
        <p className="signup-text">Dont have an account? <Link to="/signup" className="signup-link">Sign up</Link></p>
      </aside>
      <div id="toasted"></div>
    </div>
  );
}

export default Login;
