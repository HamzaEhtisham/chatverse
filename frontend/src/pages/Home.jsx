import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import ChatList from '../components/chatlist';
import ChatBox from '../components/chatBox';
import GroupChatModal from '../components/groupchat';

const Home = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    const fetchChats = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChats(data);
        } catch (err) {
            console.error('Error fetching chats:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                setError('Failed to load chats. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChats();
    }, [navigate]);

    return (
        <div style={{ backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
            <Navbar setChats={setChats} setSelectedChat={setSelectedChat} />
            <div style={{ display: 'flex', height: 'calc(100vh - 60px)', flexDirection: 'row' }}>
                <div
                    style={{
                        width: '30%',
                        backgroundColor: '#ffffff',
                        borderRight: '1px solid #ddd',
                        overflowY: 'auto',
                        padding: '20px',
                    }}
                >
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Your Chats</h2>
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

            {showModal && <GroupChatModal onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default Home;
