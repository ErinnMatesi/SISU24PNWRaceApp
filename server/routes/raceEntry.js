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

router.get('/active', async (req, res) => {
    try {
        const query = `
            SELECT RaceEntries.startTime, Racers.firstName, Racers.lastName 
            FROM RaceEntries 
            JOIN Racers ON RaceEntries.RacerID = Racers.RacerID 
            WHERE RaceEntries.endTime IS NULL 
            ORDER BY RaceEntries.startTime ASC
        `;
        const [activeEntries] = await pool.query(query);
        res.json(activeEntries);
    } catch (error) {
        console.error('Error fetching active race entries:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET request for the latest race entry of a specific racer
router.get('/latest/:racerId', async (req, res) => {
    const { racerId } = req.params;
    try {
        const query = `
            SELECT RaceEntries.*, Trails.BasePoints, Trails.FirstTenPoints, Trails.SecondTenPoints, Trails.Name as TrailName
            FROM RaceEntries
            JOIN Trails ON RaceEntries.TrailID = Trails.ID
            WHERE RaceEntries.RacerID = ?
            ORDER BY RaceEntries.StartTime DESC
            LIMIT 1;
        `;
        const results = await pool.query(query, [racerId]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'No race entries found for the specified racer.' });
        }
    } catch (error) {
        console.error(`Error fetching the latest race entry for racer ID: ${racerId}`, error);
        res.status(500).json({ message: 'Error retrieving the latest race entry.' });
    }
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

// PUT request to update a race entry with completion status
router.put('/checkin/:entryId', async (req, res) => {
    const { entryId } = req.params;
    const { endTime, pointsEarned } = req.body; // Directly using pointsEarned sent from the frontend

    try {
        const updateQuery = 'UPDATE RaceEntries SET EndTime = ?, PointsEarned = ? WHERE EntryID = ?';
        const results = await pool.query(updateQuery, [endTime, pointsEarned, entryId]);

        if (results.affectedRows === 0) {
            // If no rows were affected, it means the entryId didn't match any records
            return res.status(404).json({ message: 'Race entry not found' });
        }

        res.status(200).json({ message: `Race entry with ID ${entryId} updated successfully.` });
    } catch (error) {
        console.error(`Error updating race entry with ID: ${entryId}`, error);
        res.status(500).json({ message: 'Error updating race entry' });
    }
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
