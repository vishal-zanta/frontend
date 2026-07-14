import { useInfiniteQuery, useQuery, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../utils/constants";
import { getConversations, getUserOnlineStatus, putMarkMessagesAsRead } from "../../api/chats.api";

export const useGetChatsInfinte = (keys = [], param = {}, options = {}) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.CHATS_INFINTE, ...keys, param],
    queryFn: ({ pageParam = 1 }) => getConversations({ ...param, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const pagination = lastPage?.data?.pagination || lastPage?.pagination || lastPage?.data?.data?.pagination;
      if (pagination) {
        const currentPage = pagination.page || pagination.currentPage || 1;
        const totalPages = pagination.totalPages || 1;
        return currentPage < totalPages ? currentPage + 1 : undefined;
      }
      const dataArr = lastPage?.data?.data || lastPage?.data || [];
      if (Array.isArray(dataArr)) {
        const limit = param?.limit || 10;
        if (dataArr.length < limit) return undefined;
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    ...options,
  });
};

export const useGetUserOnlineStatus = (userId, options = {}) => {
  return useQuery({
    queryKey: ["user-status", userId],
    queryFn: () => getUserOnlineStatus(userId),
    enabled: !!userId,
    ...options,
  });
};

export const usePutMarkMessagesAsRead = (options = {}) => {
  return useMutation({
    mutationFn: (conversationId) => putMarkMessagesAsRead(conversationId),
    ...options,
  });
};


