
const express = require('express');
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseStudents,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

// POST /api/courses - Create a course
router.post('/', createCourse);

// GET /api/courses - Get all courses
router.get('/', getAllCourses);

// GET /api/courses/:id/students - Get students of a course
router.get('/:id/students', getCourseStudents);

// GET /api/courses/:id - Get one course
router.get('/:id', getCourseById);

// PUT /api/courses/:id - Update a course
router.put('/:id', updateCourse);

// DELETE /api/courses/:id - Delete a course
router.delete('/:id', deleteCourse);

module.exports = router;
