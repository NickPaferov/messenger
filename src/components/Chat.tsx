import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { sendMessageTC } from '../bll/messenger-reducer';
import { useAppDispatch, useAppSelector } from '../bll/store';

const Chat = () => {
  const dispatch = useAppDispatch();

  const { chatId } = useParams<{ chatId: string }>();

  const messages = useAppSelector(
    (state) => state.messenger.chats.filter((chat) => chat.chatId === chatId)[0]?.messages
  );

  const [message, setMessage] = useState('');

  return (
    <div>
      <div>
        {messages &&
          messages.map((m) => (
            <div key={m.idMessage} style={{ width: '30%', margin: '10px 0', border: '1px solid black' }}>
              {m.message}
            </div>
          ))}
      </div>
      <textarea value={message} onChange={(e) => setMessage(e.currentTarget.value)} />
      <button
        onClick={() => {
          if (!chatId) return;
          dispatch(sendMessageTC(chatId, message));
          setMessage('');
        }}
      >
        &#10148;
      </button>
    </div>
  );
};

export default Chat;
