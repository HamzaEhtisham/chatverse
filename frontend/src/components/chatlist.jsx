import React from 'react';
import socket from '../utils/socket'; // Import your socket instance

const ChatList = ({ chats, selectedChat, setSelectedChat, currentUser }) => {
    const handleChatSelection = (chat) => {
        setSelectedChat(chat); // Update the selected chat
        socket.emit('join_chat', chat._id); // Emit the join_chat event with the chat ID
    };

    return (
        <div style={{ width: '30%', borderRight: '1px solid #ddd', padding: '10px' }}>
            <h2>Your Chats</h2>
            {chats.length > 0 ? (
                chats.map((chat) => (
                    <div
                        key={chat._id}
                        onClick={() => handleChatSelection(chat)} // Call the handler when a chat is clicked
                        style={{
                            padding: '10px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #ddd',
                            backgroundColor: selectedChat?._id === chat._id ? '#f0f0f0' : 'white',
                        }}
                    >
                        {chat.isGroupChat
                            ? chat.chatName
                            : chat.users.find((user) => user._id !== currentUser._id)?.name || 'Direct Message'}
                    </div>
                ))
            ) : (
                <p>No chats available. Start a new conversation!</p>
            )}
        </div>
    );
};

export default ChatList;