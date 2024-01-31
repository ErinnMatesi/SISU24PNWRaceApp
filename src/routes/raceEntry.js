const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig'); // Ensure the correct path to your dbConfig file

// GET request for list of race entries
router.get('/', (req, res) => {
    pool.query('SELECT * FROM RaceEntries', (error, results) => {
        if (error) {
            console.error('Error fetching data from database:', error);
            return res.status(500).json({ message: 'Error retrieving race entries' });
        }
        res.status(200).json(results);
    });
});

// POST request to add a new race entry
router.post('/', (req, res) => {
    const { racerId, trailId, startTime, endTime, pointsEarned, bonusPointsEarned } = req.body;
    if (!racerId || !trailId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const insertQuery = 'INSERT INTO RaceEntries (RacerID, TrailID, StartTime, EndTime, PointsEarned, BonusPointsEarned) VALUES (?, ?, ?, ?, ?, ?)';
    pool.query(insertQuery, [racerId, trailId, startTime, endTime, pointsEarned, bonusPointsEarned], (error, results) => {
        if (error) {
            console.error('Error inserting data into database:', error);
            return res.status(500).json({ message: 'Error adding race entry' });
        }
        res.status(201).json({ message: 'Race entry added successfully', entryId: results.insertId });
    });
});

// DELETE request to remove a race entry
router.delete('/:entryId', (req, res) => {
    const { entryId } = req.params;

    if (!entryId) {
        return res.status(400).json({ message: 'Entry ID is required' });
    }

    const deleteQuery = 'DELETE FROM RaceEntries WHERE EntryID = ?';
    pool.query(deleteQuery, [entryId], (error, results) => {
        if (error) {
            console.error(`Error deleting race entry with ID: ${entryId}`, error);
            return res.status(500).json({ message: 'Error deleting race entry' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Race entry not found' });
        }
        res.status(200).json({ message: `Race entry with ID ${entryId} deleted successfully.` });
    });
});

module.exports = router;
