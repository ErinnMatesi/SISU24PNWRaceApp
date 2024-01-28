const express = require('express');
const router = express.Router();

// GET request for list of bonus objectives
router.get('/', (req, res) => {
    // Logic to fetch all bonus objectives
    res.send('List of all bonus objectives');
});

// POST request to add a new bonus objective
router.post('/', (req, res) => {
    // Logic to add a new bonus objective
    res.send('Add a new bonus objective');
});

// DELETE request to remove a bonus objective
router.delete('/:objectiveId', (req, res) => {
    const { objectiveId } = req.params;
    // Logic to delete the bonus objective
    res.send(`Bonus objective with ID ${objectiveId} deleted successfully`);
});

module.exports = router;
