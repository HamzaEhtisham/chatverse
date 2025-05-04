const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const groupRoutes = require('./routes/groupRoutes');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
connectDB(); // MongoDB connection setup

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['https://chatverse-backend-9ymo.onrender.com', 'http://localhost:3000'], // Add your frontend's HTTPS URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    credentials: true, // Allow cookies and credentials
}));
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/groups', groupRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Test API
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// WebSocket Setup
const io = new Server(server, {
    cors: {
        origin: [
            'https://chatverse-backend-9ymo.onrender.com', // Production frontend
            'http://localhost:3000', // Local development frontend
        ],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat: ${chatId}`);
    });

    socket.on('new_message', (message) => {
        const { chatId } = message;
        console.log(`Message sent to chat: ${chatId}`, message);
        io.to(chatId).emit('message_received', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Start Server
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));