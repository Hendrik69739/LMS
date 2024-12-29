const express = require('express');
const app = express();
const auth = require('./Controller/auth');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const multer = require('multer');
const { Pool } = require('pg');
const path = require('path');
const nodemailer = require('nodemailer')
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

app.get('/check-session', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://xsystems.onrender.com"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
}, async (req, res) => {
    try {
        if (req.session && req.session.name) {
            res.status(200).json({ message: 'Session exists', session: req.session.name });
        } else {
            res.status(401).json({ message: 'No active session' });
        }
    } catch {
        res.send('error checking session')
    }
});






app.post('/recover', (req,res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'retshephilengm@gmail.com',
            pass: 'mpij jllx yjig gyyh'
        }
    });
    
    
    const sendEmail = (recipient, subject, message) => {
        const mailOptions = {
            from: 'retshephilengm@gmail.com',
            to: recipient,
            subject: subject,
            text: message
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    };
    
    sendEmail(req.body.email, 'Thank you for contacting us!', 'youll be contacted soon.');    
})



app.post('/namesetter', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://xsystems.onrender.com"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
}, async (req, res) => {
    try {
        res.json({firstname: req.session.firstname, lastname: req.session.lastname});
    } catch (err) {
        res.status(500).json({ why : err.message});
    }
});




app.post('/assignments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students.student_tasks ORDER BY id DESC');
        res.json({data: result.rows});
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});

app.post('/user-info', async (req, res) => {
    try {
        const rows = await pool.query('SELECT * FROM students.students WHERE email = $1', [req.body.user]);

        res.json({ data: rows.rows[0] });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error', why: err.message });
    }
});

app.put('/update-details', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://xsystems.onrender.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
}, async (req, res) => {
    try {
        const { firstname, lastname, ID, email, cell_number, secondname, bio, dob, gender } = req.body;

        if (!ID) {
            return res.status(400).json({ error: 'Missing required ID field' });
        }

        const query = `
            UPDATE students.students 
            SET 
                email = $1, 
                firstname = $2, 
                lastname = $3, 
                cell_number = $4, 
                median_name = $5  
            WHERE 
                id_number = $6
        `;
        const values = [email, firstname, lastname, cell_number, secondname, ID];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        console.log('Update Result:', result);
        res.status(200).json({ message: 'Student updated successfully' });
    } catch (err) {
        console.error('Database update error:', err);
        res.status(500).json({ error: 'Database update error', why: err.message });
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
    await pool.query('DELETE FROM students.student_submissions WHERE id = $1', [id]);
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

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const names = req.body.name;
    const subject = req.body.subject;
    const taskno = req.body.taskno;
    const date = req.body.date;
    const email = req.session.name;

    if (!file) {
        return res.status(400).send('No file uploaded', req.session.name);
    }

    const insertSubmissionSQL = 'INSERT INTO student_submissions(submitted_pdf, student_name, subject, id, time_submitted, student_email) VALUES ($1, $2, $3, $4, $5, $6)';
    pool.query(insertSubmissionSQL, [file.buffer, names, subject, taskno, date, email], (err, result) => {
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
    const result = await pool.query('SELECT * FROM students.student_submissions WHERE student_name = $1', [username]);
    res.json({ results: result.rows });
});

app.get("/home", async (req, res) => {
    const result1 = await pool.query('SELECT COUNT(id) AS total_ids FROM students.student_submissions WHERE student_email = $1', [req.session.name]);
    const result = result1.json();
    res.json({results : result})
})

app.post('/count', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://xsystems.onrender.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
}, async (req, res) => {
    console.log(req)
    try {
        const result1 = await pool.query('SELECT COUNT(id) AS total_ids FROM students.student_submissions WHERE student_email = $1', [req.session.name]);
        const result2 = await pool.query('SELECT COUNT(id) AS total_ids FROM students.student_tasks');
        console.log(result1)
        res.json({ total_ids: result1.rows[0].total_ids, total_id: result2.rows[0].total_ids, email : req.body.email });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error', why : err.message });
    }
});

app.get('/emailsetter', async (req, res) => {
    const email = req.session.name;
    res.send({email : email});
})



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
        const result = await pool.query('SELECT * FROM students.events WHERE date >= $1', [date]);
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

app.post('/getUsers', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://xsystems.onrender.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
}, async (req, res) => {
    console.log(req)
    try {
        const result = await pool.query('SELECT * FROM students.students');
        res.json({ results: result.rows });

    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error', why : err.message });
    }
});



app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('Server failed');
    } else{
console.log('connection successful')
    }
})
