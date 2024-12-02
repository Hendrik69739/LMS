import Assignment from './assignments';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './dashboard';
import './profile.css';

function Profile() {
  return (
    <>
      <header id='prof__header'>
        <h1>North College</h1>
        <div>
          <h2 id='prof__h2'>Hendrick Moselana</h2>
          <img src="" alt='image' />
        </div>
      </header>
      <div id='content'>
        <main id='main__prof'>
          <aside id='prof__aside'>
            <Link to='dashboard'>dashboard</Link>  {/* Use relative links */}
            <Link to='assignment'>assignment</Link>
          </aside>
          <section id='prof__section'>
            <Routes>
              <Route path='dashboard' element={<Dashboard />} />  {/* Relative path */}
              <Route path='assignment' element={<Assignment />} /> {/* Relative path */}
            </Routes>
          </section>
        </main>
      </div>
    </>
  );
}

export default Profile;
