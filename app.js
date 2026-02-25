const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require("./src/config/db");
const userRoutes = require('./src/routes/user.routes');
const ticketRoutes = require('./src/routes/ticket.routes');
const settingRoutes = require('./src/routes/setting.routes');
const errorHandler = require('./src/middleware/errorhandler');


require('dotenv').config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

connectDB();

// Rate limiter
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "Too many requests, please try again later."
});
app.use(rateLimiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/settings', settingRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Ticket Management API');
});

// Error handling middleware
/* app.use(errorHandler); */

module.exports = app;