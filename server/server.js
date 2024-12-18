const express = require('express');
const app = express();
const auth = require('./Controller/auth');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const multer = require('multer');
const { Pool } = require('pg');
const path = require('path')
dotenv.config();

const cookieParser = require('cookie-parser');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: ['https://xsystems.onrender.com', 'http://localhost:5173'],
    credentials: true
}));

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    ssl: {
        rejectUnauthorized: false
    },
    options: '--search_path=students'
});
  


app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    proxy: true,
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Secure must be true for production
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
        sameSite: 'None',
        httpOnly: true
    }
}));

app.use('/auth', auth);

app.get('/check-session', (req, res) => {
    console.log('Session Check Request:', req.session);
    console.log('Cookies:', req.cookies);

    if (req.session.name) {
        console.log('Session Found:', req.session.name);
        res.status(200).json({ user: req.session.name });
    } else {
        console.log('No session found:', req.session);
        res.status(401).send('Not authenticated');
    }
});

app.get("/home", (req, res) => {
    const indexPath = path.resolve(__dirname, 'client', 'lms', 'dist', 'index.html');
    console.log('Serving file from:', indexPath);  // Log the resolved path for debugging
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});



app.get('/namesetter', (req, res) => {
    console.log(req)
    res.json({firstname: req.session.firstname, lastname: req.session.lastname});
});

app.post('/assignments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_tasks ORDER BY id DESC');
        res.json({data: result.rows});
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});

app.delete('/deleteTask/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await deleteTaskById(id);
        res.status(200).send({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete task', error: error.message });
    }
});

async function deleteTaskById(id) {
    await pool.query('DELETE FROM student_tasks WHERE id = $1', [id]);
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
        res.status(200).send({ message: 'Announcement deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete announcement', error: error.message });
    }
});

async function deleteAnouncementById(id) {
    await pool.query('DELETE FROM announcements WHERE id = $1', [id]);
}

app.get('/download', (req, res) => {
    const id = req.query.id;
    pool.query('SELECT task_pdf FROM student_tasks WHERE id = $1', [id], (error, results) => {
        if (error) {
            return res.status(500).send('Error fetching file from database');
        }
        if (results.rows.length === 0) {
            return res.status(404).send('File not found');
        }

        const pdfBuffer = results.rows[0].task_pdf;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=assignment.pdf');
        res.send(pdfBuffer);
    });
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/student_submissions', async (req, res) => {
    const name = req.session.firstname + ' ' + req.session.lastname;
    try {
        const result = await pool.query('SELECT * FROM student_submissions WHERE student_name = $1', [name]);
        res.json({ results: result.rows });
    } catch (error) {
        console.error('Error fetching student submissions:', error);
        res.status(500).send({ message: 'Failed to fetch student submissions' });
    }
});

app.get('/', (req, res) => {
    res.send('hello');
});

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const names = req.body.name;
    const subject = req.body.subject;
    const taskno = req.body.taskno;

    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    const insertSubmissionSQL = 'INSERT INTO student_submissions(submitted_pdf, student_name, subject, id) VALUES ($1, $2, $3, $4)';
    pool.query(insertSubmissionSQL, [file.buffer, names, subject, taskno], (err, result) => {
        if (err) {
            console.log(err.message);
            return res.status(500).send('Error storing submission in database');
        }

        res.send('File uploaded and stored in database');
    });
});

app.post('/uploadTask', upload.single('file'), (req, res) => {
    const subject = req.body.subject;
    const file = req.file;
    const date2 = req.body.date;
    const taskno = req.body.taskno;

    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    const sql = 'INSERT INTO student_tasks(id, due_date, task_pdf, subject) VALUES($1, $2, $3, $4)';
    pool.query(sql, [taskno, date2, file.buffer, subject], (err, result) => {
        if (err) throw err;
        res.send('File uploaded and stored in database');
    });
});

app.post('/fetchtasks', async (req, res) => {
    const username = req.body.name;
    const result = await pool.query('SELECT * FROM student_submissions WHERE student_name = $1', [username]);
    res.json({ results: result.rows });
});

app.post('/count', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://xsystems.onrender.com"); // or "http://localhost:5173"
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
}, async (req, res) => {
    try {
        const result1 = await pool.query('SELECT COUNT(id) AS total_ids FROM student_submissions');
        const result2 = await pool.query('SELECT COUNT(id) AS total_ids FROM student_tasks');
        res.json({ total_ids: result1.rows[0].total_ids, total_id: result2.rows[0].total_ids });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error', why : err.message });
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: 'logged out', redirect: '/login' });
});

const time = new Date();
const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
const date = time.toLocaleDateString('en-US', options);

app.post('/events', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://xsystems.onrender.com"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
}, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events WHERE event_date >= $1', [date]);
        res.json({ date: result.rows });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error', why : err.message});
    }
});

app.post('/anouncements', async (req, res) => {
    const result = await pool.query('SELECT * FROM announcements');
    res.json({ results: result.rows });
});

app.post('/sendAnouncements', async (req, res) => {
    const { text, date } = req.body;
    const response = await pool.query('INSERT INTO announcements(text, date) VALUES($1, $2)', [text, date]);
    res.status(201).json({ message: 'Announcement sent', response: response.rows });
});

app.post('/getUsers', async (req, res) => {
    const result = await pool.query('SELECT * FROM students');
    res.json({ results: result.rows });
});


app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('Server failed');
    } else{
console.log('connection successful')
    }
})
