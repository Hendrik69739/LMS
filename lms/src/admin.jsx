import { useEffect, useState } from 'react';
import Assignment from './admin_assignment_panel';
import './profile.css';
import {Route, Routes, Link, Navigate} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';


function Admin(){


    const navigate = useNavigate()
    

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
       
    }

    const [namesetter, setNamesetter] = useState('hello')

    useEffect(() => {
        const setName = async () => {
          const data = await fetch('http://localhost:3000/namesetter', {
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
            <h1>North College</h1>
            <div>
                <h2 id='prof__h2'>{namesetter}</h2>
                <img src='' alt='Profile' />
            </div>
        </header>
        <div id='content'>
            <main id='main__prof'>
               <aside id='prof__aside'>
                    <Link to='assignment' id='link'>Assignment</Link>
                    <Link onClick={Logout} id='link'>Logout</Link>
                </aside>
                <section id='prof__section'>
                    <Routes>
                        <Route path='assignment' element={<Assignment />} />
                    </Routes>
                </section> 
            </main>
        </div>
    </> 
    )
}
 export default Admin;