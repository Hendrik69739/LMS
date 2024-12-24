import { useState } from 'react';
import './forgetpass.css'
import { Link } from 'react-router';

function Forgottenpass(){

    const [email, setEmail] = useState('')

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = async (e) => {
       e.preventDefault();

       await fetch('https://lms-tcr1.onrender.com/recover', {
        method: "POST",
        credentials : 'include',
        headers : { "Content-Type" : "application/json"},
        body: JSON.stringify({email : email})
       }
       )
    }


    return(
        <main className="forgotpass-main">
            <div className="forgetpass-container">
                <h1 className="forgotpass-header">Recover your account</h1>
                <hr/>
                <p>Please enter your email address below</p>
                <form onSubmit={handleSubmit}>
                    <input type="email" onChange={handleEmail} className="forgottenpass" placeholder="Email" required></input>
                    <br/>
                    <button type="submit" className="recover-btn">Recover</button>
                </form>
            </div>
            <Link to='/login'>Login</Link>
        </main>
    )
}

export default Forgottenpass;