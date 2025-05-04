const Chat = require('../models/chat');
const User = require('../models/User');

// Create a new chat
const createChat = async (req, res) => {
    const { users, isGroupChat } = req.body;

    try {
        const chat = await Chat.create({
            users,
            isGroupChat,
        });
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: `Failed to create chat: ${error.message}` });
    }
};

// Get all chats for the logged-in user
const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ users: { $in: [req.user._id] } }) // Use req.user._id
            .populate('users', 'name email') // Populate user details
            .populate('latestMessage') // Populate the latest message
            .populate('admin', 'name email') // Populate admin details for group chats
            .sort({ updatedAt: -1 }); // Sort by most recently updated

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch chats: ${error.message}` });
    }
};

// Access or create a one-on-one chat
const accessChat = async (req, res) => {
    const { userId } = req.body;

    try {
        // Check if a one-on-one chat already exists
        let chat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [req.user._id, userId] }, // Use req.user._id
        }).populate('users', '-password');

        // If no chat exists, create a new one
        if (!chat) {
            chat = await Chat.create({
                chatName: 'One-on-One Chat', // Optional: Set a meaningful name
                isGroupChat: false,
                users: [req.user._id, userId], // Use req.user._id
            });
            chat = await chat.populate('users', '-password'); // Populate user details
        }

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: `Failed to access chat: ${error.message}` });
    }
};

module.exports = { createChat, getChats, accessChat };