const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// Load environment variables from .env file
require('dotenv').config();

// Create an instance of Express
const app = express();

// Import all routes
const { racersRouter, teamsRouter, trailsRouter, raceEntryRouter, bonusObjectiveRouter, raceResultsRouter } = require('./routes');

// Use routes
app.use('/racers', racersRouter);
app.use('/teams', teamsRouter);
app.use('/trails', trailsRouter);
app.use('/raceEntry', raceEntryRouter);
app.use('/bonusObjective', bonusObjectiveRouter);
app.use('/raceResults', raceResultsRouter);

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(morgan('dev')); // Logger
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Test Route
app.get('/', (req, res) => {
    res.send('Hello from the SISU 24 Ultra PNW App!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
