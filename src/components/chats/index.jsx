import React, { useState } from "react";
import ChatPanel from "./ChatPanel";
import FloatingChatButton from "./FloatingChatButton";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2">
      {/* Panel */}
      <div
        className={`transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        <ChatPanel onClose={() => setIsOpen(false)} />
      </div>

      {/* Floating button */}
      <FloatingChatButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </div>
  );
}
