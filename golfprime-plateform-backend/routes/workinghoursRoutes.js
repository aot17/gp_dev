const express = require('express');
const router = express.Router();
const { WorkingHours } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Add working hours
router.post('/', authMiddleware(['pro']), async (req, res) => {
  const { day_of_week, start_time, end_time } = req.body;
  const pro_id = req.user.userId;

  try {
    const workingHours = await WorkingHours.create({ pro_id, day_of_week, start_time, end_time });
    res.status(201).json(workingHours);
  } catch (error) {
    console.error('Error adding working hours:', error);
    res.status(500).json({ message: 'Failed to add working hours' });
  }
});

// Get all working hours for a pro
router.get('/:pro_id', async (req, res) => {
  try {
    const workingHours = await WorkingHours.findAll({
      where: { pro_id: req.params.pro_id },
      order: [['day_of_week', 'ASC']],
    });
    res.json(workingHours);
  } catch (error) {
    console.error('Error fetching working hours:', error);
    res.status(500).json({ message: 'Failed to retrieve working hours' });
  }
});

module.exports = router;
