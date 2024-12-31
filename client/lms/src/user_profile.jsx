import './user_profile.css'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';


function User_Profile() {

    const [results, setResults] = useState([])

    const { username } = useParams();
    console.log(username)

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

    return (
        <>
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

            <div id="cve">
        <div className="test-panel-header">Tests Completed</div>
        <div className="test-content">
            <div className="test">1</div>
        </div>
        <div className="add-test">+</div>
    </div>
        </>
    );

}

export default User_Profile;