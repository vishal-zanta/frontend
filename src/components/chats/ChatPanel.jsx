import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, MessageSquareDot } from "lucide-react";
import UsersSidebar from "./UsersSidebar";
import ChatArea from "./ChatArea";
import { getConversations } from "@/api/chats.api";
import { normalizedUserList } from "./useChatData";

const LIMIT = 10;

const initialState = {
  unreadCounts: null,
};

export default function ChatPanel({ onClose, currentUserId }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [sharedState, setSharedState] = useState(initialState);
  const [mobileView, setMobileView] = useState("list"); // "list" | "chat"

  // ── Conversation state (lifted from UsersSidebar) ──────────────────────────
  const [conversations, setConversations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [search, setSearch] = useState("");

  // Guard so we never fire two concurrent fetches for the same page
  const fetchingPageRef = useRef(null);

  const fetchConversations = useCallback(
    async (page, searchTerm = search) => {
      // Prevent duplicate in-flight requests for the same page
      if (fetchingPageRef.current === page) return;
      fetchingPageRef.current = page;

      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      try {
        const res = await getConversations({
          page,
          limit: LIMIT,
          search: searchTerm,
        });

        const rawDocs = res?.data?.data?.docs || [];

        const pagination = res?.data?.data?.pagination || {};

        const isLastPage =
          pagination?.isLastPage ?? page >= pagination?.totalPages;

        setConversations((prev) =>
          page === 1 ? rawDocs : [...prev, ...rawDocs],
        );
        setHasMore(!isLastPage);
        setCurrentPage(page);
      } catch (err) {
        console.error("fetchConversations error", err);
      } finally {
        fetchingPageRef.current = null;
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    [search],
  );

  // Initial fetch & refetch when search changes
  useEffect(() => {
    setConversations([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchConversations(1, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isFetchingMore || isLoading) return;
    fetchConversations(currentPage + 1);
  }, [hasMore, isFetchingMore, isLoading, currentPage, fetchConversations]);

  const uniqueConversations = normalizedUserList(conversations, currentUserId);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMobileView("chat");
  };

  const handleBack = () => {
    setMobileView("list");
  };

  const handleClose = () => {
    setSelectedUser(null);
    setMobileView("list");
    onClose(() => {
      setSharedState(initialState);
    });
  };

  return (
    <div
      className="absolute bottom-14 right-0 w-[min(400px,95vw)] bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden flex flex-col"
      style={{ height: "min(560px, 85vh)" }}
    >
      <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-blue-950 to-blue-700 text-white shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquareDot className="w-5 h-5 opacity-90" />
          <span className="font-bold text-sm tracking-wide">Messages</span>
        </div>
        <button
          onClick={handleClose}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <UsersSidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          onSelect={handleSelectUser}
          visible={mobileView === "list"}
          currentUserId={currentUserId}
          sharedState={sharedState}
          setSharedState={setSharedState}
          // ── lifted conversation props ──
          conversations={uniqueConversations}
          isLoading={isLoading}
          isFetchingMore={isFetchingMore}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          search={search}
          onSearchChange={setSearch}
        />

        <div
          className={`flex-1 flex min-w-0
            ${mobileView === "list" ? "hidden" : "flex"}
            flex-col`}
        >
          <ChatArea
            selectedUser={selectedUser}
            currentUserId={currentUserId}
            onBack={handleBack}
            sharedState={sharedState}
            setSharedState={setSharedState}
          />
        </div>
      </div>
    </div>
  );
}
