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

       const results = await fetch('http://locahost:3000/recover', {
        method: "POST",
        credentials : 'include',
        headers : { "Content-Type" : "application/json"},
        body: JSON.stringify({email : email})
       }
       )

       const data = await results.json();
       if(data.message){
        window.location.href = '/verify';
       }
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
            <Link to='/login' id='bmg'>Sign In</Link>
        </main>
    )
}

export default Forgottenpass;