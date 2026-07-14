import React, { useState } from "react";
import ChatPanel from "./ChatPanel";
import FloatingChatButton from "./FloatingChatButton";
import { useGetProfile } from "@/hooks/query/useGetProfile";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
    const { data: profileRes } = useGetProfile();
  const currentUserId = profileRes?.data?.data?._id

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
       {isOpen &&  <ChatPanel onClose={(fn) => {setIsOpen(false)
        fn && fn()
       }} currentUserId={currentUserId} />}
      </div>

      {/* Floating button */}
      <FloatingChatButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </div>
  );
}
