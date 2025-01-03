import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Signup.css'
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner'

function Signup() {

    const [loader, setLoader] = useState(false)

    const navigate = useNavigate();

    const [firstname, setFirstname] = useState('');
    const handleFirstname = (e) => {
        setFirstname(e.target.value);
    };

    const [lastname, setLastname] = useState('');
    const handleLastname = (e) => {
        setLastname(e.target.value);
    };

    const [Email, setEmail] = useState('');
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const [Password, setPass] = useState('');
    const handlePassword = (e) => {
        setPass(e.target.value);
    };

    const [ID, setID] = useState('');
    const handleID = (e) => {
        setID(e.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)

        await fetch('https://lms-tcr1.onrender.com/auth/register', {
            method: 'POST',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                email: Email,
                password: Password,
                ID : ID
            }),
        })
        .then((data) => data.json())
        .then((response) => {
            if (response.redirect) {
                navigate(response.redirect)
            }
        });
    };

    return (
        <div id='reg-board'>
            <h1 className="signup-heading">Student Registration</h1>
            <form id="form1" onSubmit={handleSubmit} className="signup-form">
                <div className='firstrow'>
                <input
                    type="text"
                    id="firstname"
                    placeholder="First name"
                    onChange={handleFirstname}
                    className="form-input"
                    required
                />
                <input
                    type="text"
                    id="lastname"
                    placeholder="Last name"
                    onChange={handleLastname}
                    className="form-input"
                    required

                />
                 <input
                    type="text"
                    id="id"
                    placeholder="ID number"
                    onChange={handleID}
                    className="form-input"
                    required

                />
                <input
                    type="text"
                    id="email"
                    placeholder="Email"
                    onChange={handleEmail}
                    className="form-input"
                    required

                />
                <input
                    type="text"
                    id="password"
                    placeholder="Password"
                    onChange={handlePassword}
                    className="form-input"
                    required

                />
                </div>
                {!loader && <button type="submit" className="form-button">Register</button>}
            {loader && <LoadingSpinner />}
            </form>
            <p className="signup-text">Have an account? <Link to="/login" className="signup-link">Sign in</Link></p>
        </div>
    );
}

export default Signup;
