const mysql = require('mysql2')
const dotenv = require('dotenv')

dotenv.config();

db = mysql.createPool({
    host: 'sql309.infinityfree.com',
    user: 'if0_37933761',
    password: '1H3ndr1k4n3',
    database: 'if0_37933761_nated_college'
});

module.exports = db;
