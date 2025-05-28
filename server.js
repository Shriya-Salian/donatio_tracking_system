const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root123',
    database: 'login_database'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL');
});

// Handle registration requests
app.post('/register', (req, res) => {
    const { fName, lName, email, passwords } = req.body;
    const sql = 'INSERT INTO users (fName, lName, email, passwords) VALUES (?, ?, ?, ?)';
    connection.query(sql, [fName, lName, email, passwords], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error inserting data into the database');
        }
        res.redirect('/donor_home.html');
    });
});

// Handle login requests
app.post('/login', (req, res) => {
    const { email, passwords } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND passwords = ?';
    connection.query(sql, [email, passwords], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Error: ' + err.message);
        }
        if (results.length > 0) {
            // Redirect to donor_home.html if login is successful
            res.redirect('/donor_home.html');
        } else {
            // Handle login failure (e.g., redirect back to login page or show an error message)
            res.redirect('/login.html');
        }
    });
});

// Handle donation form
app.post('/donate_form', (req, res) => {
    const { name, age, phone, address, campaign } = req.body;
    const sql = 'INSERT INTO donate_form (name, age, phone, address, campaign) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [name, age, phone, address, campaign], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error inserting data into the database');
        }
        res.send('Donation is Successful Thank you for donation');
        res.redirect('/donor_home.html');
    });
});

// Tracking donations
app.get('/track_donation', (req, res) => {
    const sql = 'SELECT * FROM donate_form';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching donations:', err);
            return res.status(500).send('Error fetching donations');
        }
        res.json(results);
    });
});

app.get('/track_donation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'track_donation.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});