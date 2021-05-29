/** @format */

const mysql = require("mysql");

const database = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: "student database",
});
