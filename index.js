const express = require('express')
const ejsMate = require('ejs-mate')
const path = require('path')
const morgan = require('morgan')
const methodOverride = require('method-override')
const favicon = require('serve-favicon')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const database = require('./database/dbServer')
const { query } = require('./database/dbServer')
const app = express()
const mailer = require('./utils/email');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const lookup = require('./utils/lookup');
const multer = require('multer')
const { stringify } = require('querystring')

const storage = multer.diskStorage({
    destination: 'temp',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({ storage: storage }).single('img');
app.use(express.static('temp'));

const IP = "192.168.1.10";

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(favicon(path.join(__dirname, 'public/images/favicon.png')))

app.get('/', (req, res) => {
    const stylesheet = 'css/home.css';
    const jsScript = 'js/home.js';
    res.render('pages/home', { stylesheet, jsScript });
})

app.get('/register', (req, res) => {
    const stylesheet = 'css/register.css';
    const jsScript = 'js/register.js';
    res.render('pages/register', { stylesheet, jsScript });
})

app.post('/register', (req, res) => {
    const stylesheet = 'css/success.css';
    const jsScript = 'js/success.js';
    upload(req, res, async (err) => {
        if (err) {
            res.render('pages/notfound', { stylesheet, jsScript });
        } else {
            console.log(req.body.rollno);
            // request IP of RPI to send here (req.file);
            await lookup.interval(req.body.rollno);
            res.render('pages/success', { stylesheet, jsScript });
        }
    })
})

app.get('/report', (req, res) => {
    const stylesheet = 'css/report.css';
    const jsScript = 'js/report.js';
    res.render('pages/report', { stylesheet, jsScript });
})


app.post('/report', (req, res) => {
    database.query(`call total_attendence3(${req.body.begin_date}, ${req.body.last_date})`, function (err, rows) {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    })
})

app.get('/stream', (req, res) => {
    const stylesheet = 'css/streamvideo.css';
    const jsScript = 'js/streamvideo.js';
    IP;
    res.render('pages/streamvideo', { stylesheet, jsScript, IP });
})

let secKey = "hi"
app.post('/mark', (req, res) => {
    if (req.body.handshake) {
        secKey = "hi"
        console.log("handshake initiated")
        res.send(secKey)
    } else if (req.body.SEC_KEY && req.body.SEC_KEY === secKey) {
        console.log("key match")
        if (req.body.rno) {
            database.query(`call attendence_procedure(${req.body.rno});`, function (err, rows) {
                if (err) {
                    console.log("already marked present");
                } else {
                    database.query(`select email from student where rollno = ${req.body.rno};`, function (err, row) {
                        console.log(row[0].email);
                        mailer.sendemail(row[0].email);
                    })
                }
            })
        } else {
            console.log("handshake successfull!");
        }
        secKey = (Math.floor(Math.random() * 100) + 1).toString(2);
        res.send(secKey);
    } else {
        res.send("Nice try but no proxy!");
    }
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'Something Went Wrong!'
    }
    const stylesheet = 'css/notfound.css';
    const jsScript = 'js/notfound.js';
    res.status(statusCode).render('pages/notfound', { stylesheet, jsScript, err });
})

server.listen(3000, IP, () => {
    console.log("Request handling server listening on port 3000");
})