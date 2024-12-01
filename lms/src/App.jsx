import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Signup from './Signup';
import Profile from './Profile'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/profile/*' element={<Profile/>} />
        <Route path='*' element={<Navigate to='/login'></Navigate>}/>
      </Routes>
    </Router>
  );
}

export default App;
