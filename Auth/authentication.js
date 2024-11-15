const db = require('../database/db')

exports.register = async (req, res) => {
    const {email, password, lastname, firstname, secondname, ethnicgroup, IDnumber, cellnumber, altnumber} = req.body;

    try{
        const [rows] = await db.promise().query('SELECT * FROM students WHERE email = ?', [email])

        if(rows.length > 0){
            console.log(rows)
            console.log('user exists')
            return res.json({message: 'user exists'})
        }

        db.execute('INSERT INTO students (email, firstname, lastname, median_name, password, cell_number, alternate_cell_number, id_number, ethnic_group) VALUES (?,?,?,?,?,?,?,?,?)', [email, firstname, lastname, secondname, password, cellnumber, altnumber, IDnumber, ethnicgroup], (err, results) => {
            if(err){
                console.log('failed to register')
                console.log(err.message)
                return res.json({message: 'resgistration failed'})
            }
            else{
                console.log('registration complete')
            }
        })
    }catch{
        console.log('internal server error')
    }
}


exports.login = async (req, res) => {
    const {password, email} = req.body;
    console.log(password, email)

    try{
        const [rows] = await db.promise().query('SELECT * FROM students WHERE email = ? AND password = ?', [email, password])

    if(rows.length === 0){
        console.log('invalid credentials');
        return res.json({message : 'invalid credentials'})
    }
    else{
        console.log('logged in');
        return res.status(200).json({ redirectURL: 'http://localhost:5173' });
        }
    }catch{
        console.log('internal server error')
    }
}