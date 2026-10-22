
const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((item) => item.message)
            .join(', ');
    }

    // Invalid MongoDB ID
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }

    // Duplicate values: email, roll number, course name or code
    if (err.code === 11000) {
        statusCode = 409;

        const field = Object.keys(err.keyValue || {})[0];

        const fieldNames = {
            name: 'Course name',
            code: 'Course code',
            email: 'Email',
            rollNumber: 'Roll number'
        };

        message = `${fieldNames[field] || field || 'Field'} already exists`;
    }

    // Unexpected errors
    if (statusCode >= 500) {
        statusCode = 500;
        message = 'Internal server error';
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorMiddleware;
