import Assignment from './assignment';
import Dashboard from './dashboard';
import './profile.css';
import {Route, Routes, Link, Navigate} from 'react-router-dom'

function Content(){
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