const express = require('express');
const router = express.Router();

// GET request for list of trails
router.get('/', (req, res) => {
    // Logic to fetch all trails
    res.send('List of all trails');
});

module.exports = router;
