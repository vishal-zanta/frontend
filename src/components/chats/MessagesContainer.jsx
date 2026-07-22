import React, { useEffect, useRef, useState } from "react";
import { MessageSquareDot, Loader2 } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { formatDate } from "@/utils/helpers";
import { usePutMarkMessagesAsRead } from "@/hooks/query/useGetChats";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/utils/constants";
import { normalizeMessage } from "./useChatData";
import { useSockets } from "@/context/SocketContext";
import { getConversationMessages } from "@/api/chats.api";

const LIMIT = 10;

export default function MessagesContainer({
  currentUserId,
  selectedUser,
  allMessages,
  setAllMessages,
}) {
  const conversationId = selectedUser?.conversationId;
  const { subscribe } = useSockets();

  // ── Pagination state ────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Guard against concurrent fetches for the same page
  const fetchingPageRef = useRef(null);

  // ── Socket messages (real-time additions) ──────────────────────────────────
  const [socketMessages, setSocketMessages] = useState([]);

  // ── Fetch a single page of messages ────────────────────────────────────────
  const fetchMessages = async (page) => {
    if (!conversationId || conversationId.includes("new_")) return;
    if (fetchingPageRef.current === page) return;
    fetchingPageRef.current = page;

    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }

    try {
      const res = await getConversationMessages(conversationId, {
        page,
        limit: LIMIT,
      });

      const rawDocs = res?.data?.data?.docs;

      const pagination = res?.data?.data?.pagination;

      const totalPages = pagination?.totalPages ?? null;
      const isLast =
        (pagination?.isLastPage ?? totalPages !== null)
          ? page >= totalPages
          : rawDocs.length < LIMIT;

      setHasMore(!isLast);
      setCurrentPage(page);

      // Older pages are prepended; page-1 replaces everything
      setAllMessages((prev) => (page === 1 ? rawDocs : [...rawDocs, ...prev]));
    } catch (err) {
      console.error("fetchMessages error", err);
    } finally {
      fetchingPageRef.current = null;
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    if (!conversationId) return;

    setAllMessages([]);
    setSocketMessages([]);
    setCurrentPage(1);
    setHasMore(false);
    fetchingPageRef.current = null;
    fetchMessages(1);
  }, [conversationId]);

  // ── Load next (older) page ─────────────────────────────────────────────────
  const handleLoadOlder = () => {
    if (!hasMore || isFetchingMore || isLoading) return;
    fetchMessages(currentPage + 1);
  };


  const readMutation = usePutMarkMessagesAsRead();

  useEffect(() => {
    const handleNewMessage = (data) => {
      // console.log("New Message Arrived ", data, selectedUser);
      if (data.message.conversation === selectedUser?.conversationId) {
        setSocketMessages((prev) => [...prev, data.message]);
        readMutation.mutate(selectedUser?.conversationId);
      }
    };
    const unSub = subscribe("newMessage", handleNewMessage);
    return () => unSub();
  }, [readMutation, selectedUser?.conversationId, subscribe]);

  const messages = [
    ...allMessages,
    ...socketMessages.filter(
      (sm) => !allMessages.find((m) => m._id === sm._id),
    ),
  ]
    .map((m) => normalizeMessage(m, currentUserId))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const containerRef = useRef(null);
  const topSentinelRef = useRef(null);
  const bottomRef = useRef(null);
  const isInitialLoad = useRef(true);
  const prevScrollHeight = useRef(0);

  useEffect(() => {
    isInitialLoad.current = true;
  }, [conversationId]);

  useEffect(() => {
    if (!isLoading && isInitialLoad.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
      isInitialLoad.current = false;
    }
  }, [isLoading, messages.length]);

  const lastMessageId = messages[messages.length - 1]?.id;
  const lastMessageIdRef = useRef(lastMessageId);
  useEffect(() => {
    if (
      conversationId &&
      lastMessageId &&
      lastMessageId !== lastMessageIdRef.current
    ) {
      if (!isInitialLoad.current && !isFetchingMore) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      lastMessageIdRef.current = lastMessageId;
    } else if (lastMessageId) {
      lastMessageIdRef.current = lastMessageId;
    }
  }, [lastMessageId, conversationId, isFetchingMore]);

  useEffect(() => {
    if (isFetchingMore && containerRef.current) {
      prevScrollHeight.current = containerRef.current.scrollHeight;
    }
  }, [isFetchingMore]);

  useEffect(() => {
    if (!isFetchingMore && prevScrollHeight.current && containerRef.current) {
      const newScrollHeight = containerRef.current.scrollHeight;
      containerRef.current.scrollTop =
        newScrollHeight - prevScrollHeight.current;
      prevScrollHeight.current = 0;
    }
  }, [isFetchingMore, messages.length]);

  useEffect(() => {
    if (!hasMore || isFetchingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadOlder();
        }
      },
      { threshold: 0.1 },
    );

    const el = topSentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, isFetchingMore, currentPage]);

  // console.log("CONVERSATION", {allMessages, socketMessages});

  // ── Render ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-card  items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-sm">Loading messages...</p>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-card ">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
          <MessageSquareDot className="w-6 h-6 text-blue-400" />
        </div>
        <p className="text-sm font-medium text-foreground">No messages yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Send a message to start the conversation
        </p>
      </div>
    );
  }

  // Group messages by date
  const grouped = [];
  let lastDate = null;
  messages.forEach((msg) => {
    const date = formatDate(msg.createdAt);
    if (date !== lastDate) {
      grouped.push({ type: "date", label: date, id: `date-${msg.id}` });
      lastDate = date;
    }
    grouped.push({ type: "message", data: msg, id: msg.id });
  });

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-card overflow-y-auto overscroll-contain scrollbar-thin px-4 py-4 space-y-2"
    >
      {/* Top sentinel — triggers IntersectionObserver to load older messages */}
      <div ref={topSentinelRef} className="h-1 opacity-0 w-full" />

      {/* Loading older messages spinner */}
      {isFetchingMore && (
        <div className="flex justify-center items-center py-3 gap-2 text-blue-600 dark:text-blue-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs font-semibold">
            Loading older messages...
          </span>
        </div>
      )}

      {grouped.map((item) => {
        if (item.type === "date") {
          return (
            <div key={item.id} className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-muted-foreground font-medium bg-card px-2 whitespace-nowrap">
                {item.label}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
          );
        }
        const msg = item.data;
        const isOwn = msg.fromUserId === currentUserId;
        return (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isOwn={isOwn}
            senderName={isOwn ? "You" : msg.senderName || selectedUser?.name}
          />
        );
      })}

      {/* Bottom anchor for auto-scroll */}
      <div ref={bottomRef} />
    </div>
  );
}
