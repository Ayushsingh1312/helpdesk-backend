const express = require('express');
const router = express.Router();
const {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
    deleteTicket,
} = require('../controllers/ticketController');
const {protect} = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getTickets)
    .post(createTicket);

router.route('/:id')
    .get(getTicketById)
    .put(updateTicket)
    .delete(deleteTicket);

module.exports = router;