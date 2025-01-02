import './user_profile.css'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';


function User_Profile() {

    const [results, setResults] = useState([])

    const { username } = useParams();

    useEffect(() => {
        const fetchtasks = async () => {
            const response = await fetch(`https://lms-tcr1.onrender.com/fetchtasks`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username })
            })

            const data = await response.json();
            setResults(data.results)
        }
        fetchtasks();
    }, [username])

    function slide() {
        const testPanel = document.getElementById('test-panel');
        if (testPanel.style.transform === 'translateY(-120%)') {
            testPanel.style.transform = 'translateY(0%)';
            testPanel.stye.zIndex = '8';
        } else {
            testPanel.style.transform = 'translateY(-120%)';
        }

    }

    const [testno, setTestno] = useState('')
    const handleTestno = (e) => {
        setTestno(e.target.value)
    }

    const [testmark, setTestmark] = useState('')
    const handleTestMark = (e) => {
        setTestmark(e.target.value)
    }

    const [markob, setMarkob] = useState('')
    const handleMarkOb = (e) => {
        setMarkob(e.target.value)
    }

    const [testdate, setTestdate] = useState('')
    const handleTestDate = (e) => {
        setTestdate(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch('https://lms-tcr1.onrender.com/updateStudentProgress', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ testdate: testdate, markob: markob, testmark: testmark, testno: testno, username: username }),
            credentials: 'include'
        }
        )
    }

    const [data, setData] = useState('')

    useEffect(() => {
        const fetchTests = async () => {

            const data = await fetch('https://lms-tcr1.onrender.com/fetchtests', {
                method : 'POST',
                headers : { 'Content-Type': 'application/json' },
                body : JSON.stringify({ username: username })
        })

            const response = data.json();
            setData(response);

        }
        fetchTests;
    }, [username])

    return (
        <div className='admin-content'>
            <div className="submitted_tasks">
                <header className="submission_bin">
                    <h2>Submitted Tasks</h2>
                </header>
                {results && results.length > 0 ? results.map((data) => (
                    <div className="mxc2" key={data.id}>
                        <div className="mcx1">
                            <p>{data.subject}</p>
                        </div>
                    </div>
                )) : <p>No submitted tasks found</p>}
            </div>

            <div className='thf'>
                <div id="cve">
                    <div className="test-panel-header">Tests Completed</div>
                    {data.length > 0 ? data.map((info) => (
                        <>
                            <div className="test-content">
                                <div className="test">{info.subject_name}</div>
                            </div>
                        </>
                    ))
                        :
                        <>
                        <p>no data</p>
                        </>}
                    <div className="test-content">
                        <div className="test">1</div>
                    </div>
                    <div className="add-test" onClick={slide} id="add-test">+</div>
                </div>

                <div id="test-panel">
                    <form className="test-details-form" onSubmit={handleSubmit}>
                        <label className='bbt'>Test no <input type="text" onChange={handleTestno} id="testNo" className="space" required /></label>
                        <label className='bbt'>Marks obtained <input type="text" onChange={handleMarkOb} id="marksO" className="space" required /></label>
                        <label className='bbt'>Test mark <input type="text" id="testMark" onChange={handleTestMark} className="space" required /></label>
                        <label className='bbt'>Test date <input type="text" id="testDate" onChange={handleTestDate} className="space" required /></label>
                        <button type="submit" className="nvm">Submit</button>
                    </form>
                </div>
            </div>

        </div>
    );

}

export default User_Profile;