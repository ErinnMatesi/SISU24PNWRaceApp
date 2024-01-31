const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');

// GET request for list of trails
router.get('/', (req, res) => {
    pool.query('SELECT * FROM Trails', (error, results) => {
        if (error) {
            console.error('Error fetching data from the database:', error);
            return res.status(500).json({ message: 'Error retrieving trails'})
        }
        res.status(200).json(results);
    })
});

module.exports = router;
