const express = require('express');
const router = express.Router();
const {addComment, getComments} = require('../controllers/commentController');
const {protect} = require('../middleware/authMiddleware');

router.use(protect);

router.route('/:ticketId/comments')
    .post(addComment)
    .get(getComments);

module.exports = router;