const express = require('express');
const router = express.Router();
const { Courses } = require('../models');

// GET all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Courses.findAll();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve courses.' });
  }
});

// POST a new course
router.post('/', async (req, res) => {
  try {
    const course = await Courses.create(req.body);
    res.json(course);
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).json({ error: 'Failed to create course.' });
  }
});

// GET a specific course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Courses.findByPk(req.params.id);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ error: 'Course not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve course.' });
  }
});

// PUT update a course
router.put('/:id', async (req, res) => {
  try {
    const course = await Courses.findByPk(req.params.id);
    if (course) {
      await course.update(req.body);
      res.json(course);
    } else {
      res.status(404).json({ error: 'Course not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course.' });
  }
});

// DELETE a course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Courses.findByPk(req.params.id);
    if (course) {
      await course.destroy();
      res.json({ message: 'Course deleted.' });
    } else {
      res.status(404).json({ error: 'Course not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course.' });
  }
});

module.exports = router;
