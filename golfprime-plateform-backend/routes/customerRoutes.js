// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const customerController = require('../controllers/customerController');

// GET Customer Profile
router.get('/profile', authMiddleware(['customer']), customerController.getProfile);

// GET Customer Bookings
router.get('/bookings', authMiddleware(['customer']), customerController.getBookings);

// POST a new customer (Signup)
router.post('/signup', customerController.signup);

// PUT update customer information
router.put('/profile', authMiddleware(['customer']), customerController.updateProfile);

// DELETE a customer account
router.delete('/delete', authMiddleware(['customer']), customerController.deleteAccount);

module.exports = router;
