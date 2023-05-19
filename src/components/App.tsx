import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ChatList from './ChatList';
import Chat from './Chat';
import Home from './Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chats" element={<ChatList />} />
      <Route path="/chats/:chatId" element={<Chat />} />
    </Routes>
  );
}

export default App;
