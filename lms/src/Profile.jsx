import {  useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Content from './content';

function Profile() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('http://localhost:3000/check-session', { 
                    method: 'GET',
                    credentials: 'include'
                });

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
        { isAuthenticated ? <Content></Content> : <>
        <p>Your not logged in, return to login page</p>
        </>}
        </>

    );
}

export default Profile;
