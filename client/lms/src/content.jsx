import { useEffect, useState } from 'react';
import Dock from './assignment';
import Dashboard from './dashboard';
import './profile.css';
import { BrowserRouter as Link, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Assignment from './dock';
import Anouncement from './Anouncement'


function Content() {

    const navigate = useNavigate()


    const Logout = async () => {
        await fetch('https://lms-tcr1.onrender.com:3000/logout', {
            method: 'GET',
            credentials: 'include'
        }).then(response => response.json())
            .then(data => {
                if (data.redirect) {
                    navigate(data.redirect)
                    console.log(data)
                }
            })

    }

    const [namesetter, setNamesetter] = useState('')

    useEffect(() => {
        const setName = async () => {
            const data = await fetch('https://lms-tcr1.onrender.com:3000/namesetter', {
                method: 'GET',
                credentials: 'include'
            })

            const response = await data.json()
            setNamesetter(response.firstname + " " + response.lastname)

        }
        setName();
    }, [])

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
                         <Link to='dashboard' id='link'>Dashboard</Link>
                        <div id='link'>
                            <p>Assignment</p>
                            <div>
                                <Link to='assignment/dock'>Dock</Link><br></br>
                                <Link to='assignment/management'>Submitted</Link>
                            </div>
                        </div>
                        <Link to='anouncement' id='link'>Anouncement</Link>
                        <Link onClick={Logout} id='link'>Logout</Link>
                    </aside>
                    <section id='prof__section'>
                       <Routes>
                            <Route path='dashboard' element={<Dashboard />} />
                            <Route path='anouncement' element={<Anouncement/>}/>
                            <Route path='assignment/management' element={<Assignment />} />
                            <Route path='assignment/dock' element={<Dock />} />
                        </Routes>
                    </section>
                </main>
            </div>
        </>
    )
}
export default Content;