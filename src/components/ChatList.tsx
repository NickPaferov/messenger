import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../bll/store';
import { createChatAC } from '../bll/messenger-reducer';

const ChatList = () => {
  const dispatch = useAppDispatch();

  const chats = useAppSelector((state) => state.messenger.chats);

  const [contact, setContact] = useState('');

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat.chatId}>
          <span>&#128578;</span>
          <NavLink to={`/chats/${chat.chatId}`}>{chat.chatId}</NavLink>
        </div>
      ))}
      <input
        type="tel"
        placeholder="input contact"
        value={contact}
        onChange={(e) => setContact(e.currentTarget.value)}
      />
      <button
        onClick={() => {
          dispatch(createChatAC(`${contact}@c.us`));
          setContact('');
        }}
      >
        Create chat
      </button>
    </div>
  );
};

export default ChatList;
