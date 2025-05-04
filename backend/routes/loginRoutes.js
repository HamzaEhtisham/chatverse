// filepath: c:\Users\i Tech Computers\Desktop\project_full_stack\ChatVerse\backend\routes\authRoutes.js
const express = require('express');
const { loginUser } = require('../controllers/authController');
const router = express.Router();

// Login route
router.post('/login', loginUser);

module.exports = router;