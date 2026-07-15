import React, { useState } from "react";
import { X, MessageSquareDot } from "lucide-react";
import UsersSidebar from "./UsersSidebar";
import ChatArea from "./ChatArea";
import { useGetProfile } from "@/hooks/query/useGetProfile";

const initialState = {
  unreadCounts: null,
};
export default function ChatPanel({ onClose, currentUserId }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [sharedState, setSharedState] = useState(initialState);
  const [mobileView, setMobileView] = useState("list"); // "list" | "chat"

  // Use useGetProfile to obtain current logged-in user profile

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
    onClose(()=>{
      setSharedState(initialState);
    });
  };

  return (
    <div
      className="absolute bottom-14 right-0 w-[min(400px,95vw)] bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden flex flex-col"
      style={{ height: "min(560px, 85vh)" }}
    >
      {/* Panel header */}
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

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop: always show sidebar */}
        {/* Mobile: switch between list and chat */}
        <UsersSidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          onSelect={handleSelectUser}
          visible={mobileView === "list"}
          currentUserId={currentUserId}
          sharedState={sharedState}
          setSharedState={setSharedState}
        />

        {/* Chat area */}
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
