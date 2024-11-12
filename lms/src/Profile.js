import Dashboard from './dashboard';
import Assignment from './assignments';

function Profile(){

    return(
        <html>
    <head>

    </head>
    <body>
        <header>
            <h1>North College</h1>
           
           <div>
           <h2>Hendrick Moselana</h2>
           <img src=""></img>
           </div>
        </header>
        <main>
            <aside>
                <a href="">Dashboard</a>
                <a href="">Assignments</a>
            </aside>
            <section>
              <Assignment></Assignment>
            </section>
        </main>
    </body>
</html>
    )
}

export default Profile;