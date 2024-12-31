// routes/proRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const proController = require('../controllers/proController');

// GET all pros (public access)
router.get('/', proController.getAllPros);

// GET customers linked to the authenticated pro
router.get('/customers', authMiddleware(['pro']), proController.getProCustomers);

// GET pro by id (public access)
router.get('/:id', proController.getProById);

// POST a new pro (admin only)
router.post('/', authMiddleware(['admin']), proController.createPro);

// GET the authenticated pro's profile
router.get('/profile', authMiddleware(['pro']), proController.getProProfile);

// PUT update the authenticated pro's profile
router.put('/profile', authMiddleware(['pro']), proController.updateProProfile);

// DELETE the authenticated pro's profile
router.delete('/profile', authMiddleware(['pro']), proController.deleteProProfile);

module.exports = router;
