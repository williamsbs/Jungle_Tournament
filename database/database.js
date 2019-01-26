const mysql = require("mysql");

const portSQL = 3306;
const hostSQL = '127.0.0.1';

const connection = mysql.createPool({
	host: hostSQL,
	port: portSQL,
	user: "username",
	password: "password",
	database: "jungledb",
	connectionLimit: 10,
	getConnection: 0,
	acquireTimeout: 10000
});

module.exports = connection;