import {  useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Content from './content';
import Admin from './admin';

function Profile() {
    /*
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const [user, setUser] = useState('')

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('https://lms-tcr1.onrender.com/check-session', { 
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
*/


    return (
        <>
        <Content></Content>
    </>
    
    );
}

export default Profile;
