import './profile-page.css'
import { useState, useEffect } from 'react';

function Profilepage(){



   



    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const [email, setEmail] = useState('')
    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const surname = 'Hendrick';

    const [fname, setFname] = useState('')
    const handleFirstname = (e) => {
        setFname(e.target.value)
    }

    const [Lname, setLname] = useState('')
    const handleLastname = (e) => {
        setLname(e.target.value)
    }

    const [sname, setSname] = useState('')
    const handleSecondname = (e) => {
        setSname(e.target.value)
    }

    const [cn, setCn] = useState('')
    const handleCellnumber = (e) => {
        setCn(e.target.value)
    }

    const [dob, setDob] = useState('')
    const handleDateofbirth = (e) => {
        setDob(e.target.value)
    }

    const [gender, setGender] = useState('')
    const handleGender = (e) => {
        setGender(e.target.value)
    }

    const [bio, setBio] = useState('')
    const handleBio = (e) => {
        setBio(e.target.value)
    }

    const [ID, setId] = useState('')
    const handleIDnumber = (e) => {
        setId(e.target.value)
    }

    const [name, setName] = useState('')

    useEffect(() => {
        const data = async () => {
            const name = await fetch('https://lms-tcr1.onrender.com/namesetter')
            setName(name.email)
        }

        data();
    }, [])

    useEffect(() => {
        const pinfo = async () => {

            const results = await fetch('https://lms-tcr1.onrender.com/user-info', {
                method : "POST",
                credentials : 'include',
                body : JSON.stringify({user : name})
            })
            
            const data = results.json();
            console.log(data)
           
        }

        pinfo();
    }, [name])

    return(
        <section className="profile-page-section">
    <h2 className="ppheader">Personal Information</h2>
    <div>
        <form onSubmit={handleSubmit}>
            <div className="ads1">
                <div className="first-cut">
                    <label>first name<input className="pp-input-field" onChange={handleFirstname} type='text' value={fname} placeholder/></label>
                    <label>middle name<input className="pp-input-field" onChange={handleSecondname} type='text' value={sname} placeholder/></label>
                    <label>last name<input className="pp-input-field" onChange={handleLastname} type='text' value={Lname} placeholder/></label>
                    <label>Email<input className="pp-input-field" onChange={handleEmail} type='text' value={email} placeholder/></label>
                    <label>Cell Number<input className="pp-input-field" onChange={handleCellnumber} type='text' value={cn} placeholder/></label>
                </div>
                <div className="second-cut">
                    <label>Date of Birth<input className="pp-input-field" onChange={handleDateofbirth} type='date' value={dob} placeholder/></label>
                    <label>Gender<select className="pp-input-field" onChange={handleGender} type='text' value={gender} placeholder>
                        <option>--select--</option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                        </select></label>
                    <label>ID Number<input type='text' onChange={handleIDnumber} className="pp-input-field" value={ID} placeholder/></label>
                    <label>Biography<textarea className="biography" value={bio} onChange={handleBio} ></textarea></label>
                </div>
            </div>
           <div className="ads2">
            <button type="submit" className="save-btn">Save</button>
            <button type="reset" className="cancel-btn">Cancel</button>
           </div>
        </form>
    </div>
</section>
    )
}

export default Profilepage;