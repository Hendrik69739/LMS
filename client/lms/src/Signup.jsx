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

    const [coarse, setCoarse] = useState('');
    const handleCoarse = (e) => {
        setCoarse(e.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)

       const result = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                email: Email,
                password: Password,
                ID : ID,
                coarse : coarse
            }),
        })
        
        const response = await result.json();
        console.log(response)
            if (response.redirect) {
                navigate(response.redirect)
            }else if(response.errno == 1062){
                console.log('user is registered')

                const mil = document.getElementById('mil1')

                const mil1 = document.createElement('div');
                mil1.innerHTML = 'User already registered'
                mil1.setAttribute('id', 'mil2')

                mil.appendChild(mil1)
                setLoader(false)

                setTimeout(() => {
                    const mil3 = document.getElementById('mil2')
                    mil3.remove();
                }, 3000)
            }
        
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
                <select className="form-input" onChange={handleCoarse} required>
                    <option value="">Select Coarse</option>
                    <option value="mech4">Mechanical N4</option>
                    <option value="mech5">Mechanical N5</option>
                    <option value="mech6">Mechanical N6</option>
                    <option value="elec4">Electrical N4</option>
                    <option value="elec5">Electrical N5</option>
                    <option value="elec6">Electrical N6</option>
                </select>
                </div>
                {!loader && <button type="submit" className="form-button">Register</button>}
            {loader && <LoadingSpinner />}
            </form>
            <p className="signup-text">Have an account? <Link to="/login" className="signup-link">Sign in</Link></p>
            <div id='mil1'></div>
         </div>
    );
}

export default Signup;
