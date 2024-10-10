const express = require('express');
const router = express.Router();
const { Pros } = require('../models');

// GET all pros
router.get('/', async (req, res) => {
  try {
    const pros = await Pros.findAll();
    res.json(pros);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve pros.' });
  }
});

// POST a new pro
router.post('/', async (req, res) => {
  try {
    const pro = await Pros.create(req.body);
    res.json(pro);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create pro.' });
  }
});

// GET a specific pro by ID
router.get('/:id', async (req, res) => {
  try {
    const pro = await Pros.findByPk(req.params.id);
    if (pro) {
      res.json(pro);
    } else {
      res.status(404).json({ error: 'Pro not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve pro.' });
  }
});

// PUT update a pro
router.put('/:id', async (req, res) => {
  try {
    const pro = await Pros.findByPk(req.params.id);
    if (pro) {
      await pro.update(req.body);
      res.json(pro);
    } else {
      res.status(404).json({ error: 'Pro not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update pro.' });
  }
});

// DELETE a pro
router.delete('/:id', async (req, res) => {
  try {
    const pro = await Pros.findByPk(req.params.id);
    if (pro) {
      await pro.destroy();
      res.json({ message: 'Pro deleted.' });
    } else {
      res.status(404).json({ error: 'Pro not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete pro.' });
  }
});

module.exports = router;
