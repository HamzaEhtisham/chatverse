const express = require('express');
const { createGroup, addToGroup, removeFromGroup } = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new group
router.post('/create', protect, createGroup);

// Add a user to the group
router.put('/add', protect, addToGroup);

// Remove a user from the group
router.put('/remove', protect, removeFromGroup);

module.exports = router;