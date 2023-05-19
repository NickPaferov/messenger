import React, { useState } from 'react';
import { loginAC } from '../bll/messenger-reducer';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../bll/store';

const Home = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');

  return (
    <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <input
        type="text"
        value={idInstance}
        placeholder="input idInstance"
        onChange={(e) => {
          setIdInstance(e.currentTarget.value);
        }}
      />
      <input
        type="text"
        value={apiTokenInstance}
        placeholder="input apiTokenInstance"
        onChange={(e) => {
          setApiTokenInstance(e.currentTarget.value);
        }}
      />
      <button
        onClick={() => {
          dispatch(loginAC(idInstance, apiTokenInstance));
          navigate('/chats');
        }}
      >
        LogIn
      </button>
    </form>
  );
};

export default Home;
