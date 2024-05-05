const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');

// Individual Gendered Leaderboard
router.get('/gender', async (req, res) => {
  const gender = req.query.gender;
  if (!['Male', 'Female'].includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender specified' });
  }

  try {
      const query = `
          SELECT FirstName, LastName, TotalPoints
          FROM Racers
          WHERE Gender = ?
          ORDER BY TotalPoints DESC;
      `;
      const [results] = await pool.query(query, [gender]);
      res.json(results);
  } catch (error) {
      console.error('Error fetching leaderboard for gender:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Team Leaderboard
router.get('/teams', async (req, res) => {
  try {
      const query = `
          SELECT Teams.TeamName, SUM(Racers.TotalPoints) AS TotalTeamPoints
          FROM Teams
          JOIN Racers ON Teams.TeamID = Racers.TeamID
          GROUP BY Teams.TeamID
          ORDER BY TotalTeamPoints DESC;
      `;
      const [results] = await pool.query(query);
      res.json(results);
  } catch (error) {
      console.error('Error fetching teams leaderboard:', error);
      res.status(500).send('Internal Server Error');
  }
});

// 100 Miler leaderboard
router.get('/100milers', async (req, res) => {
  try {
      const query = `
          SELECT FirstName, LastName, TotalMiles
          FROM Racers
          WHERE Division = '100 milers'
          ORDER BY TotalMiles DESC;
      `;
      const [results] = await pool.query(query);
      res.json(results);
  } catch (error) {
      console.error('Error fetching 100 milers leaderboard:', error);
      res.status(500).send('Internal Server Error');
  }
});

module.exports = router;