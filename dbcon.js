// dbcon.js database connection file for boat_slip db

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: {host},
	port: 3306,
    user: {user},
    password: {pw},
    database: {DB}
});
module.exports.pool = pool;