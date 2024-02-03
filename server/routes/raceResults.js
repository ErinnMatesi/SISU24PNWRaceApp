const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig'); // Ensure the correct path to your dbConfig file

// GET request for race results
router.get('/', (req, res) => {
    pool.query('SELECT * FROM RaceResults', (error, results) => {
        if (error) {
            console.error('Error fetching data from database:', error);
            return res.status(500).json({ message: 'Error retrieving race results' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
