const mysql = require('mysql2')
const dotenv = require('dotenv')

dotenv.config();

db2 = mysql.createPool({
    host: '0.tcp.in.ngrok.io',
    user: 'root',
    password: 'H3ndr1k4n3',
    port: '15527',
    database: 'students'
});

module.exports = db2;
