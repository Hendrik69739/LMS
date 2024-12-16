import './user_profile.css'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';


function User_Profile() {

    const [results, setResults] = useState([])

    const { username } = useParams();
    console.log(username)

    useEffect(() => {
        const fetchtasks = async () => {
            const response = await fetch(`http://localhost:3000/fetchtasks`, {
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
            {results.length > 0 ? results.map((data) => (
                <div className="submitted_tasks" key={data.id}>
                    <header className="submission_bin">
                        <h2>Submitted Tasks</h2>
                    </header>
                    <div className="mxc2">
                        <div className="mcx1">
                            <p>{data.subject}</p>
                        </div>
                    </div>
                </div>
            ))

                : <></>}
        </>

    )
}

export default User_Profile;