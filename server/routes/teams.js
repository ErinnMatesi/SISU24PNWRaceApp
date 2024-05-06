const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig'); // Adjust the path as needed

// GET request for list of teams
router.get('/', (req, res) => {
    pool.query('SELECT * FROM Teams', (error, results) => {
        if (error) {
            console.error('Error fetching data from database:', error);
            return res.status(500).json({ message: 'Error retrieving teams' });
        }
        res.status(200).json(results);
    });
});

// POST request to add a new team
router.post('/', async (req, res) => {
    const { teamName } = req.body;
    if (!teamName) {
        return res.status(400).json({ message: 'Team name is required' });
    }

    try {
        const [results] = await pool.query('INSERT INTO Teams (TeamName) VALUES (?)', [teamName]);
        console.log('Team added successfully', results);
        res.status(201).json({ message: 'Team added successfully', teamId: results.insertId });
    } catch (error) {
        console.error('Error inserting data into database:', error);
        res.status(500).json({ message: 'Error adding team' });
    }
});

// DELETE request to remove a team
router.delete('/:teamId', (req, res) => {
    const { teamId } = req.params;

    if (!teamId) {
        return res.status(400).json({ message: 'Team ID is required' });
    }

    const deleteQuery = 'DELETE FROM Teams WHERE TeamID = ?';
    pool.query(deleteQuery, [teamId], (error, results) => {
        if (error) {
            console.error(`Error deleting team with ID: ${teamId}`, error);
            return res.status(500).json({ message: 'Error deleting team' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json({ message: `Team with ID ${teamId} deleted successfully.` });
    });
});

module.exports = router;
