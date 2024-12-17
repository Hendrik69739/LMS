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

/*
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
*/
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
    if (req.session.user) {
        res.redirect('http://localhost:5173/profile'); 
    } else {
        res.status(200).send('Please log in');
    }
});

app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/check-session', (req, res) => {
    if (req.session.name) {
        res.status(200).json({user : req.session.name});
    } else {
        res.status(401).send('Not authenticated');
    }
});


app.get('/namesetter', (req, res) => {
    res.json({firstname : req.session.firstname, lastname : req.session.lastname})

})

app.post('/assignments', async (req, res) => {
    try {
        const [results] = await db2.promise().query('SELECT * FROM student_tasks ORDER BY id DESC');
        res.json({data : results})
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});

app.delete('/deleteTask/:id', async (req, res) => {
    const id = req.params.id;

    // Perform delete operation based on the `id`
    try {
        // Assuming you have a function to delete the task by ID
        await deleteTaskById(id);
        res.status(200).send({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete task', error: error.message });
    }
});

async function deleteTaskById(id) {
    await db2.promise().query('DELETE FROM student_tasks WHERE id = ?', [id]);
}

app.delete('/deleteAssignment/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await deleteTaskById(id);
        res.status(200).send({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete task', error: error.message });
    }
});

app.delete('/deleteAnouncement/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await deleteAnouncementById(id);
        res.status(200).send({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete task', error: error.message });
    }
});

async function deleteAnouncementById(id) {
    await db2.promise().query('DELETE FROM anouncements WHERE id = ?', [id]);
}


async function deleteTaskById(id) {
    await db2.promise().query('DELETE FROM student_submissions WHERE id = ?', [id]);
}

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

app.post('/student_submissions', async (req, res) => {
    const name = req.session.firstname + ' ' + req.session.lastname
    
    try {
        const [rows] = await db2.promise().query('SELECT * FROM student_submissions WHERE student_name = ?', [name]);
        res.json({ results: rows });
    } catch (error) {
        console.error('Error fetching student submissions:', error);
        res.status(500).send({ message: 'Failed to fetch student submissions' });
    }
});


app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const names = req.body.name;
    const subject = req.body.subject;
    const taskno = req.body.taskno;

    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    const insertSubmissionSQL = 'INSERT INTO student_submissions(submitted_pdf, student_name, subject, id) VALUES (?, ?, ?, ?)';

        db2.query(insertSubmissionSQL, [file.buffer, names, subject, taskno], (err, result) => {
            if (err) {
                console.log(err.message)
                return res.status(500).send('Error storing submission in database');
            }

            res.send('File uploaded and stored in database');
        });
    });


app.post('/uploadTask', upload.single('file'), (req, res) => { 
    const subject = req.body.subject;
    const file = req.file;
    const date2 = req.body.date;
    const taskno = req.body.taskno
    if (!file) { 
        return res.status(400).send('No file uploaded');
    }  
    
    const sql = 'INSERT INTO student_tasks(id, due_date, task_pdf, subject) VALUES(?,?,?,?)';
    db2.query(sql, [taskno, date2, file.buffer, subject], (err, result) => { 
        if (err) throw err; 
        res.send('File uploaded and stored in database');
    }); 
});

app.post('/fetchtasks', async (req, res) => {
    const username = req.body.name;
    const [data] = await db2.promise().query('SELECT * FROM student_submissions WHERE student_name = ?', [username])
    res.json({ results : data})
})

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
    
});

app.post('/anouncements', async (req, res) => {
    const [data] = await db2.promise().query('SELECT * FROM anouncements');
    res.json({results : data})
})

app.post('/sendAnouncements', async (req, res) => {
    const {text, date} = req.body;
    const response = await db2.promise().query('INSERT INTO anouncements(text, date) VALUES(?,?)', [text, date])
})

app.post('/getUsers', async (req, res) => {
    const [data] = await db2.promise().query('SELECT * FROM students')
    res.json({results : data});
})

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('Server failed');
    } 
});
