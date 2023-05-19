import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.green-api.com/',
});

export const chatAPI = {
  sendMessage(idInstance: string, apiTokenInstance: string, chatId: string, message: string) {
    return instance.post(`waInstance${idInstance}/SendMessage/${apiTokenInstance}`, { chatId, message });
  },
  receiveNotification(idInstance: string, apiTokenInstance: string) {
    return instance.get(`waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`);
  },
  deleteNotification(idInstance: string, apiTokenInstance: string, receiptId: number) {
    return instance.delete(`waInstance${idInstance}/DeleteNotification/${apiTokenInstance}/${receiptId}`);
  },
};
