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
router.get('/latest/:RacerID', async (req, res) => {
    const { RacerID } = req.params;
    try {
        const query = `
        SELECT RaceEntries.*, Trails.BasePoints, Trails.FirstTenPoints, Trails.SecondTenPoints, Trails.TrailName, Trails.Distance, Trails.ElevationGain
        FROM RaceEntries
        JOIN Trails ON RaceEntries.TrailID = Trails.TrailID
        WHERE RaceEntries.RacerID = ?
        ORDER BY RaceEntries.StartTime DESC
        LIMIT 1;
        `;
        const results = await pool.query(query, [RacerID]);
        if (results.length > 0) {
            res.json(results[0]);
            console.log("Race Entry data",  results[0])
        } else {
            res.status(404).json({ message: 'No race entries found for the specified racer.' });
        }
    } catch (error) {
        console.error(`Error fetching the latest race entry for racer ID: ${RacerID}`, error);
        res.status(500).json({ message: 'Error retrieving the latest race entry.' });
    }
});

// POST request to add a new race entry
// router.post('/', async (req, res) => {
//     console.log('Received race entry data:', req.body);
//     const { racerId, trailId, startTime, endTime, pointsEarned, bonusPointsEarned } = req.body;

//     if (!racerId || !trailId) {
//         return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const insertQuery = 'INSERT INTO RaceEntries (RacerID, TrailID, StartTime, EndTime, PointsEarned, BonusPointsEarned) VALUES (?, ?, ?, ?, ?, ?)';
    
//     try {
//         console.log('Inserting race entry with data:', { racerId, trailId, startTime, endTime, pointsEarned, bonusPointsEarned });
        
//         const [results] = await pool.query(insertQuery, [racerId, trailId, startTime, endTime, pointsEarned, bonusPointsEarned]);
        
//         console.log('Race entry added successfully', results);
//         res.status(201).json({ message: 'Race entry added successfully', entryId: results.insertId });
//     } catch (error) {
//         console.error('Error inserting data into database:', error);
//         res.status(500).json({ message: 'Error adding race entry' });
//     }
// });

// router.post('/', (req, res) => {
//     console.log('Received race entry data:', req.body);
//     res.status(200).json({ message: 'Test response' });
// });


// PATCH request to update a race entry with completion status
router.patch('/checkin/:entryId', async (req, res) => {
    const { entryId } = req.params;
    const { endTime, pointsEarned, mileage, elevationGain } = req.body;
// for debugging
console.log('req.body to see if mileage, elevation gain and points have made it', req.body);

    try {
        const [entry] = await pool.query('SELECT RacerID FROM RaceEntries WHERE EntryID = ?', [entryId]);
        if (entry.length === 0) {
            return res.status(404).json({ message: 'Race entry not found' });
        }
        const racerId = entry[0].RacerID;

        // Step 1: Update RaceEntries Table
        const updateQuery = 'UPDATE RaceEntries SET EndTime = ?, PointsEarned = ? WHERE EntryID = ?';
        const [updateResults] = await pool.query(updateQuery, [endTime, pointsEarned, entryId]);

        if (updateResults.affectedRows === 0) {
            // If no rows were affected, it means the entryId didn't match any records
            return res.status(404).json({ message: 'Race entry not found' });
        }

        // Step 2: Fetch Current Totals
        const [currentTotals] = await pool.query('SELECT TotalMiles, TotalElevationGain, TotalPoints FROM Racers WHERE RacerID = ?', [racerId]);

        // for debugging
        console.log(`Current totals: Miles=${currentTotals[0].TotalMiles}, ElevationGain=${currentTotals[0].TotalElevationGain}, Points=${currentTotals[0].TotalPoints}`);
        console.log(`Adding: Miles=${mileage}, ElevationGain=${elevationGain}, Points=${pointsEarned}`);
        
        // Step 3: Calculate New Totals
        const newMiles = (currentTotals[0].TotalMiles || 0) + (mileage || 0);
        const newElevationGain = (currentTotals[0].TotalElevationGain || 0) + (elevationGain || 0);
        const newPoints = (currentTotals[0].TotalPoints || 0) + (pointsEarned || 0);
        
        // For debugging
        console.log(`New totals: Miles=${newMiles}, ElevationGain=${newElevationGain}, Points=${newPoints}`);


        // Step 4: Update Racer's Totals
        await pool.query('UPDATE Racers SET TotalMiles = ?, TotalElevationGain = ?, TotalPoints = ? WHERE RacerID = ?', [newMiles, newElevationGain, newPoints, racerId]);

        res.status(200).json({ message: `Check-in successful and racer totals updated.` });
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
