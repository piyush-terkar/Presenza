const express = require('express')
const ejsMate = require('ejs-mate')
const path = require('path')
const morgan = require('morgan')
const methodOverride = require('method-override')
const favicon = require('serve-favicon')
const ExpressError = require('./utils/ExpressError');
const database = require('./database/dbServer')
const app = express()
const mailer = require('./utils/email');
const multer = require('multer')
const request = require('request');
const fs = require("fs");
const { studentSchema, reportSchema } = require('./schemas.js');

const storage = multer.diskStorage({
    destination: 'temp',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({ storage: storage }).single('img');
app.use(express.static('temp'));

const IP = "192.168.1.10";


validateReport = (req, res, next) => {
    const { error } = reportSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

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


function fsExistsSync(myDir) {
    try {
        fs.accessSync(myDir);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

app.post('/register', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('pages/notfound', { stylesheet, jsScript, err });
        } else {
            database.query(`call register("${req.body.student_name}", ${req.body.rollno}, "${req.body.address}", "${req.body.branch}", "${req.body.email}")`, async (err, rows) => {
                if (err) {
                    const stylesheet = 'css/notfound.css';
                    const jsScript = 'js/notfound.js';
                    res.status(500).render('pages/notfound', { stylesheet, jsScript, err });
                } else {
                    if (fsExistsSync("temp/")) {
                        console.log("File Found");
                        fs.readdir("temp/", async (err, files) => {
                            const formData = {
                                'rollno': req.body.rollno,
                                'img': fs.createReadStream("temp/" + files[1])
                            }
                            let result = await request.post({ url: 'http://192.168.1.26:8000', formData: formData }, (err, rs, body) => {
                                if (err) {
                                    database.query(`delete from student where rollno = ${req.body.rollno}`)
                                    fs.unlinkSync(`temp/${files[1]}`);
                                    console.log("File Deleted");
                                    const stylesheet = 'css/notfound.css';
                                    const jsScript = 'js/notfound.js';
                                    res.status(500).render('pages/notfound', { stylesheet, jsScript, err });
                                }
                                else {
                                    console.log("file sent");
                                    console.log(body);
                                    fs.unlinkSync(`temp/${files[1]}`);
                                    console.log("File Deleted");
                                    const stylesheet = 'css/success.css';
                                    const jsScript = 'js/success.js';
                                    res.render('pages/success', { stylesheet, jsScript });
                                }
                            })
                        })
                    }

                }
            })
        }
    })
})

app.get('/report', (req, res) => {
    const stylesheet = 'css/report.css';
    const jsScript = 'js/report.js';
    res.render('pages/report', { stylesheet, jsScript });
})


app.post('/report', validateReport, (req, res) => {
    database.query(`call total_attendence3("${req.body.begin_date}", "${req.body.last_date}")`, function (err, rows) {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    })
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

app.listen(3000, IP, () => {
    console.log("Request handling server listening on port 3000");
})