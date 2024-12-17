import './dash.css';
import { useState, useEffect } from 'react';

function Dashboard() {
    const [count, setCount] = useState('');
    const [count2, setCount2] = useState('');

    useEffect(() => {
        const assignments = async () => {
            const data = await fetch('https://lms-tcr1.onrender.com:3000/count', {
                method: 'POST',
                credentials: 'include'
            });
            const response = await data.json();
            setCount(response.total_ids);
            setCount2(response.total_id);
        };
        assignments();
    }, []);

    const [event, setEvent] = useState([]); // Initialize as an array

    useEffect(() => {
        const time = async () => {
            const results = await fetch('https://lms-tcr1.onrender.com:3000/events', {
                method: 'POST',
                credentials: 'include'
            });

            const data = await results.json();
            setEvent(data.date);
        };
        time();
    }, []);

    console.log(event)

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
                            <h1>5</h1>
                            <p>Tests Completed</p>
                        </div>
                    </div>

                    <div id='progress'>
                        <div id='length_sizing'>
                            <label>Mechanical<div className='progress_bar' id='mech_progress_bar'></div></label>
                            <div className='progress_bar' id='math_progress_bar'></div>
                            <div className='progress_bar' id='drawing_progress_bar'></div>
                            <div className='progress_bar' id='sci_progress_bar'></div>
                        </div>
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
                            <p key={data.time}>{data.event}<br/>{data.time}</p>
                        ))}
                       </aside>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Dashboard;
