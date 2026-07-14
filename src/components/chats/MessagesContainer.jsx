import React, { useEffect, useRef } from "react";
import { MessageSquareDot } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { formatDate } from "@/utils/helpers";

export default function MessagesContainer({ messages, currentUserId, selectedUser }) {
  const bottomRef = useRef(null);

  console.log({selectedUser});
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  if (!messages.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/20">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
          <MessageSquareDot className="w-6 h-6 text-blue-400" />
        </div>
        <p className="text-sm font-medium text-slate-700">No messages yet</p>
        <p className="text-xs text-slate-400 mt-1">Send a message to start the conversation</p>
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
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-2">
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
            senderName={isOwn ? "You" : selectedUser.name}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
