
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Course name is required'],
            unique: true,
            trim: true
        },

        code: {
            type: String,
            required: [true, 'Course code is required'],
            unique: true,
            trim: true,
            uppercase: true
        },

        duration: {
            type: Number,
            required: [true, 'Course duration is required'],
            min: [0.01, 'Duration must be a positive number']
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Course', courseSchema);
