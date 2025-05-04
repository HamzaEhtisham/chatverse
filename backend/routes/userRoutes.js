const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware
const multer = require('multer');
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

const upload = multer({ storage });

// User routes
router.post('/register', registerUser); // Register user
router.post('/login', loginUser); // Login user


// Profile picture upload route
router.post('/upload', protect, upload.single('profilePic'), (req, res) => {
    res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

module.exports = router;