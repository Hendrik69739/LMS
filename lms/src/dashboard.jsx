import './dash.css'

function Dashboard(){


    return(
       <>
            <div id='body'>
                <main id='dashmain' className='assignment__main'>

                    <div>
                        <div>
                            <h1>5</h1>
                            <p>Assignments<br></br> Completed</p>
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
                <h4>upcoming</h4>
                </div>
                </section>
            </div>
            </>
    )

}

export default Dashboard;