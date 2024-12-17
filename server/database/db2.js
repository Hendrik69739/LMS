const mysql = require('mysql2')
const dotenv = require('dotenv')

dotenv.config();

db2 = mysql.createPool({
    host: '4.tcp.eu.ngrok.io',
    user: 'root',
    password: 'H3ndr1k4n3',
    port: '18299',
    database: 'students'
});

module.exports = db2;
