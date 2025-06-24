import { useState, useEffect } from 'react';
import './grade_coarse.css';
import { useNavigate } from 'react-router-dom';

function MoreInfo() {
    const navigate = useNavigate(); // Moved inside the component

    const [firstname, setFname] = useState('');
    const [lastname, setLname] = useState('');
    const [IDnumber, setID] = useState('');
    const [grade, setGrade] = useState('');
    const [course, setCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [attendance, setAttendance] = useState('');

    const handleGrade = (e) => {
        const selectedGrade = e.target.value;
        setGrade(selectedGrade);

        if (['N3', 'N4', 'N5', 'N6'].includes(selectedGrade)) {
            setCourses(['Mechanic', 'Electrical', 'Industrial']);
        } else if (selectedGrade === 'N2') {
            setCourses(['Fitting & Machining', 'Diesel', 'Electrical', 'Industrial']);
        }
    };

    useEffect(() => {
        const courseSelect = document.getElementById('CS');
        if (!grade) {
            courseSelect.setAttribute('disabled', 'true');
        } else {
            courseSelect.removeAttribute('disabled');
        }

        switch (course) {
            case 'Fitting & Machining':
                setSubjects(['Mathematics', 'Fitting_&_Machining', 'Engineering_Science', 'Engineering_Drawing']);
                break;
            case 'Diesel':
                setSubjects(['Mathematics', 'Diesel', 'EngineeringScience', 'Engineering Drawing']);
                break;
            case 'Mechanic':
                setSubjects(['Mathematics', 'Mechano', 'Engineering Science', 'Engineering Drawing']);
                break;
            default:
                setSubjects([]);
        }
    }, [course, grade]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            firstname, lastname, IDnumber, grade, course, attendance,
            subjects: [
                ...Array.from(document.querySelectorAll('.Mathematicscheckbox:checked')).map(input => input.value),
                ...Array.from(document.querySelectorAll('.Fitting_\\&_Machiningcheckbox:checked')).map(input => input.value),
                ...Array.from(document.querySelectorAll('.Engineering_Sciencecheckbox:checked')).map(input => input.value),
                ...Array.from(document.querySelectorAll('.Engineering_Drawingcheckbox:checked')).map(input => input.value)
            ]
        };

        console.log(formData)

        await fetch('http://locahost:3000/auth/accountsetup', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: 'include'
        }).then(data => data.json()).then((response) => {
            if(response.redirect){
                navigate(response.redirect);
            }
        });
    };

    return (
        <div className="container-div">
            <header>
                <h2>Grade and Course Selection</h2>
            </header>
            <section className="aa2">
                <p>Provide your details and select accordingly to continue</p>
                <form id="aa1" onSubmit={handleSubmit}>
                    <div className='div1'>
                        <input type="text" id="firstname" placeholder="First name" className="form-input" required onChange={(e) => setFname(e.target.value)} />
                        <input type="text" id="lastname" placeholder="Last name" className="form-input" required onChange={(e) => setLname(e.target.value)} />
                        <input type="text" id="id" placeholder="ID number" className="form-input" minLength="13" maxLength="13" required onChange={(e) => setID(e.target.value)} />
                    </div>
                    <div className='div2'>
                        <select id="GS" required onChange={handleGrade}>
                            <option value="">--Select Grade--</option>
                            <option value="N2">N2</option>
                            <option value="N3">N3</option>
                            <option value="N4">N4</option>
                            <option value="N5">N5</option>
                            <option value="N6">N6</option>
                        </select>
                        <select id="CS" required onChange={(e) => setCourse(e.target.value)}>
                            <option value="">--Select Course--</option>
                            {courses.map((course, index) => (
                                <option key={index} value={course}>{course}</option>
                            ))}
                        </select>
                        <select id='AM' onChange={(e) => setAttendance(e.target.value)}>
                            <option value="">--Select Attendance Method--</option>
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                        </select>
                    </div>
                    <div className='div3'>
                        {subjects.map((subject, index) => (
                            <label key={index}>
                                <input type="checkbox" className={`${subject}checkbox`} value={subject} />
                                {subject}
                            </label>
                        ))}
                    </div>
                    <button type="submit" className="proceed-button">Proceed</button>
                </form>
            </section>
        </div>
    );
}

export default MoreInfo;
