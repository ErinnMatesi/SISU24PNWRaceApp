const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');

// GET request for list of trails
router.get('/', (req, res) => {
    pool.query('SELECT * FROM Trails', (error, results) => {
        if (error) {
            console.error('Error fetching data from the database:', error);
            return res.status(500).json({ message: 'Error retrieving trails'})
        }
        res.status(200).json(results);
    })
});

// POST request to add a new trail
router.post('/', (req, res) => {
    const { name, distance, elevationGain, basePoints, firstTenPoints, secondTenPoints } = req.body;

    // Optional: Add validation for required fields

    const insertQuery = 'INSERT INTO Trails (Name, Distance, ElevationGain, BasePoints, FirstTenPoints, SecondTenPoints) VALUES (?, ?, ?, ?, ?, ?)';
    pool.query(insertQuery, [name, distance, elevationGain, basePoints, firstTenPoints, secondTenPoints], (error, results) => {
        if (error) {
            console.error('Error inserting data into database:', error);
            return res.status(500).json({ message: 'Error adding trail' });
        }
        res.status(201).json({ message: 'Trail added successfully', trailId: results.insertId });
    });
});

// PUT request to update a trail
router.put('/:trailId', (req, res) => {
    const { trailId } = req.params;
    const { name, distance, elevationGain, basePoints, firstTenPoints, secondTenPoints } = req.body;

    // Validate the input
    if (!trailId) {
        return res.status(400).json({ message: 'Trail ID is required' });
    }

    // Prepare the query and values dynamically
    let updateFields = [];
    let queryParams = [];

    if (name !== undefined) {
        updateFields.push('Name = ?');
        queryParams.push(name);
    }
    if (distance !== undefined) {
        updateFields.push('Distance = ?');
        queryParams.push(distance);
    }
    if (elevationGain !== undefined) {
        updateFields.push('ElevationGain = ?');
        queryParams.push(elevationGain);
    }
    if (basePoints !== undefined) {
        updateFields.push('BasePoints = ?');
        queryParams.push(basePoints);
    }
    if (firstTenPoints !== undefined) {
        updateFields.push('FirstTenPoints = ?');
        queryParams.push(firstTenPoints);
    }
    if (secondTenPoints !== undefined) {
        updateFields.push('SecondTenPoints = ?');
        queryParams.push(secondTenPoints);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No fields provided for update' });
    }

    const updateQuery = `UPDATE Trails SET ${updateFields.join(', ')} WHERE TrailID = ?`;
    queryParams.push(trailId);

    pool.query(updateQuery, queryParams, (error, results) => {
        if (error) {
            console.error(`Error updating trail with ID: ${trailId}`, error);
            return res.status(500).json({ message: 'Error updating trail' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Trail not found' });
        }
        res.status(200).json({ message: `Trail with ID ${trailId} updated successfully.` });
    });
});

module.exports = router;
