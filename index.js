const express = require("express");
const mysql = require("mysql");
const ejs = require("ejs");

// Create express app
const app = express();

// Create a database connection configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "mydb"
});

// Establish connection with the DB
db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log(`Successful connected to the DB....`);
    /*con.query("CREATE DATABASE mydb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
    });
    var sql = "create table students (name varchar(255), email varchar(255))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });*/
  }
});

// Initialize Body Parser Middleware to parse data sent by users in the request object
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse HTML form data

// Initialize ejs Middleware
app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));

// routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/insertanswers", (req, res) => {
  let data = { name: req.body.studentName, email: req.body.studentEmail };
  let sql = `INSERT INTO students SET ?`;
  let query = db.query(sql, data, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(`student entry was inserted to the db...`);
  });
});

app.post("/updateanswers", (req, res) => {
  let sql = `UPDATE students SET email = '${req.body.studentNewEmailUpdate}'  WHERE id = ${req.body.studentID}`;
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(`student entry was updated in the db...`);
  });
});

app.post("/deleteanswers", (req, res) => {
  let sql = `DELETE FROM students WHERE email = '${req.body.studentEmail}'`;
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(`student entry was deleted in the db...`);
  });
});

app.get("/readanswers", (req, res) => {
  let sql = `SELECT * FROM students`;
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.render("readData", { data: result });
  });
});

// Setup server ports
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
