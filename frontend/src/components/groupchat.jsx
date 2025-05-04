import React, { useState } from 'react';
import axios from 'axios';

const GroupChatModal = ({ onClose }) => {
    const [groupName, setGroupName] = useState('');
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return setSearchResults([]);

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/users?search=${query}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSearchResults(data);
        } catch (err) {
            console.error("Error searching users", err);
        }
    };

    const handleAddUser = (user) => {
        if (!selectedUsers.find(u => u._id === user._id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleRemoveUser = (userId) => {
        setSelectedUsers(selectedUsers.filter(u => u._id !== userId));
    };

    const handleCreateGroup = async () => {
        if (!groupName || selectedUsers.length === 0) {
            setError("Group name and at least one user is required.");
            setSuccess('');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/groups/create`,
                {
                    name: groupName,
                    users: selectedUsers.map(u => u.username), // Or u._id if backend uses IDs
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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                width: '400px',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}>
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
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />

                {/* Search Results */}
                {searchResults.map((user) => (
                    <div key={user._id} style={{ marginBottom: '5px' }}>
                        <span>{user.username}</span>
                        <button onClick={() => handleAddUser(user)} style={{ marginLeft: '10px' }}>Add</button>
                    </div>
                ))}

                {/* Selected Users */}
                <div style={{ margin: '10px 0' }}>
                    <strong>Selected Users:</strong>
                    {selectedUsers.map((user) => (
                        <div key={user._id} style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                            <span>{user.username}</span>
                            <button
                                onClick={() => handleRemoveUser(user._id)}
                                style={{
                                    marginLeft: '10px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '3px',
                                    padding: '2px 6px'
                                }}
                            >Remove</button>
                        </div>
                    ))}
                </div>

                <button onClick={handleCreateGroup} style={{
                    padding: '10px',
                    backgroundColor: 'green',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    width: '100%',
                }}>
                    Create Group
                </button>

                <button onClick={onClose} style={{
                    padding: '10px',
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    width: '100%',
                    marginTop: '10px',
                }}>
                    Cancel
                </button>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </div>
        </div>
    );
};

export default GroupChatModal;
