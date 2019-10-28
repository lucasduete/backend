const mysql = require('mysql');

const MysqlConnection = mysql.createConnection({
    host: "127.0.0.1",
    "user": "root",
    "password": "2525",
    "database": "rocketneo" 
});

MysqlConnection.connect();

module.exports = MysqlConnection;