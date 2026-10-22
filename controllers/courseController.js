
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Student = require('../models/Student');

// Helper for sending errors to central middleware
const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

// 1. Create a course
exports.createCourse = async (req, res, next) => {
    try {
        const { name, code, duration } = req.body;

        if (!name?.trim() || !code?.trim() || duration === undefined) {
            throw createError(
                'Course name, code and duration are required',
                400
            );
        }

        const course = await Course.create({
            name,
            code,
            duration
        });

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// 2. Get all courses
exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find();

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        next(error);
    }
};

// 3. Get a single course
exports.getCourseById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw createError('Invalid course ID format', 400);
        }

        const course = await Course.findById(id);

        if (!course) {
            throw createError('Course not found', 404);
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// 4. Get all students of a course
exports.getCourseStudents = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw createError('Invalid course ID format', 400);
        }

        const course = await Course.findById(id);

        if (!course) {
            throw createError('Course not found', 404);
        }

        const students = await Student.find({ course: id })
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

// 5. Update a course
exports.updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, code, duration } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            throw createError('Invalid course ID format', 400);
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            throw createError('Request body cannot be empty', 400);
        }

        const updates = {};

        if (name !== undefined) updates.name = name;
        if (code !== undefined) updates.code = code;
        if (duration !== undefined) updates.duration = duration;

        if (Object.keys(updates).length === 0) {
            throw createError('No valid fields provided for update', 400);
        }

        const course = await Course.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!course) {
            throw createError('Course not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// 6. Delete a course
exports.deleteCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw createError('Invalid course ID format', 400);
        }

        const course = await Course.findById(id);

        if (!course) {
            throw createError('Course not found', 404);
        }

        const studentCount = await Student.countDocuments({
            course: id
        });

        if (studentCount > 0) {
            throw createError(
                'Cannot delete a course that has enrolled students',
                409
            );
        }

        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
