import React from "react";
import { X, MessageSquareDot } from "lucide-react";

export default function FloatingChatButton({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-blue-900/30
        bg-gradient-to-br from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500
        text-white transition-all duration-300 active:scale-90 relative
        ${isOpen ? "rotate-[360deg]" : "rotate-0"}`}
      title={isOpen ? "Close chat" : "Open chat"}
      style={{ transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.2s" }}
    >
      {isOpen ? <X className="w-6 h-6" /> : <MessageSquareDot className="w-6 h-6" />}
    </button>
  );
}
