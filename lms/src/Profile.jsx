import Assignment from './assignments';
import {Routes, Route, Link} from 'react-router-dom'
import Dashboard from './dashboard';
import './profile.css'

function Profile(){

    return(
    <>
    <header>
        <h1>North College</h1>
       <div>
       <h2>Hendrick Moselana</h2>
       <img src="" alt='image'></img>
       </div>
    </header>
    <div id='content'>
    <main>
        <aside>
            <Link to='/dashboard'>dashboard</Link>
            <Link to='/assignment'>assignment</Link>
        </aside>
        <section>
          <Routes>
            <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
            <Route path='/assignment' element={<Assignment></Assignment>}></Route>
          </Routes>
        </section>
    </main>
    </div>
    
</>
    )
}

export default Profile;