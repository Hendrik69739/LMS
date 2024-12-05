const mysql = require('mysql2')
const dotenv = require('dotenv')

dotenv.config();

db2 = mysql.createPool({
    host : process.env.HOST,
    password : process.env.PASSWORD,
    database : process.env.DATABASE2,
    user : process.env.USER
});

module.exports = db2;
