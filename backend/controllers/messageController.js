const Message = require('../models/message');
const Chat = require('../models/chat');

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400).json({ message: 'Content and Chat ID are required' });
    }

    try {
        // Create a new message
        let message = await Message.create({
            sender: req.user.id,
            content,
            chat: chatId,
        });

        // Populate sender and chat details
        message = await message.populate('sender', 'username');
        message = await message.populate('chat');
        message = await Chat.populate(message, {
            path: 'chat.users',
            select: 'username email',
        });

        // Update the latest message in the chat
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error.message);
        res.status(500).json({ message: 'Failed to send message' });
    }
};

const fetchMessages = async (req, res) => {
    const { chatId } = req.params;

    if (!chatId) {
        return res.status(400).json({ message: 'Chat ID is required' });
    }

    try {
        // Fetch all messages for the given chat
        const messages = await Message.find({ chat: chatId })
            .populate('sender', 'username email')
            .populate('chat');

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error.message);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};

module.exports = { sendMessage, fetchMessages };