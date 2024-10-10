const express = require('express');
const router = express.Router();
const { Bookings } = require('../models');

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
router.post('/', async (req, res) => {
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
