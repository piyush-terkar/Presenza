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
const server = require('http').Server(app);
const io = require('socket.io')(server);


const IP = "127.0.0.1";


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
    res.send('Use \'/\' and your page name, We don\'t have a homepage for this project...');
})

app.get('/register', (req, res) => {
    const stylesheet = 'css/register.css';
    const jsScript = 'js/register.js';
    res.render('pages/register', { stylesheet, jsScript });
})

app.post('/register', (req, res) => {
    const stylesheet = 'css/success.css';
    const jsScript = 'js/success.js';
    console.log(req.body);
    res.render('pages/success', { stylesheet, jsScript });
})

app.get('/report', (req, res) => {
    const stylesheet = 'css/report.css';
    const jsScript = 'js/report.js';
    res.render('pages/report', { stylesheet, jsScript });
})


app.post('/report', (req, res) => {
    const stylesheet = 'css/success.css';
    const jsScript = 'js/success.js';
    res.render('pages/success', { stylesheet, jsScript });
})

app.get('/stream', (req, res) => {
    const stylesheet = 'css/streamvideo.css';
    const jsScript = 'js/streamvideo.js';
    IP;
    res.render('pages/streamvideo', { stylesheet, jsScript, IP });
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

server.listen(3000, () => {
    console.log("Request handling server listening on port 3000");
})