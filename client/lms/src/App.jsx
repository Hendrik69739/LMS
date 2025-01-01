import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Signup from './Signup';
import Profile from './Profile';
import Forgotpass from './forgetpass'
import Test from './test'


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
        <Route path='/test' element={<Test></Test>} />
      </Routes>
    </Router>
  );
}

export default App;





