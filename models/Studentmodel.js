
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Student name is required'],
            trim: true,
            minlength: [2, 'Student name must be at least 2 characters']
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please enter a valid email'
            ]
        },

        rollNumber: {
            type: String,
            required: [true, 'Roll number is required'],
            unique: true,
            trim: true
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course is required']
        },

        marks: {
            type: Number,
            required: [true, 'Marks are required'],
            min: [0, 'Marks cannot be less than 0'],
            max: [100, 'Marks cannot be greater than 100']
        },

        enrolledDate: {
            type: Date,
            default: Date.now
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model('Student', studentSchema);
