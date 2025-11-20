const mysql = require('mysql2'); // ✅ correct import
const Transport = require('winston-transport'); // ✅ use proper class
require('dotenv').config(); // ✅ ensure env variables are loaded

class MYSQLTransport extends Transport {
    constructor(opts) {
        super(opts);

        this.connection = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || 'root',
            database: process.env.DB_NAME || 'demo4',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    log(info, callback) {
        setImmediate(() => this.emit('logged', info)); // async trigger

        const { level, message } = info;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const sql = 'INSERT INTO logs (level, message, timestamp) VALUES (?, ?, ?)';

        this.connection.query(sql, [level, message, timestamp], (err) => {
            if (err) {
                console.error('MYSQL Log Insert Error:', err.message);
            }
            if (callback) callback(); // finish async log
        });
    }
}

module.exports = MYSQLTransport;
