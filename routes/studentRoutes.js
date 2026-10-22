
const express = require('express');
const router = express.Router();

const {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    getStudentStats
} = require('../controllers/studentcontroller');


router.post('/', createStudent);

router.get('/', getAllStudents);


router.get('/stats', getStudentStats);


router.get('/:id', getStudentById);


router.put('/:id', updateStudent);


router.delete('/:id', deleteStudent);

module.exports = router;
