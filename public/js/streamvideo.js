const IP = document.querySelector('#ip').innertext;
const socket = io.connect(`http://localhost:5000`);

const video = document.querySelector("#videoElement");
let livefeed;
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
            livefeed = stream;
        })
        .catch(function (err0r) {
            console.log("Something went wrong!");
        });
}


socket.on('connect', () => {
    console.log("connected");
    setInterval(async () => {
        livefeed = livefeed.toString();
        socket.emit('video', livefeed);
        console.log('data sent');
    }, 100)
})

