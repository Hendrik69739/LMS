import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Content from './content';
import Admin from './admin';

function Profile() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('https://lms-tcr1.onrender.com/check-session', { 
                    method: 'GET',
                    credentials: 'include'
                });

                console.log('Response status:', response.status);
                

                if (response.status === 200) {
                    const data = await response.json();
                    console.log('Session data:', data);

                    setUser(data.user);
                    setIsAuthenticated(true);
                    console.log('There is a session on the profile page');
                } else {
                    console.log('No session found:', response.status);
                    navigate('/login');
                }
            } catch (error) {
                console.log('Error occurred while checking for session:', error);
                navigate('/login');
            }
        };

        checkSession();
    }, [navigate]);

    return (
        <>
            {isAuthenticated ? (
                user === 'admin@gmail.com' ? (
                    <Admin />
                ) : (
                    <Content />
                )
            ) : (
                <p>You are not logged in, please return to the login page.</p>
            )}
        </>
    );
}

export default Profile;
