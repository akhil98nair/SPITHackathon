
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

app.get('/hungerspot', function (req, res) {
  res.render('pages/hunger_spot');
});

app.get('/loginpage', function (req, res) {
  res.render('pages/loginpage');
});
app.get('/supportus', function (req, res) {
  res.render('pages/supportus');
});
app.get('/foodrequest', function (req, res) {
  res.render('pages/food_request');
});

app.get('/regpage', function (req, res) {
  res.render('pages/regpage');
});

app.post('/submit_regform',urlencodedParser,function(req,res){

  try {
    var qry = `SELECT email_id,mobile_no FROM user_details WHERE  email_id = '${req.body.email_id}' or mobile_no = '${req.body.mobile_no}' `
    connection.query(qry, function (error, results) {
      if (error) console.log(error);
      else {
        console.log(results)
        if (results.length <= 0) {

          var hash = bcrypt.hashSync(req.body.user_password, saltRounds);
          var document = mysqlBackbone.Model.extend({
            connection: connection,
            tableName: "user_details",
          });
        
          var user = new document({
            name: req.body.name,
            email_id: req.body.email_id,
            password:hash,
            mobile_no:req.body.mobile_no,
            address: req.body.address,
            account_type: req.body.account_type,
          });
          user.save().then(function (result) {
            if (result.affectedRows !== 0) {
              console.log("User Created");
              res.send('Account Created')
            }
          });

        }
        else {
           if (results[0].email_id.toLowerCase() == req.body.email_id.toLowerCase()) {
            res.send("email id already exists");
          }
          else if (results[0].mobile_no == req.body.mobile_no) {
            res.send("mobile no id already exists");
          }

          else {
            // console.log("No Problem")
          }
        }
      }})}
        catch{console.log("Error")}

  
})

// Post Route for Login Submit Button
app.post('/login_submit', urlencodedParser, function (req, res) {

  try {
    // //var connection = getConnection();
    var email_id = req.body.username;
    var password = req.body.password;
    if (email_id && password) {
      var qry = `select name, user_id, user_type, email_id, user_password from users where email_id='${req.body.username}';`
      connection.query(qry, function (error, results, fields) {
        if (error) console.log(error);
        else {
          if (results.length > 0) {
            var result = bcrypt.compareSync(req.body.password, results[0].user_password);
          }

          if (results.length > 0 && result == true) {
            req.session.user_type = results[0].user_type;
            req.session.user_id = results[0].user_id;
            req.session.email_id = results[0].email_id;
            req.session.username = results[0].name;
            var document = mysqlBackbone.Model.extend({
              connection: connection,
              tableName: "logs",
            });
            var doc = new document({
              user_id: req.session.user_id,
              action_performed: "Login",
              action_info: req.session.user_id + " Logged In",
              date: dateTime()

            });
            doc.save().then(function (result) {
              if (result.affectedRows > 0) {
                // console.log("Log Added.");
                var redirect = req.session.returnTo || '/update_delete_users';
                res.send({ login: "Login Successful", redirect: redirect });
              }
            });
            // res.redirect(req.session.returnTo || '/update_delete_users')
          }
          else {
            // console.log('Incorrect Username and/or Password!');
            res.send("Invalid Credentials");
          }
        }

      });
    }
    else {
      // console.log('Please enter Username and Password!');
      res.redirect("/login");
    }
  }
  catch (error) {
    console.log(error);
  }
});


app.get('/dashboard', function (req, res) {
  res.render('pages/dashboard');
})

app.get('/donatefood', function (req, res) {
  res.render('pages/donatefood');
})
app.get('/addhungerspot', function (req, res) {
  res.render('pages/addhungerspot');
})
//Creating a Listen Port for accepting Requests
app.listen(port, function () {
  console.log('Listening at port 3000');
});