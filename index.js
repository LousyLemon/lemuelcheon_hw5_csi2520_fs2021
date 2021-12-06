const express = require("express");
const path = require('path');
const mysql = require("mysql");
const ejs = require("ejs");

//Pooling and cleardb concepts by:bezkoder

const CONCURRENCY = process.env.WEB_CONCURRENCY || 1;

// Create express app
const app = express();

// Create a database connection configuration : riptutorial.com
const db = mysql.createPool({
  connectionLimit:10,
  host: "us-cdbr-east-04.cleardb.com",
  user: "b3822c535bff92",
  password: "390a7ba0",
  database: "heroku_d4debc4fa394a6f"
});

// Establish connection with the DB
db.getConnection((err) => {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to db...`);
    
    db.query("drop table if exists user_answers", function (err, result) {
      if (err) throw err;
      console.log("Table cleared for new session.");
    });
    
    db.query("create table if not exists user_answers (q1 varchar(255), q2 varchar(255), q3 varchar(255), q4 varchar(255), q5 varchar(255), q6 varchar(255))", function (err, result) {
      if (err) throw err;
      console.log("Table created for new session.");
    });    
  }
});

// Initialize Body Parser Middleware to parse data sent by users in the request object
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse HTML form data

// Initialize ejs Middleware
app.set("view engine", "ejs");
//app.set('views', path.join(__dirname, 'views'));
app.use("/public", express.static(__dirname + "/public"));

// routes

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/insertanswers", (req, res) => {
  let data = { q1: req.body.q1, q2: req.body.q2, 
  q3: req.body.q3, q4: req.body.q4,
  q5: req.body.q5, q6: req.body.q6 };
  let sql = `INSERT INTO user_answers SET ?`;
  let query = db.query(sql, data, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(`student entry was inserted to the db...`);
  });
});

app.post("/updateanswers", (req, res) => {
  let sql = `UPDATE user_answers SET email = '${req.body.studentNewEmailUpdate}'  WHERE id = ${req.body.studentID}`;
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(`student entry was updated in the db...`);
  });
});

app.post("/deleteanswers", (req, res) => {
  let sql = `DELETE FROM user_answers`;
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(`User entries deleted from db...`);
  });
});

app.get("/readanswers", (req, res) => {
  let sql = `SELECT * FROM user_answers`;
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.render("readData", { data: result });
  });
});

// Setup server ports
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}.`)
});
