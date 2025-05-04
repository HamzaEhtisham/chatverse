import React, { useState } from 'react';
import axios from 'axios';

const GroupChatModal = ({ onClose }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState('');

    const handleCreateGroup = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/chats/group`,
                { name: groupName, users: selectedUsers },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log('Group created successfully', data);
            onClose(); // Close the modal after creation
        } catch (err) {
            setError('Failed to create group chat');
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '5px',
                    width: '400px',
                }}
            >
                <h2>Create Group Chat</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="text"
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />
                {/* Add functionality to select users */}
                <button onClick={handleCreateGroup} style={{ padding: '10px', width: '100%' }}>
                    Create Group
                </button>
                <button
                    onClick={onClose}
                    style={{
                        padding: '10px',
                        marginTop: '10px',
                        backgroundColor: 'gray',
                        color: 'white',
                        width: '100%',
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default GroupChatModal;
