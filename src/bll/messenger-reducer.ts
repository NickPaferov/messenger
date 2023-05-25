import { chatAPI } from '../api/chat-api';
import { AppThunkType } from './store';

const initialState = {
  idInstance: null as null | string,
  apiTokenInstance: null as null | string,
  chats: [
    { chatId: '3@c.us', messages: [{ idMessage: 'ABC', sender: '3@c.us', message: 'hello' }] },
    {
      chatId: '2@c.us',
      messages: [
        { idMessage: 'DEF', sender: '2@c.us', message: 'how are you?' },
        { idMessage: 'GHI', sender: '2@c.us', message: 'are you looking for a job?' },
      ],
    },
    { chatId: '1@c.us', messages: [{ idMessage: 'KLM', sender: '1@c.us', message: 'what are you doing?' }] },
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
                messages: [
                  ...chat.messages,
                  { idMessage: action.idMessage, sender: action.sender, message: action.message },
                ],
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
export const setMessageAC = (chatId: string, idMessage: string, sender: string, message: string) =>
  ({
    type: 'CHAT/SET-MESSAGE',
    chatId,
    idMessage,
    sender,
    message,
  } as const);

export const sendMessageTC =
  (chatId: string, message: string): AppThunkType =>
  async (dispatch, getState) => {
    const { idInstance, apiTokenInstance } = getState().messenger;
    try {
      if (!idInstance || !apiTokenInstance) return;
      await chatAPI.sendMessage(idInstance, apiTokenInstance, chatId, message);
    } catch (e) {
      console.log(e);
    }
  };

export const receiveMessageTC = (): AppThunkType => async (dispatch, getState) => {
  const { idInstance, apiTokenInstance } = getState().messenger;
  try {
    if (!idInstance || !apiTokenInstance) return;
    let res = await chatAPI.receiveNotification(idInstance, apiTokenInstance);
    console.log(res.data);
    if (!res.data) return;
    if (res.data.body.typeWebhook === 'incomingMessageReceived') {
      dispatch(
        setMessageAC(
          res.data.body.senderData.chatId,
          res.data.body.idMessage,
          res.data.body.senderData.sender,
          res.data.body.messageData.textMessageData.textMessage
        )
      );
    }
    if (res.data.body.typeWebhook === 'outgoingMessageReceived') {
      dispatch(
        setMessageAC(
          res.data.body.senderData.chatId,
          res.data.body.idMessage,
          res.data.body.senderData.sender,
          res.data.body.messageData.textMessageData.textMessage
        )
      );
    }
    if (res.data.body.typeWebhook === 'outgoingAPIMessageReceived') {
      dispatch(
        setMessageAC(
          res.data.body.senderData.chatId,
          res.data.body.idMessage,
          res.data.body.senderData.sender,
          res.data.body.messageData.extendedTextMessageData.text
        )
      );
    }
    await chatAPI.deleteNotification(idInstance, apiTokenInstance, res.data.receiptId);
  } catch (e) {
    console.log(e);
  }
};

export type MessengerActionsType =
  | ReturnType<typeof loginAC>
  | ReturnType<typeof createChatAC>
  | ReturnType<typeof setMessageAC>;
