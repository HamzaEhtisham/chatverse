import React from 'react';

const Message = ({ message, isSender }) => {
    return (
        <div
            style={{
                textAlign: isSender ? 'right' : 'left',
                margin: '10px 0',
                padding: '10px',
                backgroundColor: isSender ? '#d1f7c4' : '#f1f1f1',
                borderRadius: '10px',
                display: 'inline-block',
                maxWidth: '70%',
            }}
        >
            <strong>{isSender ? 'You' : message.sender.username}</strong>
            <p>{message.content}</p>
        </div>
    );
};

export default Message;