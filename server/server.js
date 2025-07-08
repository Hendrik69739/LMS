const express = require('express');
const app = express();
const auth = require('./Controller/auth');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const multer = require('multer');
const nodemailer = require('nodemailer')
dotenv.config();
const db = require('./database/db');
const bcrypt = require('bcrypt');

const cookieParser = require('cookie-parser');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5173'],
    credentials: true
}));

const option = db;

const sessionStore = new MySQLStore(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
    }
);

app.use(session({
    store: sessionStore,
    proxy: true,
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        sameSite: 'Lax',
        httpOnly: true
    }
}));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use('/auth', auth);

app.post('/check-session', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
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

let mail;

app.post('/recover', (req, res) => {


    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const msg = `Your one time OTP ${OTP}`;

    const result = db.query("INSERT INTO students.pswrecovery (email, code, expires_at) VALUES (?, ?, ?)", [req.body.email, OTP, expiresAt], (err, result) => {
        if (err) {
            res.json({ message: 'try again' });
            return;
        } else {
            res.cookie('resetEmail', req.body.email, { httpOnly: true, secure: false, maxAge: 1000 * 60 * 5 });
            res.json({ message: 'Check your email for recovery OTP' })
        }
    })

    mail = req.body.email;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'retshephilengm@gmail.com',
            pass: 'twbt rdxn fexs trgp'
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

    sendEmail(req.body.email, 'LMS password Recovery', msg);
})

app.post('/verify', async (req, res) => {

    const mail = req.cookies.resetEmail;
    const { password, code } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10)

    db.query('SELECT * FROM students.pswrecovery WHERE email = ? AND code = ?', [mail, code], (err, result) => {
        if (err) {
            console.log('Incorrect email and code combination');
        } else {
            if (result) {
                db.query('UPDATE students.students SET password = ? WHERE email = ?', [hashedpassword, mail], (err, result) => { })
                console.log('Password updated successfully');
                res.json({ message: 'Password updated successfully' });
            }
        }
    })
})

app.post('/updateStudentProgress', async (req, res) => {
    const { testdate, markob, testmark, testno, studentid } = req.body;

    try {
        const data = await db.promise().query('Insert into students.progress SET obtained_mark = ?, students_id = ?, test_mark = ?, test_no = ?, test_date = ?', [markob, studentid, testmark, `${req.session.sub}_` + testno, testdate])
        res.json({message: 'Progress updated successfully'});
    } catch {
        res.send('query to database failed',)
    }
})

app.post('/fetchtests', async (req, res) => {
    const username = req.body.username;

    let subject
    

    if(req.session.sub.includes('mathematics')) {
        subject = 'mathematics';
    } else if(req.session.sub.includes('science')) {
        subject = 'science';
    } else if(req.session.sub.includes('egd')) {
        subject = 'egd';
    } else if(req.session.sub.includes('english')) {
        subject = 'english';
    }
    const data = await db.promise().query('SELECT * FROM students.progress WHERE students_id = ? AND test_no LIKE ?', [username, `${subject}_%`]);

    res.json({data: data[0]});

})

app.post('/namesetter', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
}, async (req, res) => {
    try {
        res.json({ firstname: req.session.firstname, lastname: req.session.lastname });
    } catch (err) {
        res.status(500).json({ why: err.message });
    }
});

app.post('/assignments', async (req, res) => {
    try {
        const result = await db.promise().query('SELECT * FROM students.student_tasks Where subject = ? ORDER BY id DESC', [req.session.sub]);
        res.json({ data: result[0] });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});

app.post('/assignment', async (req, res) => {
    try {
        const result = await db.promise().query('SELECT * FROM students.student_tasks ORDER BY id DESC');
        res.json({ data: result[0] });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});

app.post('/user-info', async (req, res) => {
    try {
        const rows = await db.promise().query('SELECT * FROM students.students WHERE email = ?', [req.body.user]);
        res.json({ data: rows[0] });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error', why: err.message });
    }
});

app.put('/update-details', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
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

        const query = `UPDATE students.students SET email = ?, firstname = ?, lastname = ?, cellphone = ? WHERE id_number = ?`;
        const values = [email, firstname, lastname, cell_number, ID];

        const result = await db.promise().query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ message: 'Student updated successfully', successful: true });
    } catch (err) {
        console.error('Database update error:', err);
        res.status(500).json({ error: 'Database update error', why: err.message });
    }
});

