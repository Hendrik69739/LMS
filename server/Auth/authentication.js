const db = require('../database/db');
const bcrypt = require('bcrypt');

const hashedpss = async (psw) => {
    return await bcrypt.hash(psw, 10);
}

exports.register = async (req, res) => {
    const { email, password, lastname, firstname, ID, coarse } = req.body;

    try {
        const { rows } = await db.promise().query('SELECT * FROM students.students WHERE id_number = ?', [ID]);


        if (!rows === 0) {
            return res.json({ message: 'user exists' });
        }



        const hashedpassword = await hashedpss(password);

        const query = `
            INSERT INTO students.students (email, firstname, lastname, password, id_number, course) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const results = await db.promise().query(query, [email, firstname, lastname, hashedpassword, ID, coarse]);
        console.log('Registration complete');


        if (results[0].affectedRows > 0) {
            const rows = await db.promise().query('SELECT * FROM students.students WHERE email = ? ', [email]);

            if (rows === null) {
                console.log('Invalid credentials');
                return res.status(401).json({ message: 'Invalid credentials' });
            } else {

                req.session.name = email;
                req.session.firstname = firstname;
                req.session.lastname = lastname;
                req.session.std_id = ID;

                req.session.save((err) => {
                    if (err) {
                        console.error('Session save error:', err);
                        return res.status(500).json({ message: 'Session save error', error: err.message });
                    }

                    res.cookie('user', email, {
                        maxAge: 1000 * 60 * 60 * 24,
                        httpOnly: false,
                        sameSite: 'Lax',
                        secure: false
                    });

                    return res.status(200).json({
                        message: 'Login successful',
                        redirect: '/profile'
                    });
                });
            }
        }

    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ message: 'internal server error', why: error.message, errno : error.errno });
    }
};

exports.login = async (req, res) => {
    const { password, email } = req.body;



    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    try {
        const rows = await db.promise().query('SELECT * FROM students.students WHERE email = ?', [email]);

        const data = rows[0];

        if (data[0] == null) {
            console.log('Invalid credentials');
            return res.status(401).json({ message: 'User account not registered', failed: "login failed" });
        }

        bcrypt.compare(password, data[0].password, (err, result) => {
            if (err) {
                res.json({ message: 'Incorrect Password' })
            } else if (!result) {
                console.log('Incorrect Password');
                return res.status(401).json({ message: 'Incorrect Password', failed: "login failed" });

            }

            req.session.std_id = data[0].id_number;
            req.session.name = email;
            req.session.firstname = data[0].firstname;
            req.session.lastname = data[0].lastname;
            if (req.session.name == 'admin@math.com') {
                req.session.sub = 'mathematics';
            } else if (req.session.name == 'admin@science.com') {
                req.session.sub = 'science';

            } else if (req.session.name === 'admin@egd.com') {
                req.session.sub = 'egd';

            } else if (req.session.name === 'admin@english.com') {
                req.session.sub = 'english';
            }
            else if (req.session.name === 'admin@fitting.com' || 'admin@mechano.com') {
                req.session.sub = 'fitting-mechano';

            }
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.status(500).json({ message: 'Session save error', error: err.message });
                }


                res.cookie('user', email, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: false,
                    sameSite: 'Lax',
                    secure: false
                });

                return res.status(200).json({
                    message: 'Login successful',
                    redirect: '/profile/dashboard'
                });
            });
        });

    } catch (error) {
        console.log('Internal server error');
        console.error(error.errno);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


