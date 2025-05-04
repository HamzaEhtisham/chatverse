import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import ChatList from '../components/chatlist';
import ChatBox from '../components/chatBox';
import GroupChatModal from '../components/groupchat'; // Import the modal

const Home = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Loading state for fetching chats
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const navigate = useNavigate();

    // Get the current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user'));

    // Redirect to login if no token is found
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    // Fetch chats from the backend
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setChats(data); // Update the chats state
            } catch (err) {
                console.error('Error fetching chats:', err);
                if (err.response?.status === 401) {
                    // If unauthorized, clear localStorage and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                } else {
                    setError('Failed to load chats. Please try again.');
                }
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };

        fetchChats();
    }, [navigate]);

    return (
        <div style={{ backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ display: 'flex', height: 'calc(100vh - 60px)', flexDirection: 'row' }}>
                {/* Sidebar for Chat List */}
                <div
                    style={{
                        width: '30%',
                        backgroundColor: '#ffffff',
                        borderRight: '1px solid #ddd',
                        overflowY: 'auto',
                        padding: '20px',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Your Chats</h2>
                    </div>
                    {loading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>Loading chats...</p>
                    ) : chats.length === 0 ? (
                        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                            No chats available. Start a new chat!
                        </p>
                    ) : (
                        <ChatList
                            chats={chats}
                            selectedChat={selectedChat}
                            setSelectedChat={setSelectedChat}
                            currentUser={currentUser}
                        />
                    )}
                </div>

                {/* Main Chat Box */}
                <div
                    style={{
                        flex: 1,
                        backgroundColor: '#f9f9f9',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                    }}
                >
                    {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}
                    {selectedChat ? (
                        <ChatBox chat={selectedChat} currentUser={currentUser} />
                    ) : (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '16px' }}>
                            Select a chat to start messaging
                        </p>
                    )}
                </div>
            </div>

            {/* Group Chat Modal */}
            {showModal && <GroupChatModal onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default Home;
