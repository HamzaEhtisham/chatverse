const express = require('express');
const { sendMessage, fetchMessages } = require('../controllers/messageController'); // Correct import
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to send a message
router.post('/', protect, sendMessage);

// Route to fetch messages
router.get('/:chatId', protect, fetchMessages); // Use fetchMessages instead of getMessages

module.exports = router;