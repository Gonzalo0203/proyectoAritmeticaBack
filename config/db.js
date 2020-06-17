const mysql = require('mysql');

const conectarDB = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'gonzo0203',
        database: 'ADOO'
    });

module.exports = conectarDB;