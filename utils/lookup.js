/** @format */

let fs = require("fs");

function interval() {
	setInterval(function () {
		function fsExistsSync(myDir) {
			try {
				fs.accessSync(myDir);
				return true;
			} catch (e) {
				return false;
			}
		}
		if (fsExistsSync("temp")) {
			console.log("File Found");
			fs.unlinkSync("temp");
			console.log("File Deleted");
		}
	}, 3000);
}

module.exports({ interval });
