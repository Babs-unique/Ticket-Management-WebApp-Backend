const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { createTicket } = require('../controllers/ticket.controller');

const router = express.Router();


router.post('/createTicket', authMiddleware, createTicket)




module.exports = router;