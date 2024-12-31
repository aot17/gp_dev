const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const authMiddleware = require('../middleware/authMiddleware');

// Pro-specific route: Fetch availability for logged-in pro
router.get('/probackoffice', authMiddleware(['pro']), availabilityController.getProAvailability);

// Fetch availability for a specific pro on a specific date
router.get('/:pro_id', availabilityController.getAvailability);

module.exports = router;
