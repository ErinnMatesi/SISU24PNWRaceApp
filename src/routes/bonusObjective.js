const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig'); // Ensure the path to dbConfig is correct

// GET request for list of bonus objectives
router.get('/', (req, res) => {
    pool.query('SELECT * FROM BonusObjectives', (error, results) => {
        if (error) {
            console.error('Error fetching data from database:', error);
            return res.status(500).json({ message: 'Error retrieving bonus objectives' });
        }
        res.status(200).json(results);
    });
});

// POST request to add a new bonus objective
router.post('/', (req, res) => {
    const { description, associatedTrailID, bonusPoints } = req.body;
    if (!description || !associatedTrailID || bonusPoints === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const insertQuery = 'INSERT INTO BonusObjectives (Description, AssociatedTrailID, BonusPoints) VALUES (?, ?, ?)';
    pool.query(insertQuery, [description, associatedTrailID, bonusPoints], (error, results) => {
        if (error) {
            console.error('Error inserting data into database:', error);
            return res.status(500).json({ message: 'Error adding bonus objective' });
        }
        res.status(201).json({ message: 'Bonus objective added successfully', objectiveId: results.insertId });
    });
});

// DELETE request to remove a bonus objective
router.delete('/:objectiveId', (req, res) => {
    const { objectiveId } = req.params;

    if (!objectiveId) {
        return res.status(400).json({ message: 'Objective ID is required' });
    }

    const deleteQuery = 'DELETE FROM BonusObjectives WHERE ObjectiveID = ?';
    pool.query(deleteQuery, [objectiveId], (error, results) => {
        if (error) {
            console.error(`Error deleting bonus objective with ID: ${objectiveId}`, error);
            return res.status(500).json({ message: 'Error deleting bonus objective' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Bonus objective not found' });
        }
        res.status(200).json({ message: `Bonus objective with ID ${objectiveId} deleted successfully.` });
    });
});

module.exports = router;
