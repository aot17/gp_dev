const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const bookingProController = require('../controllers/bookingProController');

// Pro creates a booking for a client they have worked with before
router.post('/', authMiddleware(['pro']), bookingProController.createBooking);

// Route to get all bookings
router.get('/', authMiddleware(['pro']), bookingProController.getAllBookings);

// Route to get a specific booking by ID
router.get('/:id', authMiddleware(['pro']), bookingProController.getBookingById);

// Pro updates a specific booking (only their own)
router.put('/:id', authMiddleware(['pro']), bookingProController.updateBooking);

// Pro deletes a specific booking (only their own)
router.delete('/:id', authMiddleware(['pro']), bookingProController.deleteBooking);

module.exports = router;
