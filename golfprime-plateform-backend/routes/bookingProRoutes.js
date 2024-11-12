const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const bookingProController = require('../controllers/bookingProController');

// Pro creates a booking for a client they have worked with before
router.post('/', authMiddleware(['pro']), bookingProController.createBooking);

// Pro updates a specific booking (only their own)
router.put('/:id', authMiddleware(['pro']), bookingProController.updateBooking);

// Pro deletes a specific booking (only their own)
router.delete('/:id', authMiddleware(['pro']), bookingProController.deleteBooking);

module.exports = router;
