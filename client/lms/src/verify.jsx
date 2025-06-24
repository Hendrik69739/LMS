import './reset.css';
import { useState } from 'react';

function Reset(){

const [otp, setOtp] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

let password;



const handleSubmit = async (e) => {
    e.preventDefault();

    if(newPassword !== confirmPassword) {
        console.log('passwords do not match');
        return;
    }else{
        password = newPassword;
    }

    const data = await fetch('http://localhost:3000/verify', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({ otp, password })
    })

    const result = await data.json();
    if(result.message){
        window.location.href = '/success';
    }

}

    return(
        <main id='gsm0'>
                        <h2 id='bock'>Check your email for OTP code</h2>
    <form id="gsm1" onSubmit={handleSubmit}>
        <label>
            <input className="gsm2" type="text"  placeholder="OTP Code" onChange={(e) => {setOtp(e.target.value)}}></input>
        </label>
        <label>
            <input className="gsm2" type="text"  placeholder="New Password" onChange={(e) => {setNewPassword(e.target.value)}}></input>
        </label>
        <label>
            <input className="gsm2" type="text" placeholder="Comfirm Password" onChange={(e) => {setConfirmPassword(e.target.value)}}></input>
        </label>
        <button className="gsm2-1" type="submit">Change Password</button>
    </form>
</main>
    )
}

export default Reset;