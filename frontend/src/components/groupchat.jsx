import React, { useState } from 'react';
import axios from 'axios';

const GroupChatModal = ({ onClose }) => {
    const [groupName, setGroupName] = useState('');
    const [userNames, setUserNames] = useState(''); // comma-separated usernames
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCreateGroup = async () => {
        if (!groupName || !userNames) {
            setError("Group name and usernames are required.");
            setSuccess('');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/groups/create`,
                {
                    name: groupName,
                    users: userNames.split(',').map(name => name.trim()),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSuccess(`Group "${data.name}" created successfully!`);
            setError('');
            onClose(); // Close modal
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
                    placeholder="Usernames (comma-separated)"
                    value={userNames}
                    onChange={(e) => setUserNames(e.target.value)}
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
