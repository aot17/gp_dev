// routes/unavailabilitiesRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const unavailabilitiesController = require('../controllers/unavailabilitiesController');

// Route to add a new unavailability (pro only)
router.post('/', authMiddleware(['pro']), unavailabilitiesController.addUnavailability);

// Route to get all unavailabilities for a specific pro
router.get('/probackoffice', authMiddleware(['pro']), unavailabilitiesController.getProBackOfficeUnavailabilities);

// Route to get all unavailabilities for a specific pro
router.get('/:pro_id', unavailabilitiesController.getProUnavailabilities);

// Route to add a new unavailability (pro only)
router.put('/:id', authMiddleware(['pro']), unavailabilitiesController.updateUnavailability);

// Route to add a new unavailability (pro only)
router.delete('/:id', authMiddleware(['pro']), unavailabilitiesController.deleteUnavailability);

module.exports = router;
