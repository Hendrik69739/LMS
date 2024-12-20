import { useEffect, useState } from 'react';
import Dock from './assignment';
import Dashboard from './dashboard';
import './profile.css';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import Assignment from './dock';
import Announcement from './Announcement';

function Content() {
    const navigate = useNavigate();
    const [namesetter, setNamesetter] = useState('');

    useEffect(() => {
        const setName = async () => {
            const data = await fetch('https://lms-tcr1.onrender.com/namesetter', {
                method: 'GET',
                credentials: 'include'
            });

            const response = await data.json();
            setNamesetter(response.firstname + " " + response.lastname);
        };
        setName();
    }, []);

    const Logout = async () => {
        try {
            const response = await fetch('https://lms-tcr1.onrender.com/logout', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.redirect) {
                navigate(data.redirect);
                console.log(data);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <>
            <header id='prof__header'>
                <h1>North College</h1>
                <div>
                    <h2 id='prof__h2'>{namesetter}</h2>
                    <img src='' alt='Profile' />
                </div>
            </header>
            <div id='content'>
                <main id='main__prof'>
                    <aside id='prof__aside'>
                        <NavLink to='/profile/dashboard' id='link' activeClassName='active-link'>Dashboard</NavLink>
                        <div id='link'>
                            <p>Assignment</p>
                            <div>
                                <NavLink to='/profile/assignment/dock' activeClassName='active-link'>Dock</NavLink><br />
                                <NavLink to='/profile/assignment/management' activeClassName='active-link'>Submitted</NavLink>
                            </div>
                        </div>
                        <NavLink to='/profile/announcement' id='link' activeClassName='active-link'>Announcement</NavLink>
                        <NavLink to='#' id='link' activeClassName='active-link' onClick={Logout}>Logout</NavLink>
                    </aside>
                    <section id='prof__section'>
                        <Routes>
                            <Route path='dashboard' element={<Dashboard />} />
                            <Route path='announcement' element={<Announcement />} />
                            <Route path='assignment/management' element={<Assignment />} />
                            <Route path='assignment/dock' element={<Dock />} />
                        </Routes>
                    </section>
                </main>
            </div>
        </>
    );
}

export default Content;
