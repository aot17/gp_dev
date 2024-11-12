const express = require('express');
const router = express.Router();
const { getAvailability } = require('../controllers/availabilityController');

// Fetch availability for a specific pro on a specific date
router.get('/:pro_id', getAvailability);

module.exports = router;
