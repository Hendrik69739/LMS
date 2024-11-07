import './App.css';

function App() {
    return(<html>
      <head>
        <meta name='viewport' content='width: device-width, initial-scale: 1.0'></meta>
        <link rel='stylesheet' href='App.css'></link>
      </head>
      <body>
        <main>
          <h1>North College</h1>
        </main>
        <aside>
        <h2 align='center'>Sign in</h2>
        <form id='form1'>
        <input type='email' placeholder='Email'></input>
          <input type='password' placeholder='Password'></input>
          <button id='subtn'>Login</button>
        </form>
        <p align='center'>Don't have an account? <a href='/register'>Sign up</a></p>
        </aside>
      </body>
      <script>
        
    </script>
    </html>)
}

export default App;
