import {  useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Content from './content';
import Admin from './admin';

function Profile() {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const [user, setUser] = useState('')

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('http://localhost:3000/check-session', { 
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();
                setUser(data.user)
                console.log(data)

                if (response.status === 200) {
                    setIsAuthenticated(true);
                   return console.log('There is a session on the profile page');
                } else {
                    console.log('There is no a session');
                    navigate('/login');
                }
            } catch {
                console.log('an error occured while checking for session')
                navigate('/login');
            }
        };

        checkSession();
    }, [navigate]);


    return (
        <>
        { isAuthenticated ? (
            user === 'admin@gmail.com' ? (
                <Admin />
            ) : (
                <Content />
            )
        ) : (
            <>
                <p>You are not logged in, please return to the login page.</p>
            </>
        )}
    </>
    
    );
}

export default Profile;
