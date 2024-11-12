const db = require('../database/db')

exports.register = (req, res) => {
    const {email, password, lastname, firstname, secondname, ethnicgroup, IDnumber, cellnumber, altnumber} = req.body;

    try{
        const rows = db.promise().query('SELECT * FROM students WHERE email = ?', [email])

        if(rows.length > 0){
            console.log('user exists')
            return res.json({message: 'user exists'})
        }
        db.execute('INSERT INTO students (email, firstname, lastname, median_name, password, cell_number, alternate_cell_number, id_number, ethnic_group) VALUES (?,?,?,?,?,?,?,?,?)', [email, firstname, lastname, secondname, password, cellnumber, altnumber, IDnumber, ethnicgroup], (err, results) => {
            if(err){
                console.log('failed to register')
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