const express = require('express');
const router = express.Router();
const { Golfs } = require('../models');

// GET all golf courses
router.get('/', async (req, res) => {
  try {
    const golfs = await Golfs.findAll();
    res.json(golfs);
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).json({ error: 'Failed to retrieve golf courses.' });
  }
});

// POST a new golf course
router.post('/', async (req, res) => {
  try {
    const golf = await Golfs.create(req.body);
    res.json(golf);
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).json({ error: 'Failed to create golf course.' });
  }
});

// GET a specific golf course by ID
router.get('/:id', async (req, res) => {
  try {
    const golf = await Golfs.findByPk(req.params.id);
    if (golf) {
      res.json(golf);
    } else {
      res.status(404).json({ error: 'Golf course not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve golf course.' });
  }
});

// PUT update a golf course
router.put('/:id', async (req, res) => {
  try {
    const golf = await Golfs.findByPk(req.params.id);
    if (golf) {
      await golf.update(req.body);
      res.json(golf);
    } else {
      res.status(404).json({ error: 'Golf course not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update golf course.' });
  }
});

// DELETE a golf course
router.delete('/:id', async (req, res) => {
  try {
    const golf = await Golfs.findByPk(req.params.id);
    if (golf) {
      await golf.destroy();
      res.json({ message: 'Golf course deleted.' });
    } else {
      res.status(404).json({ error: 'Golf course not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete golf course.' });
  }
});

module.exports = router;