app.delete('/deleteTask/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await db.promise().query('DELETE FROM students.student_tasks WHERE id = ?', [id]);
        res.status(200).send({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete task', error: error.message });
    }
});

app.delete('/deleteAssignment/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.promise().query('DELETE FROM students.student_submissions WHERE id = ?', [id]);
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
    await db.promise().query('DELETE FROM students.anouncements WHERE id = ?', [id]);
}

app.get('/download/:id', async (req, res) => {
    const id = req.params.id;
    const data = await db.promise().query('SELECT task_pdf FROM students.student_tasks WHERE id = ?', [id]);

    const pdfBuffer = data[0][0].task_pdf;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=assignment.pdf');
    res.send(pdfBuffer);
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/student_submissions', async (req, res) => {
    const name = req.session.firstname + ' ' + req.session.lastname;
    const email = req.session.name;
    try {
        const result = await db.promise().query('SELECT * FROM students.student_submissions WHERE student_email = ?', [email]);
        res.json({ results: result[0] });
    } catch (error) {
        console.error('Error fetching student submissions:', error);
        res.status(500).send({ message: 'Failed to fetch student submissions' });
    }
});

app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    const names = req.body.name;
    const subject = req.body.subject;
    const taskno = req.body.taskno;
    const date = req.body.date;
    const email = req.session.name;

    if (!file) {
        return res.status(400).send('No file uploaded', req.session.name);
    }

    const insertSubmissionSQL = 'INSERT INTO students.student_submissions(submitted_pdf, student_name, subject, student_id, time_submitted, student_email) VALUES (?, ?, ?, ?, ?, ?)';
    const data = await db.promise().query(insertSubmissionSQL, [file.buffer, names, subject, req.session.std_id, date, email]);
    if (data[0].affectedRows > 0) {
        return res.json({ message: 'Upload Successful' });

    } else {
        return res.status(500).json({ message: 'Failed to upload file' });
    };
});

app.post('/uploadTask', upload.single('file'), (req, res) => {
    const subject = req.session.sub;
    const file = req.file;
    const date2 = req.body.date;
    const taskno = req.body.taskno;

    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    const sql = 'INSERT INTO students.student_tasks(id, due_date, task_pdf, subject) VALUES(?, ?, ?, ?)';
    db.promise().query(sql, [taskno, date2, file.buffer, subject], (err, result) => {
        if (err) throw err;
        res.send('File uploaded and stored in database');
    });
});

app.post('/fetchtasks', async (req, res) => {
    const username = req.body.id;
    const result = await db.promise().query('SELECT * FROM students.student_submissions WHERE student_id = ? AND subject = ?', [username, req.session.sub]);
    res.json({ results: result[0] });

});

app.post('/count', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
}, async (req, res) => {
    try {
        const result1 = await db.promise().query('SELECT COUNT(id) AS total_ids FROM students.student_submissions WHERE student_email = ?', [req.session.name]);
        const result2 = await db.promise().query('SELECT COUNT(id) AS total_ids FROM students.student_tasks');
        res.json({ total_ids: result1[0][0].total_ids, total_id: result2[0][0].total_ids, email: req.body.email });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error', why: err.message });
    }
});

app.get('/emailsetter', async (req, res) => {
    const email = req.session.name;
    res.send({ email: email });
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: 'logged out', redirect: '/login' });
});

const time = new Date();
const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
const date = time.toLocaleDateString('en-US', options);

app.post('/events', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
}, async (req, res) => {
    try {
        const result = await db.promise().query('SELECT * FROM students.events WHERE time >= ?', [date]);

        res.json({ date: result[0] });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error', why: err.message });
    }
});

app.post('/anouncements', async (req, res) => {
    const result = await db.promise().query('SELECT * FROM students.anouncements');
    res.json({ results: result[0] });
});

app.post('/sendAnouncements', async (req, res) => {
    const { text, date } = req.body;
    const response = await db.promise().query('INSERT INTO students.anouncements(text, date) VALUES(?, ?)', [text, date]);
    res.status(201).json({ message: 'Announcement sent', response: response.rows });
});

app.post('/getUsers', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
}, async (req, res) => {
    try {
        const result = await db.promise().query('SELECT * FROM students.students');
        res.json({ results: result[0] });

    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error', why: err.message });
    }
});

db.connect((err) => {
    if (err) {
        console.log('db connection failed', err)
    } else {
        console.log('db connection successful');
    }
})

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('Server failed');
    } else {
        console.log('Server listening at port 3K')
    }
})
/* hendricks API */

