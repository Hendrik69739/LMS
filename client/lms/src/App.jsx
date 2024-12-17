import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Signup from './Signup';
import Profile from './Profile';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile/*' element={<Profile />} /> 
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </Router>
  );
}

export default App;
