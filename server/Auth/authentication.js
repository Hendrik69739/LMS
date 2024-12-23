const db = require('../database/db');

exports.register = async (req, res) => {
    const { email, password, lastname, firstname, secondname, ethnicgroup, IDnumber, cellnumber, altnumber } = req.body;

    try {
        const { rows } = await db.query('SELECT * FROM students.students WHERE email = $1', [email]);

        if (rows.length > 0) {
            console.log('User exists:', rows);
            return res.json({ message: 'user exists' });
        }

        const query = `
            INSERT INTO students.students (email, firstname, lastname, median_name, password, cell_number, alternate_cell_number, id_number, ethnic_group) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        const results = await db.query(query, [email, firstname, lastname, secondname, password, cellnumber, altnumber, IDnumber, ethnicgroup]);
        console.log('Registration complete');

        if(results.rowCount = 1){
            const { rows } = await db.query('SELECT * FROM students.students WHERE email = $1 AND password = $2', [email, password]);

        if (rows.length === 0) {
            console.log('Invalid credentials');
            return res.status(401).json({ message: 'Invalid credentials' });
        } else {
            req.session.name = email;
            req.session.firstname = rows[0].firstname;
            req.session.lastname = rows[0].lastname;

            console.log('Session before saving:', req.session);

            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.status(500).json({ message: 'Session save error', error: err.message });
                }

                res.cookie('user', email, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: false,
                    sameSite: 'None',
                    secure: true
                });

                console.log('Session after saving:', req.session);
                console.log('Set-Cookie Header:', res.get('Set-Cookie'));

                return res.status(200).json({
                    message: 'Login successful',
                    redirect: '/profile'
                });
            });
        }
        } 

    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ message: 'internal server error', why : error.message });
    }
};

exports.login = async (req, res) => {
    const { password, email } = req.body;
    try {
        const { rows } = await db.query('SELECT * FROM students.students WHERE email = $1 AND password = $2', [email, password]);

        if (rows.length === 0) {
            console.log('Invalid credentials');
            return res.status(401).json({ message: 'Invalid credentials', failed : "login failes" });
        } else {
            req.session.name = email;
            req.session.firstname = rows[0].firstname;
            req.session.lastname = rows[0].lastname;

            console.log('Session before saving:', req.session);

            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.status(500).json({ message: 'Session save error', error: err.message });
                }

                res.cookie('user', email, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: false,
                    sameSite: 'None',
                    secure: true
                });

                console.log('Session after saving:', req.session);
                console.log('Set-Cookie Header:', res.get('Set-Cookie'));

                return res.status(200).json({
                    message: 'Login successful',
                    redirect: '/profile/dashboard'
                });
            });
        }
    } catch (error) {
        console.log('Internal server error');
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
