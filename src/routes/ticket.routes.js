const express = require('express');
const authMiddleware = require('../middleware/auth');
const { createTicket, getAllTicket, searchTicket, filterByStatus, updateTickets, deleteTickets } = require('../controllers/ticket.controller');

const router = express.Router();


router.post('/createTicket', authMiddleware, createTicket)
router.get('/getAllTickets', authMiddleware, getAllTicket)
router.get('/search', authMiddleware, searchTicket)
router.get('/filterByStatus', authMiddleware, filterByStatus)
router.put('/update/:id', authMiddleware, updateTickets)
router.delete('/delete/:id', authMiddleware, deleteTickets)




module.exports = router;