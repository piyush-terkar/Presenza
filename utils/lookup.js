/** @format */
const fs = require("fs");
const { format } = require("path");
const FormData = require('form-data');
const request = require('request');
const database = require("../database/dbServer");
function interval(rollno) {

}
if (fsExistsSync("temp/")) {
	console.log("File Found");
	fs.readdir("temp/", async (err, files) => {
		const formData = {
			'rollno': rollno,
			'img': fs.createReadStream("temp/" + files[1])
		}
		let result = await request.post({ url: 'http://192.168.1.26:8000', formData: formData }, (err, rs, body) => {
			if (err) {
				database.query(`delete from student where rollno = ${req.body.rollno}`)
				fs.unlinkSync(`temp/${files[1]}`);
				console.log("File Deleted");
			}
			else {
				console.log("file sent");
				console.log(body);
				fs.unlinkSync(`temp/${files[1]}`);
				console.log("File Deleted");
			}
		})
	})
} else {
	return false;
}
}
module.exports = { interval };
