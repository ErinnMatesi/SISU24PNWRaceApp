const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig'); // Make sure to include the path to your dbConfig

// Get all racers
router.get('/', async (req, res) => {
    try {
      const [results] = await pool.query('SELECT * FROM Racers');
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching racers:', error);
      res.status(500).json({ message: 'Error fetching racers' });
    }
  });

// Fetch racer details by bib number
router.get('/bib/:bibNumber', async (req, res) => {
    const { bibNumber } = req.params;
    console.log(`Fetching racer with bib number: ${bibNumber}`);
    try {
        const [rows, fields] = await pool.query('SELECT * FROM Racers WHERE BibNumber = ?', [bibNumber]);
        if (rows.length > 0) {
            const racerDetails = rows[0];
            console.log('Racer found:', racerDetails);
            res.json(racerDetails);
        } else {
          console.log('Racer not found');
            res.status(404).send('Racer not found');
        }
    } catch (error) {
        console.error('Error fetching racer details:', error);
        res.status(500).send('Internal Server Error');
    }
});

//   Fetch by Racer ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const [results] = await pool.query('SELECT * FROM Racers WHERE RacerID = ?', [id]);
      if (results.length === 0) {
        return res.status(404).json({ message: 'Racer not found' });
      }
      res.status(200).json(results[0]);
  } catch (error) {
      console.error('Error fetching racer:', error);
      res.status(500).json({ message: 'Error fetching racer' });
  }
});

// Add a new racer
router.post('/', async (req, res) => {
    console.log('Received racer data:', req.body);

    let { gender, age, bibNumber, division, firstName, lastName, teamId } = req.body;
    
    const insertQuery = 'INSERT INTO Racers (FirstName, LastName, Gender, Age, BibNumber, Division, TeamID) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    try {
        const [results] = await pool.query(insertQuery, [firstName, lastName, gender, age || null, bibNumber, division, teamId || null]);
        res.status(201).json({ message: 'Racer added successfully', racerId: results.insertId });
    } catch (error) {
        console.error('Error inserting data into database:', error);
        res.status(500).json({ message: 'Error adding racer' });
    }
});

// PUT request to update a racer
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { FirstName, LastName, Gender, Age, BibNumber, Division, TeamID } = req.body;

    console.log('Received data:', req.body);
    
    const updateQuery = `
      UPDATE Racers 
      SET FirstName = ?, LastName = ?, Gender = ?, Age = ?, BibNumber = ?, Division = ?, TeamID = ?
      WHERE RacerID = ?
    `;
    
    try {
      const [results] = await pool.query(updateQuery, [FirstName, LastName, Gender, Age, BibNumber, Division, TeamID || null, id]);
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Racer not found' });
      }
      res.status(200).json({ message: 'Racer updated successfully' });
    } catch (error) {
      console.error('Error updating racer:', error);
      res.status(500).json({ message: 'Error updating racer' });
    }
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
