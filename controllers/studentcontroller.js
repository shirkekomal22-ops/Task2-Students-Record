
const mongoose = require('mongoose');
const Student = require('../models/Studentmodel');
const Course = require('../models/Coursemodel');

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

// 1. Create Student
exports.createStudent = async (req, res, next) => {
    try {
        const { name, email, rollNumber, course, marks } = req.body;

        if (
            !name?.trim() ||
            !email?.trim() ||
            !rollNumber?.trim() ||
            !course ||
            marks === undefined
        ) {
            throw createError(
                'Name, email, roll number, course and marks are required',
                400
            );
        }

        if (!mongoose.isValidObjectId(course)) {
            throw createError('Invalid course ID format', 400);
        }

        const existingCourse = await Course.findById(course);

        if (!existingCourse) {
            throw createError('Course not found', 404);
        }

        const student = await Student.create({
            name,
            email,
            rollNumber,
            course,
            marks
        });

        await student.populate('course');

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: student
        });
    } catch (error) {
        next(error);
    }
};

// 2. Get All Students with search and course filter
exports.getAllStudents = async (req, res, next) => {
    try {
        const { search, course } = req.query;
        const filter = {};

        if (search) {
            filter.name = {
                $regex: search,
                $options: 'i'
            };
        }

        if (course) {
            if (!mongoose.isValidObjectId(course)) {
                throw createError('Invalid course ID format', 400);
            }

            filter.course = course;
        }

        const students = await Student.find(filter)
            .populate('course');

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        next(error);
    }
};

// 3. Get Single Student
exports.getStudentById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw createError('Invalid student ID format', 400);
        }

        const student = await Student.findById(id)
            .populate('course');

        if (!student) {
            throw createError('Student not found', 404);
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        next(error);
    }
};

// 4. Update Student
exports.updateStudent = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw createError('Invalid student ID format', 400);
        }

        if (
            !req.body ||
            Object.keys(req.body).length === 0
        ) {
            throw createError('Request body cannot be empty', 400);
        }

        if (
            req.body.course !== undefined &&
            !mongoose.isValidObjectId(req.body.course)
        ) {
            throw createError('Invalid course ID format', 400);
        }

        if (req.body.course !== undefined) {
            const existingCourse = await Course.findById(
                req.body.course
            );

            if (!existingCourse) {
                throw createError('Course not found', 404);
            }
        }

        const allowedFields = [
            'name',
            'email',
            'rollNumber',
            'course',
            'marks'
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            throw createError(
                'No valid fields provided for update',
                400
            );
        }

        const student = await Student.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).populate('course');

        if (!student) {
            throw createError('Student not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: student
        });
    } catch (error) {
        next(error);
    }
};

// 5. Delete Student
exports.deleteStudent = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw createError('Invalid student ID format', 400);
        }

        const student = await Student.findByIdAndDelete(id);

        if (!student) {
            throw createError('Student not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// 6. Statistics per Course
exports.getStudentStats = async (req, res, next) => {
    try {
        const stats = await Student.aggregate([
            {
                $group: {
                    _id: '$course',
                    averageMarks: { $avg: '$marks' },
                    studentCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: Course.collection.name,
                    localField: '_id',
                    foreignField: '_id',
                    as: 'courseDetails'
                }
            },
            {
                $unwind: {
                    path: '$courseDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    courseId: '$_id',
                    courseName: '$courseDetails.name',
                    averageMarks: {
                        $round: ['$averageMarks', 2]
                    },
                    studentCount: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: stats.length,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};
