import Assignment from './assignment';
import Dashboard from './dashboard';
import './profile.css';
import {Route, Routes, Link, Navigate} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';


function Content(){


    const navigate = useNavigate()

    function deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    

    const Logout = async () => {
    await fetch('http://localhost:3000/logout', {
             method: 'GET',
            credentials: 'include'
        }).then(response => response.json())
        .then(data => {
            if(data.redirect){
                navigate(data.redirect)
                console.log(data)
            }
        })
        deleteCookie('session_cookie_name');
    }

    return(
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
                    <Link to='dashboard' id='link'>Dashboard</Link>
                    <Link to='assignment' id='link'>Assignment</Link>
                    <Link onClick={Logout}>Logout</Link>
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
    )
}
 export default Content;