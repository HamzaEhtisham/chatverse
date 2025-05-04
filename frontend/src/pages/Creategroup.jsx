// CreateGroup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const handleGroupNameChange = (e) => {
        setGroupName(e.target.value);
    };

    const handleUsersChange = (e) => {
        setUsers(e.target.value.split(',').map(user => user.trim()));
    };

    const handleCreateGroup = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/groups/create', 
                { name: groupName, users },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Group created successfully');
            navigate('/home');  // Redirect to home after group creation
        } catch (error) {
            console.error('Error creating group:', error);
            alert('Failed to create group');
        }
    };

    return (
        <div>
            <h1>Create Group</h1>
            <input 
                type="text" 
                placeholder="Enter group name" 
                value={groupName} 
                onChange={handleGroupNameChange} 
            />
            <input 
                type="text" 
                placeholder="Enter users (comma separated)" 
                value={users} 
                onChange={handleUsersChange} 
            />
            <button onClick={handleCreateGroup}>Create Group</button>
        </div>
    );
};

export default CreateGroup;
