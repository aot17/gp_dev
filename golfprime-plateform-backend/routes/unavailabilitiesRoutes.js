const express = require('express');
const router = express.Router();
const { Unavailabilities } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Add unavailability
router.post('/', authMiddleware(['pro']), async (req, res) => {
  const { Date_start, Date_end, reason } = req.body;
  const pro_id = req.user.userId;

  try {
    const unavailability = await Unavailabilities.create({ pro_id, Date_start, Date_end, reason });
    res.status(201).json(unavailability);
  } catch (error) {
    console.error('Error adding unavailability:', error);
    res.status(500).json({ message: 'Failed to add unavailability' });
  }
});

// Get pro's unavailabilities
router.get('/:pro_id', async (req, res) => {
  try {
    const unavailabilities = await Unavailabilities.findAll({
      where: { pro_id: req.params.pro_id },
      order: [['Date_start', 'ASC']],
    });
    res.json(unavailabilities);
  } catch (error) {
    console.error('Error fetching unavailabilities:', error);
    res.status(500).json({ message: 'Failed to retrieve unavailabilities' });
  }
});

module.exports = router;
