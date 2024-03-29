const mysql = require('mysql2');

// Load environment variables
require('dotenv').config();

// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// Create a MySQL pool
const pool = mysql.createPool(dbConfig).promise();

// Export the pool
module.exports = pool;
