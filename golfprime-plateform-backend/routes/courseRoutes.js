// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// GET all courses
router.get('/', courseController.getAllCourses);

// POST a new course
router.post('/', courseController.createCourse);

// GET a specific course by ID
router.get('/:id', courseController.getCourseById);

// PUT to update a specific course by ID
router.put('/:id', courseController.updateCourse);

// DELETE a specific course by ID
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
