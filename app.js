const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require("./src/config/db");
const userRoutes = require('./src/routes/user.routes');
const ticketRoutes = require('./src/routes/ticket.routes');
const settingRoutes = require('./src/routes/setting.routes')


require('dotenv').config();




const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));



connectDB();

app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/settings', settingRoutes);


const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 50, 
    message: "Too many requests, please try again later."
})
app.use(rateLimiter)


app.get('/', (req, res) => {
    res.send('Welcome to the Ticket Management API');
})

module.exports = app;