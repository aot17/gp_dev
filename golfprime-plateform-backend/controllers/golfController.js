// controllers/golfController.js
const { Golfs } = require('../models');

// Controller to get all golf courses
exports.getAllGolfs = async (req, res) => {
  try {
    const golfs = await Golfs.findAll();
    res.json(golfs);
  } catch (err) {
    console.error('Error retrieving golf courses:', err);
    res.status(500).json({ error: 'Failed to retrieve golf courses.' });
  }
};

// Controller to create a new golf course
exports.createGolf = async (req, res) => {
  try {
    const golf = await Golfs.create(req.body);
    res.json(golf);
  } catch (err) {
    console.error('Error creating golf course:', err);
    res.status(500).json({ error: 'Failed to create golf course.' });
  }
};

// Controller to get a specific golf course by ID
exports.getGolfById = async (req, res) => {
  try {
    const golf = await Golfs.findByPk(req.params.id);
    if (golf) {
      res.json(golf);
    } else {
      res.status(404).json({ error: 'Golf course not found.' });
    }
  } catch (err) {
    console.error('Error retrieving golf course by ID:', err);
    res.status(500).json({ error: 'Failed to retrieve golf course.' });
  }
};

// Controller to update a golf course
exports.updateGolf = async (req, res) => {
  try {
    const golf = await Golfs.findByPk(req.params.id);
    if (golf) {
      await golf.update(req.body);
      res.json(golf);
    } else {
      res.status(404).json({ error: 'Golf course not found.' });
    }
  } catch (err) {
    console.error('Error updating golf course:', err);
    res.status(500).json({ error: 'Failed to update golf course.' });
  }
};

// Controller to delete a golf course
exports.deleteGolf = async (req, res) => {
  try {
    const golf = await Golfs.findByPk(req.params.id);
    if (golf) {
      await golf.destroy();
      res.json({ message: 'Golf course deleted.' });
    } else {
      res.status(404).json({ error: 'Golf course not found.' });
    }
  } catch (err) {
    console.error('Error deleting golf course:', err);
    res.status(500).json({ error: 'Failed to delete golf course.' });
  }
};
