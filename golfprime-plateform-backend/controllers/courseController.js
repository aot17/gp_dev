// controllers/courseController.js
const { Courses } = require('../models');

// Controller to retrieve all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Courses.findAll();
    res.json(courses);
  } catch (error) {
    console.error('Error retrieving courses:', error);
    res.status(500).json({ error: 'Failed to retrieve courses.' });
  }
};

// Controller to create a new course
exports.createCourse = async (req, res) => {
  try {
    const course = await Courses.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course.' });
  }
};

// Controller to retrieve a specific course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Courses.findByPk(req.params.id);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ error: 'Course not found.' });
    }
  } catch (error) {
    console.error('Error retrieving course by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve course.' });
  }
};

// Controller to update a specific course by ID
exports.updateCourse = async (req, res) => {
  try {
    const course = await Courses.findByPk(req.params.id);
    if (course) {
      await course.update(req.body);
      res.json(course);
    } else {
      res.status(404).json({ error: 'Course not found.' });
    }
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course.' });
  }
};

// Controller to delete a specific course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Courses.findByPk(req.params.id);
    if (course) {
      await course.destroy();
      res.json({ message: 'Course deleted.' });
    } else {
      res.status(404).json({ error: 'Course not found.' });
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course.' });
  }
};
