const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'motion_db'
});

db.connect(err => {
  if (err) {
    console.error('Database error:', err);
  } else {
    console.log('Database connected');
  }
});

module.exports = db;  