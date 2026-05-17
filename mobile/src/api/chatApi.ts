import { api } from './client';

export const chatApi = {
  async createSession(userId: number, username: string) {
    const response = await api.post('/api/chat/sessions', {
      userId: String(userId),
      username,
      requestSupport: 'true',
    });
    return response.data;
  },

  async sendMessage(chatSessionId: string, userId: number, content: string) {
    const response = await api.post('/api/chat/messages', {
      chatSessionId,
      senderId: String(userId),
      senderType: 'USER',
      senderName: `User ${userId}`,
      content,
    });
    return response.data;
  },

  async messages(chatSessionId: string) {
    const response = await api.get(`/api/chat/messages/session/${chatSessionId}`);
    return Array.isArray(response.data) ? response.data : [];
  },
};
