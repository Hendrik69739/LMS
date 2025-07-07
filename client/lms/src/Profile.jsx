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
            const response = await fetch('http://localhost:3000/check-session', {
                method: 'POST',
                credentials: 'include'
            });

           

            if (response.status === 200) {
                const data = await response.json();
                setUser(data.session);
                setIsAuthenticated(true);
            } else {
                console.log('No session found:', response.status);
                navigate('/login');
            }
        };

        checkSession();
    }, [navigate]);

    

    return (
    
        <>
      {isAuthenticated ? (
            user.includes('admin') ? (
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
