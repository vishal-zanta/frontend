import React, { useEffect, useRef, useCallback, useState } from "react";
import { MessageSquareDot, Loader2 } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { formatDate } from "@/utils/helpers";
import {
  useGetChatsMessagesInfinite,
  usePutMarkMessagesAsRead,
} from "@/hooks/query/useGetChats";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/utils/constants";
import socketIOClient from "socket.io-client";
import { normalizeMessage } from "./useChatData";
const token =
  localStorage.getItem("usertoken") || sessionStorage.getItem("usertoken");
const link = `${import.meta.env.VITE_BASE_URL}?token=${token}`;

const socket = socketIOClient(link);

export default function MessagesContainer({ currentUserId, selectedUser }) {
  const conversationId = selectedUser?.conversationId;
  const [socketMessages, setSocketMessages] = useState([]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetChatsMessagesInfinite(
      conversationId,
      {},
      {
        enabled:
          !!conversationId && !conversationId.includes("new_") ? true : false,
      },
    );

  // Flatten all pages — API returns oldest→newest per page, pages go 1→N (oldest first loaded)
  // We reverse page order so older pages (higher page numbers) come first in the list

  const allMessagesFromApi =
    data?.pages
      ?.slice()
      .reverse()
      .flatMap((page) => {
        const arr = Array.isArray(page?.data?.data)
          ? page.data.data
          : page?.data?.data?.docs || page?.data?.docs || [];
        return arr;
      }) || [];
  const messages = [
    ...allMessagesFromApi,
    ...socketMessages.filter(
      (socketMsg) =>
        !allMessagesFromApi.find((all) => all._id == socketMsg._id),
    ),
  ].map((m) => normalizeMessage(m, currentUserId));

  // ─── Mark as read after messages load ────────────────────────────────────
  const queryClient = useQueryClient();
  const readMutation = usePutMarkMessagesAsRead({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHATS_INFINTE] });
    },
  });

  useEffect(() => {
    const handleNewMessage = (data) => {
      setSocketMessages((prev) => [...prev, data.message]);
      readMutation.mutate(selectedUser?.conversationId);
    };
    socket.onAny((event, ...args) => {
      console.log(`New Event eventname -> ${event}`);
    });

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [readMutation, selectedUser?.conversationId]);

  // console.log({ messages, socketMessages, allMessagesFromApi });

  // useEffect(() => {
  //   if (!isLoading && messages.length > 0 && conversationId) {
  //     readMutation.mutate(conversationId);
  //   }
  // }, [isLoading, messages.length, conversationId]);

  // Refs for scroll management
  const containerRef = useRef(null);
  const topSentinelRef = useRef(null); // triggers load-more when visible
  const bottomRef = useRef(null); // scroll anchor on initial load / conversation change
  const isInitialLoad = useRef(true);
  const prevScrollHeight = useRef(0);

  // Auto-scroll to bottom on first load / conversation switch
  useEffect(() => {
    isInitialLoad.current = true;
    setSocketMessages([]);
  }, [conversationId]);

  useEffect(() => {
    if (!isLoading && isInitialLoad.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
      isInitialLoad.current = false;
    }
  }, [isLoading, messages.length]);

  // Smooth scroll to bottom when a new message is received / posted
  const lastMessageId = messages[messages.length - 1]?.id;
  const lastMessageIdRef = useRef(lastMessageId);

  useEffect(() => {
    if (
      conversationId &&
      lastMessageId &&
      lastMessageId !== lastMessageIdRef.current
    ) {
      if (!isInitialLoad.current && !isFetchingNextPage) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      lastMessageIdRef.current = lastMessageId;
    } else if (lastMessageId) {
      lastMessageIdRef.current = lastMessageId;
    }
  }, [lastMessageId, conversationId, isFetchingNextPage]);

  // Preserve scroll position when loading older messages
  useEffect(() => {
    if (isFetchingNextPage && containerRef.current) {
      prevScrollHeight.current = containerRef.current.scrollHeight;
    }
  }, [isFetchingNextPage]);

  useEffect(() => {
    if (
      !isFetchingNextPage &&
      prevScrollHeight.current &&
      containerRef.current
    ) {
      const newScrollHeight = containerRef.current.scrollHeight;
      containerRef.current.scrollTop =
        newScrollHeight - prevScrollHeight.current;
      prevScrollHeight.current = 0;
    }
  }, [isFetchingNextPage, messages.length]);

  // IntersectionObserver on top sentinel to trigger loading older messages
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    const el = topSentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ─── Empty state (no conversation selected handled above in ChatArea) ─────
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-sm">Loading messages...</p>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/20">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
          <MessageSquareDot className="w-6 h-6 text-blue-400" />
        </div>
        <p className="text-sm font-medium text-slate-700">No messages yet</p>
        <p className="text-xs text-slate-400 mt-1">
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

  // console.log({messages, grouped});

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin px-4 py-4 space-y-2"
    >
      {/* Top sentinel — 0 opacity trigger for IntersectionObserver */}
      <div ref={topSentinelRef} className="h-1 opacity-0 w-full" />

      {/* Loading older messages spinner */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-3 gap-2 text-blue-900">
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
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[11px] text-slate-400 font-medium bg-white px-2 whitespace-nowrap">
                {item.label}
              </span>
              <div className="flex-1 h-px bg-slate-100" />
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
