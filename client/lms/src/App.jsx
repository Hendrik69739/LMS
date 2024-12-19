import { BrowserRouter as Router, Switch, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Signup from './Signup';
import Profile from './Profile';



function App() {
  return (
    <Router>
      <Switch>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile/*' element={<Profile />} /> 
        <Route path='*' element={<Navigate to='/login' />} />
      </Switch>
    </Router>
  );
}

export default App;





