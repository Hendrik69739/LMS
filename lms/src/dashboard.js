import dash_css from './dash.css'

function Dashboard(){

    return(
        <html>
            <head>
                <link rel="stylesheet" href={dash_css}></link>
            </head>
            <body id='body'>
                <main id='dashmain'>

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

                    <div id='progress'></div>
                </main>
                <section>
                <div id='calender'>
                    <h4>Calender</h4>
                </div>
                <div id='upcoming'>
                <h4>upcoming</h4>
                </div>
                </section>
            </body>
        </html>
    )

}

export default Dashboard;