const express = require('express');
const app = express();
const auth = require('./Controller/auth');
const db2 = require('./database/db2')
const dotenv = require('dotenv');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const multer = require('multer')

dotenv.config();
const cookieParser = require('cookie-parser');
const { redirect } = require('react-router-dom');
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
        res.status(200).send('User has session');
    } else {
        res.status(401).send('Not authenticated');
    }
});

app.get('/cookie-check', (req, res) => {
    if (Object.keys(req.cookies).length > 0) {
        console.log('There are cookies')
        res.status(200).send('There are cookies')
    } else {
        res.status(404).send('No cookies found')
    }
})

app.get('/namesetter', (req, res) => {
    res.json({firstname : req.session.firstname, lastname : req.session.lastname})
})

app.post('/assignments', async (req, res) => {
    try {
        const [results] = await db2.promise().query('SELECT * FROM student_tasks');
        res.json({data : results})
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});

app.get('/download', (req, res) => {
    const id = req.query.id; 
    
    db2.query('SELECT task_pdf FROM student_tasks WHERE id = ?', [id], (error, results) => {
         if (error) { 
            return res.status(500).send('Error fetching file from database');
         } 
         if (results.length === 0) {
             return res.status(404).send('File not found');
         } 

         const pdfBuffer = results[0].submitted_pdf; 
         res.setHeader('Content-Type', 'application/pdf'); 
         res.setHeader('Content-Disposition', 'attachment; filename=assignment.pdf'); 
         res.send(pdfBuffer);
     });
})

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => { 
    const file = req.file;
    const names = req.name;
    const subject = req.subject;
    const taskno = req.taskno;
    if (!file) { 
        return res.status(400).send('No file uploaded');
    }  
    
    const sql = 'INSERT INTO student_submissions (submitted_pdf, student_name, subject, id) VALUES (?,?,?,?)'; 
    db2.query(sql, [file.buffer, names, subject, taskno], (err, result) => { 
        if (err) throw err; 
        res.send('File uploaded and stored in database');
    }); 
});
 

app.post('/count', async (req, res) => {
    const [results] = await db2.promise().query('SELECT COUNT(id) AS total_ids FROM student_submissions');
    const [data] = await db2.promise().query('SELECT COUNT(id) AS total_ids FROM student_tasks');
     res.json({ total_ids: results[0].total_ids, total_id: data[0].total_ids})

})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({message : 'logged out', redirect : '/login'})
})

const time = new Date();
const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
const date = time.toLocaleDateString('en-US', options)

app.post('/events', async (req, res) => {
    const [results] = await db2.promise().query('SELECT * FROM events WHERE time >= ?', [date])
    res.json({date : results})
    
})

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('Server failed');
    } else {
        console.log(`Server running on port ${process.env.PORT}`);
    }
});
