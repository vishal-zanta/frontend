import React, { useEffect, useRef } from "react";
import SearchDebounced from "@/components/debounced/SearchDebounced";
import UserItem from "./UserItem";
import { usePutMarkMessagesAsRead } from "@/hooks/query/useGetChats";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/utils/constants";

export default function UsersSidebar({
  selectedUser,
  setSelectedUser,
  onSelect,
  visible,
  currentUserId,
  // lifted conversation props
  conversations = [],
  isLoading = false,
  isFetchingMore = false,
  hasMore = false,
  onLoadMore,
  search = "",
  onSearchChange,
}) {
  const qc = useQueryClient();

  const readMutation = usePutMarkMessagesAsRead({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.CHATS_INFINTE] });
    },
  });

  // ── IntersectionObserver: fires onLoadMore when the sentinel scrolls into view
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore || isFetchingMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore?.();
        }
      },
      { threshold: 0.1 }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, isFetchingMore, isLoading, onLoadMore]);

  return (
    <div
      className={`flex flex-col border-r border-slate-100 bg-white
        ${visible ? "flex" : "hidden"}
        w-full h-full`}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 bg-white sticky top-0 z-10">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Conversations</h3>
        <SearchDebounced
          initialValue={search}
          handleDebouncedChange={onSearchChange}
          placeholder="Search by name or email..."
        />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin">
        {isLoading ? (
          <div className="space-y-1 p-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl animate-pulse"
              >
                <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500">No users found</p>
          </div>
        ) : (
          <>
            {conversations.map((user) => (
              <UserItem
                key={user._id}
                user={user?.user}
                selected={selectedUser?.conversationId === user?._id}
                onClick={(clickedUser) => {
                  onSelect({
                    ...clickedUser,
                    conversationId: user?._id,
                  });

                  if ((user?.unreadCounts ?? 0) > 0) {
                    readMutation.mutate(user?._id);
                  }
                }}
                unreadCounts={user?.unreadCounts ?? 0}
              />
            ))}

            {/* Sentinel — opacity-0, triggers IntersectionObserver */}
            <div ref={sentinelRef} className="h-1 opacity-0 w-full" />

            {/* Loading next page spinner */}
            {isFetchingMore && (
              <div className="flex justify-center items-center py-4 text-blue-900 gap-2 text-xs font-semibold">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading more...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
