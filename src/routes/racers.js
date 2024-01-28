const express = require('express');
const router = express.Router();

// Get all racers
router.get('/', (req, res) => {
    res.send('List of all racers');
});

// Add a new racer
router.post('/', (req, res) => {
    res.send('Add a new racer');
});

// DELETE request to remove a racer
router.delete('/:racerId', (req, res) => {
  // Extract racerId from the request parameters
  const { racerId } = req.params;

  // Logic to delete the racer from the database
  // (You'll replace this with actual database logic)
  console.log(`Deleting racer with ID: ${racerId}`);

  // Send a response back
  res.send(`Racer with ID ${racerId} deleted successfully.`);
});

module.exports = router;
