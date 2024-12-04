import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    } catch (error) {
      console.error('Error during login:', error);
    }
  };


  useEffect(() => {
    const checkSession = async () => {
      try {
          const response = await fetch('http://localhost:3000/check-session', {
              method: 'GET',
              credentials: 'include'
          });
          if (response.status === 200) {
            navigate('/profile');
          } else {
              navigate('/login');
          }
      } catch{
          navigate('/login');
      }
  };

  checkSession();
  }, [navigate])


  return (
    <>
      <main>
        <h1>North College</h1>
      </main>
      <aside>
        <h2>Sign in</h2>
        <form id='form1' onSubmit={handleSubmit}>
          <input
            type='email'
            id='email'
            placeholder='Email'
            onChange={handleUsername}
            required
          />
          <input
            type='password'
            id='password'
            placeholder='Password'
            onChange={handleUserPassword}
            required
          />
          <button type='submit'>Login</button>
        </form>
        <p>Dont have an account? <Link to='/register'>Sign up</Link></p>
      </aside>
    </>
  );
}

export default Login;
