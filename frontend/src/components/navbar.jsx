import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem('token');
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
            console.log('Chat created/opened:', data);
            setResults([]);
            setSearch('');
            // Optionally navigate to the chat screen
        } catch (error) {
            console.error('Error accessing chat:', error);
        }
    };

    return (
        <nav style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white' }}>
            <h1>ChatVerse</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/home" style={{ color: 'white', marginRight: '10px' }}>Home</Link>

                {/* Search Input */}
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

                {/* Search Results Dropdown */}
                {results.length > 0 && (
                    <ul style={{
                        position: 'absolute',
                        top: '60px',
                        backgroundColor: 'white',
                        color: 'black',
                        listStyle: 'none',
                        padding: '10px',
                        borderRadius: '5px',
                        boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                        zIndex: 999,
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
