const express = require('express');
const router = express.Router();

// GET request for list of teams
router.get('/', (req, res) => {
    // Logic to fetch all teams
    res.send('List of all teams');
});

// POST request to add a new team
router.post('/', (req, res) => {
    // Logic to add a new team
    res.send('Add a new team');
});

// DELETE request to remove a team
router.delete('/:teamId', (req, res) => {
    const { teamId } = req.params;
    // Logic to delete the team
    res.send(`Team with ID ${teamId} deleted successfully`);
});

module.exports = router;
