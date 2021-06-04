/** @format */

const mysql = require("mysql");

const database = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: "presenza"
});

database.connect((err) => {
	if (err) {
		console.log(err)
	} else {
		console.log("Database connected");
	}
})

module.exports = database;