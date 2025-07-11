import './dash.css';
import { useState, useEffect } from 'react';

function Dashboard() {
    const [count, setCount] = useState('');
    const [count2, setCount2] = useState('');
    const [count3, setCount3] = useState('');


    const [namesetter, setNamesetter] = useState('');

    useEffect(() => {
        const setName = async () => {
            const data = await fetch('http://localhost:3000/namesetter', {
                method: 'POST',
                credentials: 'include'
            });

            const response = await data.json();
            setNamesetter(response.firstname + " " + response.lastname);
        };
        setName();
    }, []);

    const [emailsetter, setEmailsetter] = useState('');

    useEffect(() => {
        const setName = async () => {
            const data = await fetch('http://localhost:3000/emailsetter', {
                method: 'GET',
                credentials: 'include'
            });

            const response = await data.json();
            setEmailsetter(response.email);
        };
        setName();
    }, []);

    useEffect(() => {
        const assignments = async () => {
            const data = await fetch('http://localhost:3000/count', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ email: emailsetter })
            });
            const response = await data.json();
            console.log(response);
            setCount(response.total_ids);
            setCount2(response.total_id);
        };
        assignments();
    }, [emailsetter]);

     useEffect(() => {
        const assignments = async () => {
            const data = await fetch('http://localhost:3000/Tcount', {
                method: 'POST',
                credentials: 'include',
            });
            const response = await data.json();
            console.log(response);
            setCount3(response.total_ids);
        };
        assignments();
    }, [emailsetter]);

    const [event, setEvent] = useState([]);
    console.log(count3)

    useEffect(() => {
        const time = async () => {
            const results = await fetch('http://localhost:3000/events', {
                method: 'POST',
                credentials: 'include'
            });

            const data = await results.json();
            console.log(data);
            setEvent(data.date);
        };
        time();
    }, []);

    console.log(count, count2);

    return (
        <>
            <div id='body'>
                <main id='dashmain' className='assignment__main'>
                    <div>
                        <div>
                            <h1>{count}/{count2}</h1>
                            <p>Assignments<br /> Completed</p>
                        </div>
                        <div>
                            <h1>{count3}/8</h1>
                            <p>Tests Completed</p>
                        </div>
                    </div>

                    <div id='progress'>
                        <section id='progress-section'>
                            <label htmlFor="mechanical"> Mechano<div id="mechanical" className="progress-bar"></div></label>
                            <label htmlFor="maths"> Mathematics<div id="maths" className="progress-bar"></div></label>
                            <label htmlFor="science">Engineering Science<div id="science" className="progress-bar"></div></label>
                            <label htmlFor="egd">EGD<div id="egd" className="progress-bar"></div></label>
                        </section>
                    </div>
                </main>
                <section id='dash_section'>
                    <div id='calender'>
                        <iframe src="https://calendar.google.com/calendar/embed?src=retshephilengm%40gmail.com&ctz=UTC" width="340" height="300"></iframe>
                    </div>
                    <div id='upcoming'>
                        <header className='dash_header'> <h4>Upcoming</h4></header>
                        <aside className='dash_aside'>
                            {event.map((data) => (
                                <p key={data.time}>{data.event}<br />{data.time}</p>
                            ))}
                        </aside>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Dashboard;
