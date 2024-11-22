// routes/golfRoutes.js
const express = require('express');
const router = express.Router();
const golfController = require('../controllers/golfController');

// GET all golf courses
router.get('/', golfController.getAllGolfs);

// POST a new golf course
router.post('/', golfController.createGolf);

// GET a specific golf course by ID
router.get('/:id', golfController.getGolfById);

// PUT update a golf course
router.put('/:id', golfController.updateGolf);

// DELETE a golf course
router.delete('/:id', golfController.deleteGolf);

module.exports = router;
