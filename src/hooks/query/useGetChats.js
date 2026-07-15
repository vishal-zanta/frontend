import { useInfiniteQuery, useQuery, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../utils/constants";
import { getConversations, getUserOnlineStatus, putMarkMessagesAsRead, getConversationMessages } from "../../api/chats.api";

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

/**
 * Infinite query for conversation messages.
 * - Pages are fetched newest-first (page=1 is latest), older pages have higher page numbers.
 * - Use fetchNextPage() to load older messages (scroll up trigger).
 * - Messages within each page are already ordered oldest→newest from the API.
 */
export const useGetChatsMessagesInfinite = (conversationId, params = {}, options = {}) => {
  return useInfiniteQuery({
    queryKey: ["chat-messages", conversationId, params],
    queryFn: ({ pageParam = 1 }) =>
      getConversationMessages(conversationId, { ...params, page: pageParam, limit: params.limit || 10 }),
    getNextPageParam: (lastPage, allPages) => {
      const pagination = lastPage?.data?.pagination || lastPage?.pagination || lastPage?.data?.data?.pagination;
      if (pagination) {
        const currentPage = pagination.page || pagination.currentPage || 1;
        const totalPages = pagination.totalPages || 1;
        return currentPage < totalPages ? currentPage + 1 : undefined;
      }
      // Fallback: if we got a full page, assume there might be more older ones
      const dataArr = lastPage?.data?.data || lastPage?.data || [];
      if (Array.isArray(dataArr) && dataArr.length >= (params.limit || 10)) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    // maxPages: 1,                  // only ever cache/refetch 1 page at a time
    // staleTime: 1000 * 60,         // 1 min — prevent refetch on every conversation switch
    // refetchOnWindowFocus: false,
    enabled: !!conversationId,
    ...options,
  });
};



