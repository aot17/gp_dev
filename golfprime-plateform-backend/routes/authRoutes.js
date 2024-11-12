// Import the required modules.
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for Pro login
router.post('/pro/login', authController.proLogin);

// Route for Customer login
router.post('/customer/login', authController.customerLogin);

// Route for logout
router.post('/logout', authController.logout);

// Export the router to make the authentication routes accessible in the application.
module.exports = router;
