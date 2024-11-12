// routes/workingHoursRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const workinghoursController = require('../controllers/workinghoursController');

// Route to add working hours (restricted to authenticated pros)
router.post('/', authMiddleware(['pro']), workinghoursController.addWorkingHours);

// Route to get all working hours for a specific pro
router.get('/:pro_id', workinghoursController.getProWorkingHours);

module.exports = router;
