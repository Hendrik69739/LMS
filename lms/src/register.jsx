import { Link } from 'react-router-dom';
import './register.css'

function Register() {
  return (
    <div className="register-container">
      <h1 className="registration-title">Student Registration</h1>
      <form id="form1" className="registration-form">
        <input type="text" id="firstname" placeholder="First Name" className="form-input" />
        <input type="text" id="secondname" placeholder="Middle Name" className="form-input" />
        <input type="text" id="lastname" placeholder="Last Name" className="form-input" />
        <input type="text" id="IDnumber" placeholder="ID Number" className="form-input" />
        <input type="text" id="cellnumber" placeholder="Cell Number" className="form-input" />
        <input type="text" id="altnumber" placeholder="Alternate Cell Number" className="form-input" />
        <input type="email" id="email" placeholder="Email" className="form-input" />
        <input type="text" id="ethnicgroup" placeholder="Ethnic Group" className="form-input" />
        <input type="password" id="password" placeholder="Password" className="form-input" />
        <button type="submit" className="form-submit">Register</button>
      </form>
      <p className="signup-text">Have an account? <Link to="/login" className="signup-link">Sign in</Link></p>
    </div>
  );
}

export default Register;
