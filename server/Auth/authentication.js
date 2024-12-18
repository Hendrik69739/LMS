const db = require('../database/db');

exports.register = async (req, res) => {
    const { email, password, lastname, firstname, secondname, ethnicgroup, IDnumber, cellnumber, altnumber } = req.body;

    try {
        const [rows] = await db.promise().query('SELECT * FROM students WHERE email = ?', [email]);

        if (rows.length > 0) {
            console.log(rows);
            console.log('user exists');
            return res.json({ message: 'user exists' });
        }

        db.execute('INSERT INTO students (email, firstname, lastname, median_name, password, cell_number, alternate_cell_number, id_number, ethnic_group) VALUES (?,?,?,?,?,?,?,?,?)', 
        [email, firstname, lastname, secondname, password, cellnumber, altnumber, IDnumber, ethnicgroup], (err, results) => {
            if (err) {
                console.log('failed to register');
                console.log(err.message);
                return res.json({ message: 'registration failed' });
            } else {
                console.log('registration complete');
                return res.json({ message: 'registration complete' });
            }
        });
    } catch (error) {
        console.log('internal server error');
        console.error(error);
        return res.status(500).json({ message: 'internal server error' });
    }
};


exports.login = async (req, res) => {
    const { password, email } = req.body;
    try {
        const [rows] = await db.promise().query('SELECT * FROM students WHERE email = ? AND password = ?', [email, password]);
        if (rows.length === 0) {
            console.log('Invalid credentials');
            return res.status(401).json({ message: 'Invalid credentials' });
        } else {
            req.session.name = email;
            req.session.firstname = rows[0].firstname;
            req.session.lastname = rows[0].lastname;
            res.cookie('user', email, { 
                maxAge: 1000 * 60 * 60 * 24, 
                httpOnly: true, 
                sameSite: 'None', 
                secure: true 
            });
            console.log('Login successful. Session:', req.session); // Log session details
            return res.status(200).json({ message: 'Login successful', redirect: '/profile/dashboard' });
        }
    } catch (error) {
        console.log('Internal server error');
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
