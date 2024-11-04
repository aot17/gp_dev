const express = require('express');
const router = express.Router();
const { Bookings, WorkingHours, Unavailabilities } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

// Book a slot
router.post('/', authMiddleware(['customer']), async (req, res) => {
  const { pro_id, Date_start, Date_end } = req.body;
  const customer_id = req.user.userId;  // Assuming the customer is logged in

  try {
    // Convert Date_start and Date_end to Date objects
    const start = new Date(Date_start);
    const end = new Date(Date_end);

    // Step 1: Validate date range
    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Step 1: Check working hours
    const dayOfWeek = start.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

    const workingHours = await WorkingHours.findOne({
      where: {
        pro_id,
        day_of_week: dayOfWeek
      }
    });

    if (!workingHours || start < workingHours.start_time || end > workingHours.end_time) {
      return res.status(400).json({ message: 'Requested time is outside working hours' });
    }

    // Step 2: Check for overlapping unavailabilities
    const overlappingUnavailability = await Unavailabilities.findOne({
      where: {
        pro_id,
        [Op.or]: [
          { Date_start: { [Op.lte]: end }, Date_end: { [Op.gte]: start } }
        ]
      }
    });

    if (overlappingUnavailability) {
      return res.status(400).json({ message: 'Requested time is unavailable' });
    }

    // Step 3: Check for overlapping bookings
    const overlappingBooking = await Bookings.findOne({
      where: {
        pro_id,
        [Op.or]: [
          { Date_start: { [Op.lt]: end }, Date_end: { [Op.gt]: start } }
        ]
      }
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    // Step 4: Create the booking
    const booking = await Bookings.create({
      pro_id,
      customer_id,
      Date_start: start,
      Date_end: end,
      status: 'booked'
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
});

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Bookings.findAll();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
});

// POST a new booking
router.post('/test', async (req, res) => {
  try {
    const booking = await Bookings.create(req.body);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking.' });
  }
});

// GET a specific booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Bookings.findByPk(req.params.id);
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ error: 'Booking not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve booking.' });
  }
});

// PUT update a booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Bookings.findByPk(req.params.id);
    if (booking) {
      await booking.update(req.body);
      res.json(booking);
    } else {
      res.status(404).json({ error: 'Booking not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking.' });
  }
});

// DELETE a booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Bookings.findByPk(req.params.id);
    if (booking) {
      await booking.destroy();
      res.json({ message: 'Booking deleted.' });
    } else {
      res.status(404).json({ error: 'Booking not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking.' });
  }
});

module.exports = router;
