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

// fetching racer details by bib number
router.get('/:bibNumber', async (req, res) => {
    const { bibNumber } = req.params;
    try {
        const [rows, fields] = await pool.query('SELECT * FROM Racers WHERE BibNumber = ?', [bibNumber]);
        if (rows.length > 0) {
            const racerDetails = rows[0];
            res.json(racerDetails);
        } else {
            res.status(404).send('Racer not found');
        }
    } catch (error) {
        console.error('Error fetching racer details:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add a new racer
router.post('/', (req, res) => {
  let racers = req.body;

  // Check if racers is an array, if not, make it an array
  if (!Array.isArray(racers)) {
      racers = [racers];
  }

  // Optional: Add validation for each racer object

  const insertQuery = 'INSERT INTO Racers (FullName, Gender, Age, BibNumber, Division, TeamID) VALUES ?';
  const values = racers.map(racer => [racer.fullName, racer.gender, racer.age, racer.bibNumber, racer.division, racer.teamId]);

  pool.query(insertQuery, [values], (error, results) => {
      if (error) {
          console.error('Error inserting data into database:', error);
          return res.status(500).json({ message: 'Error adding racers' });
      }
      res.status(201).json({ message: 'Racers added successfully', affectedRows: results.affectedRows });
  });
});


// PUT request to update a racer
router.put('/:racerId', (req, res) => {
  const { racerId } = req.params;
  const { fullName, gender, age, bibNumber, division, teamId } = req.body;

  // Check if racer ID is provided
  if (!racerId) {
      return res.status(400).json({ message: 'Racer ID is required' });
  }

  // Optional: Add additional validation as needed

  // Update logic with error handling
  const updateQuery = 'UPDATE Racers SET FullName = ?, Gender = ?, Age = ?, BibNumber = ?, Division = ?, TeamID = ? WHERE RacerID = ?';
  pool.query(updateQuery, [fullName, gender, age, bibNumber, division, teamId, racerId], (error, results) => {
      if (error) {
          console.error(`Error updating racer with ID: ${racerId}`, error);
          return res.status(500).json({ message: 'Error updating racer' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Racer not found' });
      }
      res.status(200).json({ message: `Racer with ID ${racerId} updated successfully.` });
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
