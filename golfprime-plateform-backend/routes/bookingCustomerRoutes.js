const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const bookingCustomerController = require('../controllers/bookingCustomerController');

// Route to create a booking
router.post('/', authMiddleware(['customer']), bookingCustomerController.createBooking);

// Route to get all bookings
router.get('/', authMiddleware(['customer']), bookingCustomerController.getAllBookings);

// Route to get a specific booking by ID
router.get('/:id', authMiddleware(['customer']), bookingCustomerController.getBookingById);

// Route to update a specific booking
router.put('/:id', authMiddleware(['customer']), bookingCustomerController.updateBooking);

// Route to delete a specific booking
router.delete('/:id', authMiddleware(['customer']), bookingCustomerController.deleteBooking);

module.exports = router;
