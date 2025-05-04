import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import ChatList from '../components/chatlist';
import ChatBox from '../components/chatBox';
import GroupChatModal from '../components/groupchat'; // Import the modal

const Home = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const currentUser = JSON.parse(localStorage.getItem('user')); // Assuming user info is stored in localStorage

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
                setError('Failed to load chats. Please try again.');
            }
        };

        fetchChats();
    }, []);

    return (
        <div>
            <Navbar />
            <div style={{ display: 'flex', height: 'calc(100vh - 50px)', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                    <h2>Your Chats</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            padding: '10px',
                            backgroundColor: 'blue',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                        }}
                    >
                        Create Group Chat
                    </button>
                </div>
                <div style={{ display: 'flex', flex: 1 }}>
                    <ChatList
                        chats={chats}
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                        currentUser={currentUser}
                    />
                    <div style={{ flex: 1, padding: '10px' }}>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {selectedChat ? (
                            <ChatBox chat={selectedChat} currentUser={currentUser} />
                        ) : (
                            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                                Select a chat to start messaging
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {showModal && <GroupChatModal onClose={() => setShowModal(false)} />} {/* Render the modal */}
        </div>
    );
};

export default Home;