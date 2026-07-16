import React, { useEffect, useState, useCallback } from "react";
import { X, MessageSquareDot } from "lucide-react";
import { useSockets } from "@/context/SocketContext";

export default function FloatingChatButton({ isOpen, onClick }) {
  const { subscribe } = useSockets();
  const [isUnreadPresent, setIsUnreadPresent] = useState(false);

  useEffect(() => {
    const unSub = subscribe("newMessage", (data) => {
   
      if (!isOpen) setIsUnreadPresent(true);
    });
    return () => unSub();
  }, [subscribe, isOpen]);

  const handleClick = useCallback(() => {
    setIsUnreadPresent(false); 
    onClick?.();
  }, [onClick]);

  return (
    <button
      onClick={handleClick}
      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-blue-900/30
        bg-gradient-to-br from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500
        text-white transition-all duration-300 active:scale-90 relative
        ${isOpen ? "rotate-[360deg]" : "rotate-0"}`}
      title={isOpen ? "Close chat" : "Open chat"}
      style={{ transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.2s" }}
    >
      {isOpen ? <X className="w-6 h-6" /> : <MessageSquareDot className="w-6 h-6" />}

      {/* Unread badge */}
      {isUnreadPresent && !isOpen && (
        <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center">
          {/* Outer ping ring */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
          {/* Solid dot */}
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500 border-2 border-white shadow-sm" />
        </span>
      )}
    </button>
  );
}

