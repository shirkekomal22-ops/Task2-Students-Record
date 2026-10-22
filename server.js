
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const courseRoutes = require("./routes/courseRoutes");
const studentRoutes = require('./routes/studentRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json());


app.use("/api/courses", courseRoutes);
app.use('/api/students', studentRoutes);


app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.statusCode = 404;
    next(error);
});


app.use(errorMiddleware);


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Student Records API is running",
    });
});


const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();

