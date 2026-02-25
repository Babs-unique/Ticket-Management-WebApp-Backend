// Helper to create error with status
const createError = (status, message) => {
    const err = new Error(message || 'Error');
    err.status = status || 500;
    return err;
};

const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);

    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
};

errorHandler.create = createError;
module.exports = errorHandler;