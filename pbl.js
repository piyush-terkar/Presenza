/** @format */
// const fs = require("fs");
const webcamElement = document.getElementById("webcam");
const canvasElement = document.getElementById("canvas");
const webcam = new Webcam(webcamElement, "user", canvasElement);
webcam
	.start()
	.then((result) => {
		console.log("webcam started");
	})
	.catch((err) => {
		console.log(err);
	});

const stop = document.getElementById("stop");
stop.onclick = function () {
	webcam.stop();
};

const start = document.getElementById("start");
start.onclick = function () {
	webcam.start();
};

// function snapPicture() {
// 	webcam.snap();
// }

// const snap = document.getElementById("snap");
// snap.onclick = function () {
// 	webcam.snap();
// };

const downloadPicture = document.getElementById("download-photo");
downloadPicture.onclick = function () {
	let picture = webcam.snap();
	downloadPicture.href = picture;
};
