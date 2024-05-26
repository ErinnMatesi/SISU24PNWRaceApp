const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');

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

// GET request to pull active runners
router.get('/active', async (req, res) => {
    try {
        const query = `
        SELECT RaceEntries.startTime, Racers.firstName, Racers.lastName, Trails.TrailName
        FROM RaceEntries
        JOIN Racers ON RaceEntries.RacerID = Racers.RacerID
        LEFT JOIN Trails ON RaceEntries.TrailID = Trails.TrailID
        WHERE RaceEntries.endTime IS NULL AND RaceEntries.TrailID IS NOT NULL
        ORDER BY RaceEntries.startTime ASC;
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
        WHERE RaceEntries.RacerID = ? AND RaceEntries.EndTime IS NULL
        ORDER BY RaceEntries.StartTime DESC
        LIMIT 1;
        `;
        const results = await pool.query(query, [RacerID]);
        if (results.length > 0) {
            res.json(results[0]);
            console.log("Latest/:RacerID data",  results[0])
        } else {
            res.status(404).json({ message: 'No race entries found for the specified racer.' });
        }
    } catch (error) {
        console.error(`Error fetching the latest race entry for racer ID: ${RacerID}`, error);
        res.status(500).json({ message: 'Error retrieving the latest race entry.' });
    }
});

