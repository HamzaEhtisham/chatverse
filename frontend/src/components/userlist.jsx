import React, { useEffect, useState } from 'react';
import api from '../utils/api'; // Import the API utility

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/user'); // Fetch user data
                setUsers(response.data); // Update state with user data
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to fetch users.');
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>User List</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {users.map((user) => (
                    <li key={user._id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;