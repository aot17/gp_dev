const express = require('express');
const router = express.Router();
const { WorkingHours, Unavailabilities } = require('../models');
const { Op } = require('sequelize');

// Fetch availability (working hours and unavailabilities) for a specific pro
router.get('/:pro_id', async (req, res) => {
  const { pro_id } = req.params;

  try {
    // Fetch WorkingHours for the pro
    const workingHours = await WorkingHours.findAll({
      where: { pro_id }
    });

    // Fetch Unavailabilities for the pro
    const unavailabilities = await Unavailabilities.findAll({
      where: {
        pro_id,
        Date_end: { [Op.gte]: new Date() } // Only fetch future unavailabilities
      }
    });

    res.json({ workingHours, unavailabilities });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: 'Failed to fetch availability' });
  }
});

module.exports = router;
