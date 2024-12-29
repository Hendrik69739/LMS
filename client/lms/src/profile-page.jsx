import './profile-page.css';
import { useState, useEffect } from 'react';

function Profilepage() {
    const [email, setEmail] = useState('');
    const [fname, setFname] = useState('');
    const [Lname, setLname] = useState('');
    const [sname, setSname] = useState('');
    const [cn, setCn] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [bio, setBio] = useState('');
    const [ID, setId] = useState('');
    const [name, setName] = useState('');

    const handleEmail = (e) => setEmail(e.target.value);
    const handleFirstname = (e) => setFname(e.target.value);
    const handleLastname = (e) => setLname(e.target.value);
    const handleSecondname = (e) => setSname(e.target.value);
    const handleCellnumber = (e) => setCn(e.target.value);
    const handleDateofbirth = (e) => setDob(e.target.value);
    const handleGender = (e) => setGender(e.target.value);
    const handleBio = (e) => setBio(e.target.value);
    const handleIDnumber = (e) => setId(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

       try{
        await fetch('https://lms-tcr1.onrender.com/update-details', {
            method : 'PUT',
            credentials: 'include',
            headers : { 'Content-Type' : 'application/json'},
            body : JSON.stringify({firstname : fname, lastname : Lname, ID : ID, email : email, cell_number : cn, secondname : sname, bio : bio, dob : dob, gender : gender})
        })

       } catch{
        console.log('error trying to update details')
       }

    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://lms-tcr1.onrender.com/emailsetter', {
                    method: 'GET',
                    credentials: 'include'
                });
                const result = await response.json();
                setName(result.email);
            } catch (error) {
                console.error('Error fetching email:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (name) {
            const fetchUserInfo = async () => {
                try {
                    const response = await fetch('https://lms-tcr1.onrender.com/user-info', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ user: name })
                    });
                    const data = await response.json();
                    const result = data.data;
                    console.log(result);
                    setEmail(result.email || '');
                    setFname(result.firstname || '');
                    setLname(result.lastname || '');
                    setSname(result.median_name || '');
                    setCn(result.cell_number || '');
                    setDob(result.dob || '');
                    setGender(result.gender || '');
                    setBio(result.biography || '');
                    setId(result.id_number || '');
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            };

            fetchUserInfo();
        }
    }, [name]);

    return (
        <section className="profile-page-section">
            <h2 className="ppheader">Personal Information</h2>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="ads1">
                        <div className="first-cut">
                            <label>First Name<input className="pp-input-field" onChange={handleFirstname} type='text' value={fname} placeholder="First Name" /></label>
                            <label>Middle Name<input className="pp-input-field" onChange={handleSecondname} type='text' value={sname} placeholder="Middle Name" /></label>
                            <label>Last Name<input className="pp-input-field" onChange={handleLastname} type='text' value={Lname} placeholder="Last Name" /></label>
                            <label>Email<input className="pp-input-field" onChange={handleEmail} type='email' value={email} placeholder="Email" /></label>
                            <label>Cell Number<input className="pp-input-field" onChange={handleCellnumber} type='text' value={cn} placeholder="Cell Number" /></label>
                        </div>
                        <div className="second-cut">
                            <label>Date of Birth<input className="pp-input-field" onChange={handleDateofbirth} type='date' value={dob} /></label>
                            <label>Gender<select className="pp-input-field" onChange={handleGender} value={gender}>
                                <option value="">--select--</option>
                                <option value='male'>Male</option>
                                <option value='female'>Female</option>
                            </select></label>
                            <label>ID Number<input type='text' onChange={handleIDnumber} className="pp-input-field" value={ID} placeholder="ID Number" /></label>
                            <label>Biography<textarea className="biography" value={bio} onChange={handleBio}></textarea></label>
                        </div>
                    </div>
                    <div className="ads2">
                        <button type="submit" className="save-btn">Save</button>
                        <button type="reset" className="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Profilepage;
