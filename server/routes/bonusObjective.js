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

    // Check if required fields are provided (assuming description and bonusPoints are required)
    if (!description || bonusPoints === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // associatedTrailID can be null or undefined, so handle it separately
    const trailID = associatedTrailID !== undefined ? associatedTrailID : null;

    const insertQuery = 'INSERT INTO BonusObjectives (Description, AssociatedTrailID, BonusPoints) VALUES (?, ?, ?)';
    pool.query(insertQuery, [description, trailID, bonusPoints], (error, results) => {
        if (error) {
            console.error('Error adding new bonus objective:', error);
            return res.status(500).json({ message: 'Error adding new bonus objective' });
        }
        res.status(201).json({ message: 'New bonus objective added successfully', objectiveId: results.insertId });
    });
});

// PUT request to update a bonus objective
router.put('/:objectiveId', (req, res) => {
    const { objectiveId } = req.params;
    const { description, associatedTrailID, bonusPoints } = req.body;

    // Check if objective ID is provided
    if (!objectiveId) {
        return res.status(400).json({ message: 'Objective ID is required' });
    }

    // Check if required fields are provided (assuming description and bonusPoints are required)
    if (!description || bonusPoints === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // associatedTrailID can be null, so we handle it separately
    const trailID = associatedTrailID !== undefined ? associatedTrailID : null;

    const updateQuery = 'UPDATE BonusObjectives SET Description = ?, AssociatedTrailID = ?, BonusPoints = ? WHERE ObjectiveID = ?';
    pool.query(updateQuery, [description, trailID, bonusPoints, objectiveId], (error, results) => {
        if (error) {
            console.error(`Error updating bonus objective with ID: ${objectiveId}`, error);
            return res.status(500).json({ message: 'Error updating bonus objective' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Bonus objective not found' });
        }
        res.status(200).json({ message: `Bonus objective with ID ${objectiveId} updated successfully.` });
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
