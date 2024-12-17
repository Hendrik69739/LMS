import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Signup.css'

function Signup() {
    const [firstname, setFirstname] = useState('');
    const handleFirstname = (e) => {
        setFirstname(e.target.value);
    };

    const [lastname, setLastname] = useState('');
    const handleLastname = (e) => {
        setLastname(e.target.value);
    };

    const [midname, setMidname] = useState('');
    const handleMidname = (e) => {
        setMidname(e.target.value);
    };

    const [ID, setID] = useState('');
    const handleID = (e) => {
        setID(e.target.value);
    };

    const [Cellno, setCellno] = useState('');
    const handleCellno = (e) => {
        setCellno(e.target.value);
    };

    const [Altcell, setAltcell] = useState('');
    const handleAltCell = (e) => {
        setAltcell(e.target.value);
    };

    const [Email, setEmail] = useState('');
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const [Password, setPass] = useState('');
    const handlePassword = (e) => {
        setPass(e.target.value);
    };

    const [Ethnic, setEthnic] = useState('');
    const handleEthnic = (e) => {
        setEthnic(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch('https://lms-tcr1.onrender.com:3000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                secondname: midname,
                IDnumber: ID,
                cellnumber: Cellno,
                altnumber: Altcell,
                email: Email,
                ethnicgroup: Ethnic,
                password: Password,
            }),
        })
        .then((data) => data.json())
        .then((response) => {
            if (response.redirect) {
                console.log('hi');
            }
        });
    };

    return (
        <>
            <h1 className="signup-heading">Student Registration</h1>
            <form id="form1" onSubmit={handleSubmit} className="signup-form">
                <input
                    type="text"
                    id="firstname"
                    placeholder="First name"
                    onChange={handleFirstname}
                    className="form-input"
                />
                <input
                    type="text"
                    id="secondname"
                    placeholder="Middle name"
                    onChange={handleMidname}
                    className="form-input"
                />
                <input
                    type="text"
                    id="lastname"
                    placeholder="Last name"
                    onChange={handleLastname}
                    className="form-input"
                />
                <input
                    type="text"
                    id="IDnumber"
                    placeholder="ID number"
                    onChange={handleID}
                    className="form-input"
                />
                <input
                    type="text"
                    id="cellnumber"
                    placeholder="Cell number"
                    onChange={handleCellno}
                    className="form-input"
                />
                <input
                    type="text"
                    id="altnumber"
                    placeholder="Alternate cell number"
                    onChange={handleAltCell}
                    className="form-input"
                />
                <input
                    type="text"
                    id="email"
                    placeholder="Email"
                    onChange={handleEmail}
                    className="form-input"
                />
                <input
                    type="text"
                    id="ethnicgroup"
                    placeholder="Ethnic group"
                    onChange={handleEthnic}
                    className="form-input"
                />
                <input
                    type="text"
                    id="password"
                    placeholder="Password"
                    onChange={handlePassword}
                    className="form-input"
                />
                <button type="submit" className="form-button">Register</button>
            </form>
            <p className="signup-text">Have an account? <Link to="/login" className="signup-link">Sign in</Link></p>
        </>
    );
}

export default Signup;
