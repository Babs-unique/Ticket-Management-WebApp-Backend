const express = require('express');
const authMiddleware = require('../middleware/auth');
const { createTicket, getAllTicket } = require('../controllers/ticket.controller');

const router = express.Router();


router.post('/createTicket', authMiddleware, createTicket)
router.get('/getAllTickets', authMiddleware, getAllTicket)
router.get('/')




module.exports = router;