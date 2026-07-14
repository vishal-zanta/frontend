import instance from "../lib/axios";

export const getConversations = async (params) => {
  return instance.get("/chat/conversations", { params });
};

export const getConversationMessages = async (id, params) => {
  return instance.get(`/chat/messages/${id}`, { params });
};

export const getUserOnlineStatus = async (userId) => {
  return instance.get(`/chat/status/${userId}`);
};

export const putMarkMessagesAsRead = async (conversationId) => {
  return instance.put(`/chat/messages/${conversationId}/read`);
};