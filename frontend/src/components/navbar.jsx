import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ setChats, setSelectedChat }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleSearch = async () => {
        if (!search) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setResults(data);
        } catch (error) {
            console.error('User search failed', error);
        }
    };

    const handleUserSelect = async (userId) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };

            const { data } = await axios.post('/api/chat/access', { userId }, config);
            setResults([]);
            setSearch('');

            // Update the chat list and selected chat
            if (setChats) {
                setChats(prev => {
                    const exists = prev.find(chat => chat._id === data._id);
                    return exists ? prev : [data, ...prev];
                });
            }

            if (setSelectedChat) {
                setSelectedChat(data);
            }

        } catch (error) {
            console.error('Error accessing chat:', error);
        }
    };

    return (
        <nav style={{
            padding: '10px',
            backgroundColor: '#007BFF',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
        }}>
            <h1>ChatVerse</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/home" style={{ color: 'white', marginRight: '10px' }}>Home</Link>

                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: '5px', marginRight: '5px' }}
                />
                <button onClick={handleSearch} style={{ padding: '5px 10px', marginRight: '10px' }}>
                    Search
                </button>

                {results.length > 0 && (
                    <ul style={{
                        position: 'absolute',
                        top: '50px',
                        backgroundColor: 'white',
                        color: 'black',
                        listStyle: 'none',
                        padding: '10px',
                        borderRadius: '5px',
                        boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                        zIndex: 999,
                        width: '250px'
                    }}>
                        {results.map((user) => (
                            <li
                                key={user._id}
                                onClick={() => handleUserSelect(user._id)}
                                style={{ padding: '5px 10px', cursor: 'pointer' }}
                            >
                                {user.username} ({user.email})
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    onClick={handleLogout}
                    style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px' }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
