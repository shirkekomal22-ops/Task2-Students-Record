
const express = require('express');
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseStudents,
  updateCourse,
  deleteCourse
} = require('../controllers/coursecontroller');


router.post('/', createCourse);


router.get('/', getAllCourses);


router.get('/:id/students', getCourseStudents);


router.get('/:id', getCourseById);


router.put('/:id', updateCourse);


router.delete('/:id', deleteCourse);

module.exports = router;
