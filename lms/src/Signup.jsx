import {Link} from 'react-router-dom'
import { useState } from 'react'

function Signup(){

    const [firstname, setFirstname] = useState('')
    const handleFirstname = (e) => {
        setFirstname(e.target.value)
    }

    const [lastname, setLastname] = useState('')
    const handleLastname = (e) => {
        setLastname(e.target.value);
    }

    const [midname, setMidname] = useState('')
    const handleMidname = (e) => {
        setMidname(e.target.value);
    }

    const [ID, setID] = useState('')
    const handleID = (e) => {
        setID(e.target.value);
    }

    const [Cellno, setCellno] = useState('')
    const handleCellno = (e) => {
        setCellno(e.target.value);
    }

    const [Altcell, setAltcell] = useState('')
    const handleAltCell = (e) => {
        setAltcell(e.target.value);
    }

    const [Email, setEmail] = useState('')
    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const [Password, setPass] = useState('')
    const handlePassword = (e) => {
        setPass(e.target.value);
    }

    const [Ethnic, setEthnic] = useState('')
    const handleEthnic = (e) => {
        setEthnic(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch('http://localhost:5137/auth/register', {
            method : 'POST',
            headers : {' Content-Type' : 'application/json'},
            body : JSON.stringify({firstname: firstname, lastname : lastname, secondname : midname, IDnumber : ID, cellnumber : Cellno, altnumber : Altcell, email : Email, ethnicgroup : Ethnic, password : Password})
        })
        .then(data => data.json())
        .then(response => {
            if(response.redirect){
                console.log('hi')
            }
        })
    }

    return(
        <>
        <h1>Student Resgistration</h1>
        <form id="form1" onSubmit={handleSubmit}>
            <input type="text" id="firstname" placeholder="firstname" onChange={handleFirstname}/>
            <input type="text" id="secondname" placeholder="median name" onChange={handleMidname}/>
            <input type="text" id="lastname" placeholder="last name" onChange={handleLastname}/>
            <input type="text" id="IDnumber" placeholder="ID number" onChange={handleID}/>
            <input type="text" id="cellnumber" placeholder="cell number" onChange={handleCellno}/>
            <input type="text" id="altnumber" placeholder="alternate cell number" onChange={handleAltCell}/>
            <input type="text" id="email" placeholder="email" onChange={handleEmail}/>
            <input type="text" id="ethnicgroup" placeholder="ethnic group" onChange={handleEthnic}/>
            <input type="text" id="password" placeholder="password" onChange={handlePassword}/>
            <button type="submit">register</button>
        </form>
       
        <p>Have an account?<Link to='/login'>Sign in</Link></p>
    
        </>
    )
}

export default Signup