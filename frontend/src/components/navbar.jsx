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
        if (!search) return setResults([]); // If search is empty, clear results

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setResults(data); // Set search results
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
            setSearch(''); // Clear search input after user select

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
                    style={{ padding: '8px', marginRight: '5px', borderRadius: '4px' }}
                />

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginLeft: '5px'
                    }}
                >
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
                        width: '250px',
                        maxHeight: '300px', // Prevent overflow
                        overflowY: 'auto',
                    }}>
                        {results.map((user) => (
                            <li
                                key={user._id}
                                onClick={() => handleUserSelect(user._id)}
                                style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #ccc' }}
                            >
                                {user.username} ({user.email})
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    onClick={handleLogout}
                    style={{
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '5px',
                        marginLeft: '10px'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
