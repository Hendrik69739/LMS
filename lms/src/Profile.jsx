import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import Assignment from './assignments';
import Dashboard from './dashboard';
import './profile.css';

function Profile() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('http://localhost:3000/check-session', { // Ensure the correct port
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                    console.log('There is a session');
                } else {
                    navigate('/login');
                }
            } catch {
                navigate('/login');
            }
        };

        checkSession();
    }, [navigate]);

    if (!isAuthenticated) {
        return null; // Do not render anything if not authenticated
    }

    return (
        <>
            <header id='prof__header'>
                <h1>North College</h1>
                <div>
                    <h2 id='prof__h2'>Hendrick Moselana</h2>
                    <img src='' alt='Profile' />
                </div>
            </header>
            <div id='content'>
                <main id='main__prof'>
                    <aside id='prof__aside'>
                        <Link to='dashboard'>Dashboard</Link>
                        <Link to='assignment'>Assignment</Link>
                    </aside>
                    <section id='prof__section'>
                        <Routes>
                            <Route path='dashboard' element={<Dashboard />} />
                            <Route path='assignment' element={<Assignment />} />
                        </Routes>
                    </section>
                </main>
            </div>
        </>
    );
}

export default Profile;
