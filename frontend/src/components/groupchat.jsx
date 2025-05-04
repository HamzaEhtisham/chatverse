import React, { useState } from 'react';
import axios from 'axios';

const GroupChatModal = ({ onClose }) => {
    const [groupName, setGroupName] = useState('');
    const [users, setUsers] = useState(''); // Comma-separated user IDs
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCreateGroup = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/groups/create`,
                {
                    name: groupName,
                    users: users.split(','),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSuccess(`Group "${data.name}" created successfully!`);
            setError('');
            onClose(); // Close the modal after success
        } catch (err) {
            setError('Failed to create group. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
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
                    borderRadius: '10px',
                    width: '400px',
                }}
            >
                <h2>Create Group Chat</h2>
                <input
                    type="text"
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />
                <input
                    type="text"
                    placeholder="User IDs (comma-separated)"
                    value={users}
                    onChange={(e) => setUsers(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />
                <button
                    onClick={handleCreateGroup}
                    style={{
                        padding: '10px',
                        backgroundColor: 'green',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        width: '100%',
                    }}
                >
                    Create Group
                </button>
                <button
                    onClick={onClose}
                    style={{
                        padding: '10px',
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        width: '100%',
                        marginTop: '10px',
                    }}
                >
                    Cancel
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </div>
        </div>
    );
};

export default GroupChatModal;