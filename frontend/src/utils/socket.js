import { io } from 'socket.io-client';

// Initialize socket connection
const socket = io(`https://chatverse-backend-9ymo.onrender.com`, {
    transports: ['websocket'], // Use WebSocket for better performance
    reconnection: true, // Automatically reconnect if disconnected
});

// Emit typing indicator
export const setupTypingIndicator = (chatId, isTyping) => {
    socket.emit('typing', chatId);
};

// Listen for typing indicator
socket.on('displayTyping', ({ chatId, user }) => {
    console.log(`${user} is typing in chat ${chatId}`);
});

// Join a chat room
export const joinChatRoom = (chatId) => {
    socket.emit('join_chat', chatId);
    console.log(`Joined chat room: ${chatId}`);
};

// Leave a chat room
export const leaveChatRoom = (chatId) => {
    socket.emit('leave_chat', chatId);
    console.log(`Left chat room: ${chatId}`);
};

// Listen for new messages
socket.on('message_received', (message) => {
    console.log('New message received:', message);
});

// Emit a new message
export const sendMessage = (chatId, content) => {
    socket.emit('new_message', { chatId, content });
};

export default socket;