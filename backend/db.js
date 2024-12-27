// db.js
const mysql = require('mysql2');

// Create a connection pool (recommended for production)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'public_user', // Replace with your database user
  password: '',        // Replace with your database password (empty here)
  database: 'backend_db', // Replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export the pool for use in other files
module.exports = pool.promise();
