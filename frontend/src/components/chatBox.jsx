import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket, { joinChatRoom, setupTypingIndicator } from '../utils/socket';
import Message from './message';

const ChatBox = ({ chat, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Fetch messages when the chat changes
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(
                    `http://localhost:5000/api/messages/${chat._id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setMessages(data);
            } catch (err) {
                console.error('Error fetching messages:', err);
                setError('Failed to load messages. Please try again.');
            }
        };

        if (chat) {
            fetchMessages();
            joinChatRoom(chat._id); // Join the chat room
        }

        // Cleanup: Leave the chat room when the component unmounts
        return () => {
            socket.emit('leave_chat', chat._id);
        };
    }, [chat]);

    // Listen for new messages in real-time
    useEffect(() => {
        socket.on('message_received', (newMessage) => {
            if (newMessage.chat._id === chat._id) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        });

        socket.on('displayTyping', ({ chatId, user }) => {
            if (chatId === chat._id && user._id !== currentUser._id) {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 3000); // Typing indicator disappears after 3 seconds
            }
        });

        return () => {
            socket.off('message_received');
            socket.off('displayTyping');
        };
    }, [chat, currentUser]);

    // Send a new message
    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                'http://localhost:5000/api/messages',
                { chatId: chat._id, content: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages([...messages, data]);
            setNewMessage('');
            socket.emit('new_message', data); // Emit the new message to the server
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message. Please try again.');
        }
    };

    // Handle typing indicator
    const handleTyping = () => {
        setupTypingIndicator(chat._id, true);
    };

    return (
        <div style={{ width: '70%', padding: '10px' }}>
            <h2>{chat.chatName || 'Chat'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div
                style={{
                    height: '300px',
                    overflowY: 'scroll',
                    border: '1px solid #ddd',
                    padding: '10px',
                }}
            >
                {messages.map((msg) => (
                    <Message
                        key={msg._id}
                        message={msg}
                        isSender={msg.sender._id === currentUser._id} // Compare sender with current user
                    />
                ))}
                {isTyping && <p style={{ fontStyle: 'italic' }}>Someone is typing...</p>}
            </div>
            <div style={{ marginTop: '10px' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleTyping}
                    placeholder="Type a message..."
                    style={{ width: '80%', padding: '10px', marginRight: '10px' }}
                />
                <button onClick={sendMessage} style={{ padding: '10px 20px' }}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;