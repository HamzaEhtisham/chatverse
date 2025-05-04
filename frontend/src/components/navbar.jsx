import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white' }}>
            <h1>ChatVerse</h1>
            <div>
                <Link to="/home" style={{ color: 'white', marginRight: '10px' }}>Home</Link>
                <button onClick={handleLogout} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px' }}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;