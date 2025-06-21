import React from 'react';
import './reset.css';
import { useState, useEffect } from 'react';

function reset(){

const [otp, setOtp] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

let password;



const handleSubmit = async (e) => {
    e.preventDefault();

    if(newPassword !== confirmPassword) {

    }else{
        password = newPassword;
    }

    await fetch('http://localhost:3000/verify', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ otp, email, password })
    })
}

    return(
        <main id='gsm0'>
    <form id="gsm1">
        <label>
            <input className="gsm2" type="text"  placeholder="OTP Code"></input>
        </label>
        <label>
            <input className="gsm2" type="text"  placeholder="New Password"></input>
        </label>
        <label>
            <input className="gsm2" type="text" placeholder="Comfirm Password"></input>
        </label>
        <button className="gsm2-1" type="submit">Change Password</button>
    </form>
</main>
    )
}

export default reset;