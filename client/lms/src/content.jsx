import { useEffect, useState } from 'react';
import Dock from './assignment';
import Dashboard from './dashboard';
import './profile.css';
import { Link, Route, Routes } from 'react-router-dom'; // Correct import
import { useNavigate } from 'react-router-dom';
import Assignment from './dock';
import Anouncement from './Anouncement';
import Profilepage from './profile-page';

function Content() {

    const navigate = useNavigate();

    const Logout = async () => {
        await fetch('http://locahost:3000/logout', {
            method: 'GET',
            credentials: 'include'
        }).then(response => response.json())
            .then(data => {
                if (data.redirect) {
                    navigate(data.redirect);
                    console.log(data);
                }
            });
    };

    const [namesetter, setNamesetter] = useState('');

    useEffect(() => {
        const setName = async () => {
            const data = await fetch('http://locahost:3000/namesetter', {
                method: 'POST',
                credentials: 'include'
            });

            const response = await data.json();
            setNamesetter(response.firstname + " " + response.lastname);
        };
        setName();
    }, []);

    return (
        <>
            <header id='prof__header'>
                <h1 className='college'>North College</h1>
                <div>
                   <Link id='profile-click' to='/profile/user-profile'>
                   <h2 id='prof__h2'>{namesetter}</h2>
                   <img src='' alt='Profile' />
                   </Link>
                </div>
            </header>
            <div id='content'>
                <main id='main__prof'>
                    <aside id='prof__aside'>
                        <Link to='/profile/dashboard' id='link'>Dashboard</Link>
                        <div id='link' className='icbm'>
                            <p>Assignment</p>
                            <div>
                                <Link to='/profile/assignment/dock'>Dock</Link><br />
                                <Link to='/profile/assignment/management'>Submitted</Link>
                            </div>
                        </div>
                        <Link to='/profile/anouncement' id='link'>Anouncement</Link>
                        <Link to='/profile/user-profile' id='link'>Profile</Link>
                        <Link onClick={Logout} id='link'><span className='material-icons'>logout</span>Logout</Link>
                    </aside>
                    <section id='prof__section'>
                        <Routes>
                            <Route path='*' element={<Dashboard />} />
                            <Route path='dashboard' element={<Dashboard />} />
                            <Route path='anouncement' element={<Anouncement />} />
                            <Route path='assignment/management' element={<Assignment />} />
                            <Route path='assignment/dock' element={<Dock />} />
                            <Route path='user-profile' element={<Profilepage></Profilepage>} />
                        </Routes>
                    </section>
                </main>
            </div>
        </>
    );
}

export default Content;
