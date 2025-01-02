import { useEffect, useState } from 'react';
import Assignment from './admin_assignment_panel';
import './profile.css';
import {Route, Routes, Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Broadcast from './broadcast';
import Users from './users';
import User_Profile from './user_profile';


function Admin(){

    const navigate = useNavigate()

    const Logout = async () => {
    await fetch('https://lms-tcr1.onrender.com/logout', {
             method: 'GET',
            credentials: 'include'
        }).then(response => response.json())
        .then(data => {
            if(data.redirect){
                navigate(data.redirect)
                console.log(data)
            }
        })
       
    }

    const [namesetter, setNamesetter] = useState('')

    useEffect(() => {
        const setName = async () => {
          const data = await fetch('https://lms-tcr1.onrender.com/namesetter', {
                method : 'GET',
                credentials : 'include'
        })

        const response = await data.json()
        setNamesetter(response.firstname + " " + response.lastname)

        }
        setName();
    }, [])

    return(
        <>
        <header id='prof__header'>
            <h1 className='wht'>North College</h1>
            <div>
                <h2 id='prof__h2'>{namesetter}</h2>
                <img src='' alt='Profile' />
            </div>
        </header>
        <div id='content'>
            <main id='main__prof'>
               <aside id='prof__aside'>
                    <Link to='/profile/assignment' id='link'>Assignment</Link>
                    <Link to='/profile/anouncement' id='link'>Anouncement</Link>
                    <Link to='/profile/users' id='link'>Users</Link>
                    <Link onClick={Logout} id='link'>Logout</Link>
                </aside>
                <section id='prof__section'>
                   <Routes>
                        <Route path='assignment' element={<Assignment />} />
                        <Route path='anouncement' element={<Broadcast/>} />
                        <Route path='users' element={<Users></Users>} />
                        <Route path='users/profile/:username' element={<User_Profile></User_Profile>} />
                        <Route path='*' element={<Assignment></Assignment>}/>
                    </Routes>
                </section> 
            </main>
        </div>
    </> 
    )
}
 export default Admin;