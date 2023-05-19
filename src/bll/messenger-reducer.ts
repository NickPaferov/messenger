import { chatAPI } from '../api/chat-api';
import { AppThunkType } from './store';

const initialState = {
  idInstance: null as null | string,
  apiTokenInstance: null as null | string,
  chats: [
    { chatId: '3@c.us', messages: [{ idMessage: 'ABC', message: 'hello' }] },
    {
      chatId: '2@c.us',
      messages: [
        { idMessage: 'DEF', message: 'how are you?' },
        { idMessage: 'GHI', message: 'are you looking for a job?' },
      ],
    },
    { chatId: '1@c.us', messages: [{ idMessage: 'KLM', message: 'what are you doing?' }] },
  ],
};

export type StateType = typeof initialState;

export const MessengerReducer = (state = initialState, action: MessengerActionsType): StateType => {
  switch (action.type) {
    case 'CHAT/LOGIN':
      return { ...state, idInstance: action.idInstance, apiTokenInstance: action.apiTokenInstance };
    case 'CHAT/CREATE-CHAT':
      return { ...state, chats: [{ chatId: action.chatId, messages: [] }, ...state.chats] };
    case 'CHAT/SET-MESSAGE':
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.chatId === action.chatId
            ? {
                ...chat,
                messages: [...chat.messages, { idMessage: action.idMessage, message: action.message }],
              }
            : chat
        ),
      };
    default:
      return state;
  }
};

export const loginAC = (idInstance: string, apiTokenInstance: string) =>
  ({ type: 'CHAT/LOGIN', idInstance, apiTokenInstance } as const);
export const createChatAC = (chatId: string) => ({ type: 'CHAT/CREATE-CHAT', chatId } as const);
export const setMessageAC = (chatId: string, idMessage: string, message: string) =>
  ({
    type: 'CHAT/SET-MESSAGE',
    chatId,
    idMessage,
    message,
  } as const);

export const sendMessageTC =
  (chatId: string, message: string): AppThunkType =>
  async (dispatch, getState) => {
    const { idInstance, apiTokenInstance } = getState().messenger;
    try {
      if (!idInstance || !apiTokenInstance) return;
      const res = await chatAPI.sendMessage(idInstance, apiTokenInstance, chatId, message);
      dispatch(setMessageAC(chatId, res.data.idMessage, message));
    } catch (e) {
      console.log(e);
    }
  };

export type MessengerActionsType =
  | ReturnType<typeof loginAC>
  | ReturnType<typeof createChatAC>
  | ReturnType<typeof setMessageAC>;
