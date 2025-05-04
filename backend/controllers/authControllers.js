// filepath: c:\Users\i Tech Computers\Desktop\project_full_stack\ChatVerse\backend\controllers\authController.js
const User = require('../models/User');
const Chat = require('../models/chat');
const generateToken = require('../utils/generateToken'); // Ensure you have a utility to generate JWT tokens

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);

            // Automatically create a default chat for the user
            const defaultChat = await Chat.create({
                users: [user._id],
                isGroupChat: false,
            });

            res.status(200).json({ user, token });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: `Failed to log in: ${error.message}` });
    }
};

module.exports = { loginUser };