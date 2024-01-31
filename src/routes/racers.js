const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig'); // Make sure to include the path to your dbConfig

// Get all racers
router.get('/', (req, res) => {
    pool.query('SELECT * FROM Racers', (error, results) => {
        if (error) {
            console.error('Error fetching data from database:', error);
            return res.status(500).json({ message: 'Error retrieving racers' });
        }
        res.status(200).json(results);
    });
});

// Add a new racer
router.post('/', (req, res) => {
    // Example validation: Check if required fields are present
    const { fullName, gender, bibNumber, division } = req.body;
    if (!fullName || !gender || !bibNumber || !division) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Insert logic with error handling
    const insertQuery = 'INSERT INTO Racers (FullName, Gender, BibNumber, Division) VALUES (?, ?, ?, ?)';
    pool.query(insertQuery, [fullName, gender, bibNumber, division], (error, results) => {
        if (error) {
            console.error('Error inserting data into database:', error);
            return res.status(500).json({ message: 'Error adding racer' });
        }
        res.status(201).json({ message: 'Racer added successfully', racerId: results.insertId });
    });
});

// DELETE request to remove a racer
router.delete('/:racerId', (req, res) => {
    const { racerId } = req.params;

    if (!racerId) {
        return res.status(400).json({ message: 'Racer ID is required' });
    }

    const deleteQuery = 'DELETE FROM Racers WHERE RacerID = ?';
    pool.query(deleteQuery, [racerId], (error, results) => {
        if (error) {
            console.error(`Error deleting racer with ID: ${racerId}`, error);
            return res.status(500).json({ message: 'Error deleting racer' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Racer not found' });
        }
        res.status(200).json({ message: `Racer with ID ${racerId} deleted successfully.` });
    });
});

module.exports = router;
