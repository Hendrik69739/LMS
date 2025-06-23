import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Signup from './Signup';
import Profile from './Profile';
import Forgotpass from './forgetpass';
import Verify from './verify';
import Success from './success';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/forgotpass' element={<Forgotpass></Forgotpass>}/>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile/*' element={<Profile />} /> 
        <Route path='*' element={<Navigate to='/login' />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/success' element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;





