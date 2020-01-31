
var port = process.env.PORT || 3000;
var session = require('express-session');
const express = require('express');
const path = require('path');
var cookie = require('cookie');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const mysqlBackbone = require('mysql-backbone');
const multer = require('multer');
const FTPStorage = require('multer-ftp');
const fs = require("fs")
const app = express();
const url = require("url");
const dateTime = require('date-time');
const bcrypt = require('bcryptjs');
var session = require('express-session');
const dotenv = require('dotenv').config();
var sessionstorage = require('sessionstorage');
const saltRounds = 10;
var datetime = new Date();
var today_date = datetime.toISOString().slice(0, 10);
//joining path of directory 
const directoryPath = path.join(__dirname, 'public/uploads');
var doc_id, insert_id;

//memory leak issue solving line and session creation
var MemoryStore = require('memorystore')(session)

app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  resave: false,
  saveUninitialized: false,
  secret: 'sies docs'
}))

//for awaking mysql connection
setInterval(function () {
  connection.query('SELECT 1');
}, 60000);

//Creating Get Connection Function for creating connection by simply calling it.

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true
});

connection.connect(function (err) {
  if (err) console.log(err);
  else {

    console.log("connected");
  }
});


//for cache control
app.use(function (req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
})




//specifing upload folder
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')

  },
  filename: (req, file, cb) => {
    req.session.ftpfilename = Date.now() + file.originalname,
      req.session.userfilename = file.originalname,
      console.log(req.session.ftpfilename)
    cb(null, req.session.ftpfilename)
  }
});

// this saves your file into a directory called "uploads"
const upload = multer({
  storage: storage
});


//setting view engine to ejs, to able to render ejs files
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/views"));

//including public folder for accessing files present in public folder
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views/partials"));
var urlencodedParser = bodyParser.urlencoded({ extended: false });



//Setting the homepage or start page Route
app.get('/', function (req, res) {
  res.render('pages/start');
});

app.get('/map', function (req, res) {
  res.render('pages/map');
});

app.get('/loginpage', function (req, res) {
  res.render('pages/loginpage');
});

app.get('/foodrequest', function (req, res) {
  res.render('pages/food_request');
});

app.get('/regpage', function (req, res) {
  res.render('pages/regpage');
});


app.get('/dashboard', function (req, res) {
  res.render('pages/dashboard');
})

app.get('/donatefood', function (req, res) {
  res.render('pages/donatefood');
})

//Creating a Listen Port for accepting Requests
app.listen(port, function () {
  console.log('Listening at port 3000');
});