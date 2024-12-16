const mysql = require('mysql2')
const dotenv = require('dotenv')

dotenv.config();

db = mysql.createPool({
    host : process.env.HOST,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
    user : process.env.USER
});

module.exports = db;