// GET request for most recent 5 race entries
router.get('/recent', async (req, res) => {
    try {
        const [results] = await pool.query(`
        SELECT e.EntryID, 
               r.FirstName, 
               r.LastName, 
               r.BibNumber, 
               t.TrailName, 
               (e.PointsEarned IS NOT NULL OR e.BonusPointsEarned IS NOT NULL) AS HasPoints,
               b.Description AS BonusObjectiveDescription,
               e.EndTime,
               e.StartTime
        FROM RaceEntries e
        LEFT JOIN Racers r ON e.RacerID = r.RacerID
        LEFT JOIN Trails t ON e.TrailID = t.TrailID
        LEFT JOIN BonusObjectives b ON e.BonusObjectiveID = b.ObjectiveID
        ORDER BY e.EntryID DESC
        LIMIT 5;
        `);
        res.json(results);
    } catch ( error ) {
        console.error('Error fetching recent race entries:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET all race entries for a specific racer
router.get('/:RacerID', async (req, res) => {
  const { RacerID } = req.params;

  const selectQuery = `
    SELECT * FROM RaceEntries WHERE RacerID = ?
  `;

  try {
    const [results] = await pool.query(selectQuery, [RacerID]);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching race entries:', error);
    res.status(500).json({ message: 'Error fetching race entries' });
  }
});

// POST request to add a new CheckOut race entry
router.post('/checkout', async (req, res) => {
    console.log('Received race entry data:', req.body);
    const { racerId, trailId, startTime, endTime, pointsEarned, bonusPointsEarned } = req.body;

    if (!racerId ) {
        return res.status(400).json({ message: 'Missing required field: racerId' });
    }

    const insertQuery = 'INSERT INTO RaceEntries (RacerID, TrailID, StartTime, EndTime, PointsEarned, BonusPointsEarned) VALUES (?, ?, ?, ?, ?, ?)';
    
    try {
        console.log('Inserting race entry with data:', { racerId, trailId, startTime, endTime, pointsEarned, bonusPointsEarned });
        
        const [results] = await pool.query(insertQuery, [racerId, trailId, startTime, endTime, pointsEarned, bonusPointsEarned]);
        
        console.log('Race entry added successfully', results);
        res.status(201).json({ message: 'Race entry added successfully', entryId: results.insertId });
    } catch (error) {
        console.error('Error inserting data into database:', error);
        res.status(500).json({ message: 'Error adding race entry' });
    }
});

// POST Bonus Objective Entry
router.post('/bonusPoints', async (req, res) => {
    const { racerId, bonusPointsEarned, bonusObjectiveId, bonusObjectiveDescription } = req.body;
    
    try {
        // Insert new race entry with bonus points
        const [results] = await pool.query(
            'INSERT INTO RaceEntries (RacerID, BonusPointsEarned, BonusObjectiveID, BonusObjectiveDescription) VALUES (?, ?, ?, ?)', 
            [racerId, bonusPointsEarned, bonusObjectiveId, bonusObjectiveDescription]
        );
        
        // Fetch current totals for the racer
        const [currentTotals] = await pool.query('SELECT TotalPoints FROM Racers WHERE RacerID = ?', [racerId]);
        
        // Calculate new total points
        const newPoints = (currentTotals[0].TotalPoints || 0) + (bonusPointsEarned || 0);
        
        // Update racer's total points
        await pool.query('UPDATE Racers SET TotalPoints = ? WHERE RacerID = ?', [newPoints, racerId]);
        
        res.status(201).json({ message: 'New race entry with bonus points created and racer totals updated successfully.', entryId: results.insertId });
    } catch (error) {
        console.error('Error creating new race entry or updating racer totals:', error);
        res.status(500).json({ message: 'Failed to create new race entry with bonus points and update racer totals.' });
    }
});

// PATCH request to update a race entry with completion status (CheckIn)
router.patch('/checkin/:entryId', async (req, res) => {
    const { entryId } = req.params;
    const { endTime, pointsEarned, mileage, elevationGain } = req.body;

    try {
        const [entry] = await pool.query('SELECT RacerID, TrailID FROM RaceEntries WHERE EntryID = ?', [entryId]);
        if (entry.length === 0) {
            return res.status(404).json({ message: 'Race entry not found' });
        }
        const racerId = entry[0].RacerID;
        const trailId = entry[0].TrailID;

        // Insert current race entry into RacerTrailMap if not already present
        await pool.query('INSERT IGNORE INTO RacerTrailMap (RacerID, TrailID) VALUES (?, ?)', [racerId, trailId]);

        // Count the number of unique trails completed by the racer
        const [uniqueTrailsCount] = await pool.query('SELECT COUNT(DISTINCT TrailID) AS uniqueCount FROM RacerTrailMap WHERE RacerID = ?', [racerId]);
        let bonusPoints = 0;
        if (uniqueTrailsCount[0].uniqueCount >= 4) bonusPoints += 5;
        if (uniqueTrailsCount[0].uniqueCount >= 5) bonusPoints += 2;
        if (uniqueTrailsCount[0].uniqueCount == 6) bonusPoints += 3;

        // Update RaceEntries Table
        const totalPointsEarned = pointsEarned + bonusPoints;
        const updateQuery = 'UPDATE RaceEntries SET EndTime = ?, PointsEarned = ? WHERE EntryID = ?';
        const [updateResults] = await pool.query(updateQuery, [endTime, totalPointsEarned, entryId]);

        if (updateResults.affectedRows === 0) {
            // If no rows were affected, it means the entryId didn't match any records
            return res.status(404).json({ message: 'Race entry not found' });
        }

        // Fetch Current Totals
        const [currentTotals] = await pool.query('SELECT TotalMiles, TotalElevationGain, TotalPoints FROM Racers WHERE RacerID = ?', [racerId]);


        // Step 3: Calculate New Totals
        const newMiles = parseFloat(currentTotals[0].TotalMiles || 0) + parseFloat(mileage);
        const newElevationGain = parseInt(currentTotals[0].TotalElevationGain || 0, 10) + parseInt(elevationGain, 10);
        const newPoints = (currentTotals[0].TotalPoints || 0) + (totalPointsEarned || 0);


        // Step 4: Update Racer's Totals
        await pool.query('UPDATE Racers SET TotalMiles = ?, TotalElevationGain = ?, TotalPoints = ? WHERE RacerID = ?', [newMiles, newElevationGain, newPoints, racerId]);

        res.status(200).json({ message: `Check-in successful and racer totals updated.` });
    } catch (error) {
        console.error(`Error updating race entry with ID: ${entryId}`, error);
        res.status(500).json({ message: 'Error updating race entry' });
    }
});

// EDIT a race entry
router.patch('/raceEntry/:id', async (req, res) => {
    const { id } = req.params;
    const { startTime, endTime, pointsEarned, bonusPointsEarned, bonusObjectiveDescription, trailId } = req.body;
  
    // Fetch the old entry to compare values
    const [oldEntry] = await pool.query('SELECT * FROM RaceEntries WHERE EntryID = ?', [id]);
  
    if (oldEntry.length === 0) {
      return res.status(404).json({ message: 'Race entry not found' });
    }
  
    const old = oldEntry[0];
  
    const fields = [
      startTime ? 'StartTime = ?' : null,
      endTime ? 'EndTime = ?' : null,
      pointsEarned ? 'PointsEarned = ?' : null,
      bonusPointsEarned ? 'BonusPointsEarned = ?' : null,
      bonusObjectiveDescription ? 'BonusObjectiveDescription = ?' : null,
      trailId ? 'TrailID = ?' : null
    ].filter(Boolean).join(', ');
  
    const values = [
      startTime || old.StartTime,
      endTime || old.EndTime,
      pointsEarned || old.PointsEarned,
      bonusPointsEarned || old.BonusPointsEarned,
      bonusObjectiveDescription || old.BonusObjectiveDescription,
      trailId || old.TrailID,
      id
    ].filter(value => value !== undefined);
  
    const updateQuery = `UPDATE RaceEntries SET ${fields} WHERE EntryID = ?`;
  
    try {
      await pool.query(updateQuery, values);
  
      // Update the racer's total points, mileage, and elevation gain
      const pointsDiff = (pointsEarned || 0) - (old.pointsEarned || 0);
      const bonusPointsDiff = (bonusPointsEarned || 0) - (old.bonusPointsEarned || 0);
      const totalPointsDiff = pointsDiff + bonusPointsDiff;
  
      let mileageDiff = 0;
      let elevationGainDiff = 0;
  
      if (trailId) {
        const [newTrail] = await pool.query('SELECT mileage, elevationGain FROM Trails WHERE TrailID = ?', [trailId]);
        if (newTrail.length > 0) {
          mileageDiff = newTrail[0].mileage - (old.trailId ? old.mileage : 0);
          elevationGainDiff = newTrail[0].elevationGain - (old.trailId ? old.elevationGain : 0);
        }
      }
  
      await pool.query(`
        UPDATE Racers 
        SET TotalPoints = TotalPoints + ?, TotalMiles = TotalMiles + ?, TotalElevationGain = TotalElevationGain + ?
        WHERE RacerID = ?
      `, [totalPointsDiff, mileageDiff, elevationGainDiff, old.RacerID]);
  
      res.status(200).json({ message: 'Race entry updated successfully' });
    } catch (error) {
      console.error('Error updating race entry:', error);
      res.status(500).json({ message: 'Error updating race entry' });
    }
  });  

// DELETE race entry and update Racer points/mileage/elevation
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    // Fetch the entry to get the points and other values
    const [entry] = await pool.query('SELECT * FROM RaceEntries WHERE EntryID = ?', [id]);
  
    if (entry.length === 0) {
      return res.status(404).json({ message: 'Race entry not found' });
    }
  
    const e = entry[0];
  
    const deleteQuery = 'DELETE FROM RaceEntries WHERE EntryID = ?';
  
    try {
      await pool.query(deleteQuery, [id]);
  
      // Update the racer's total points, mileage, and elevation gain
      const totalPointsReduction = (e.pointsEarned || 0) + (e.bonusPointsEarned || 0);
      let mileageReduction = 0;
      let elevationReduction = 0;
  
      if (e.trailId) {
        // Fetch the trail details
        const [trail] = await pool.query('SELECT mileage, elevationGain FROM Trails WHERE TrailID = ?', [e.trailId]);
        if (trail.length > 0) {
          mileageReduction = trail[0].mileage;
          elevationReduction = trail[0].elevationGain;
        }
      }
  
      await pool.query(`
        UPDATE Racers 
        SET TotalPoints = TotalPoints - ?, TotalMiles = TotalMiles - ?, TotalElevationGain = TotalElevationGain - ?
        WHERE RacerID = ?
      `, [totalPointsReduction, mileageReduction, elevationReduction, e.RacerID]);
  
      res.status(200).json({ message: 'Race entry deleted successfully' });
    } catch (error) {
      console.error('Error deleting race entry:', error);
      res.status(500).json({ message: 'Error deleting race entry' });
    }
  });   

module.exports = router;