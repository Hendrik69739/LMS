const express = require('express');
const app = express();
const path = require('path');
const db = require('./database/db');
const auth = require('./Controller/auth');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

dotenv.config();
const cookieParser = require('cookie-parser');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const dbOptions = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
};

const connection = mysql.createConnection(dbOptions);
const sessionStore = new MySQLStore({
    expiration: 1000 * 60 * 60 * 24 * 3, 
    checkExpirationInterval: 1000 * 60 
}, connection);

app.use(express.json());
app.use(session({ 
    key: 'session_cookie_name',
    secret: 'your_secret_key',
    store: sessionStore, 
    resave: false, 
    saveUninitialized: false, 
    cookie: { 
        secure: false, 
        maxAge: 1000 * 60 * 60 * 24 * 3, 
        domain: 'localhost'
    }
}));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/auth', auth);

app.get('/login', (req, res) => {
    console.log('Login page requested');
    if (req.session.user) {
        res.redirect('http://localhost:5173/profile'); 
    } else {
        res.status(200).send('Please log in');
    }
});

app.get('/check-session', (req, res) => {
    if (req.session.name) {
        console.log('user has a session')
        res.status(200).send('User has session');
    } else {
        res.status(401).send('Not authenticated');
    }
});

app.get('/cookie-check', (req, res) => {
    if(req.cookies){
        console.log('the are cookies')
        res.status(200).send('there are cookies')
    }else{
        res.status(404).send('no cookies found')
    }
})

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('Server failed');
    } else {
        console.log(`Server started successfully at port ${process.env.PORT}`);
    }
});
