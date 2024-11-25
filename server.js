const express = require('express')
const app = express()
const path = require('path')
const db = require('./database/db')
const auth = require('./Controller/auth')
const dotenv = require('dotenv')
const mysql = require('mysql2')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
dotenv.config();

const dbOptions = {
    host : process.env.HOST,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
    user : process.env.USER
}

const connection = mysql.createConnection(dbOptions);
const sessionStore = new MySQLStore({
    expiration: 1000 * 60 * 60 * 24 * 3,
    checkExpirationInterval: 1000 * 60

}, connection);

app.use(express.json())
app.use(session({ 
    key: 'session_cookie_name',
    secret: 'your_secret_key',
    store: sessionStore, 
    resave: false, 
    saveUninitialized: false, 
    cookie: { secure: false,
        maxAge : 1000 * 60 * 60 * 24 * 3,
     }
 }));
 app.use('/auth', auth)


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'registration.html'))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'))
})

app.listen(process.env.PORT, (err) => {
    if(err){
        console.log('server failed')
    }else{
        console.log('server started successfully at port 3k')
    }
})