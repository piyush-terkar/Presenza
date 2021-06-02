/** @format */
const fs = require("fs");
const { format } = require("path");
const FormData = require('form-data');
const request = require('request')
function interval(rollno) {
	function fsExistsSync(myDir) {
		try {
			fs.accessSync(myDir);
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
	if (fsExistsSync("temp/")) {
		console.log("File Found");
		fs.readdir("temp/", (err, files) => {
			const formData = {
				'rollno': rollno,
				'img': fs.createReadStream("temp/" + files[1])
			}
			request.post({ url: 'http://192.168.1.26:8000', formData: formData })
			console.log("file sent");
			console.log(files[1]);
			fs.unlinkSync(`temp/${files[1]}`);
			console.log("File Deleted");
		})
	}
}
module.exports = { interval };
