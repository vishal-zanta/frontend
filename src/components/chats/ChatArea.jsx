import React from "react";
import { MessageSquareDot } from "lucide-react";
import ChatHeader from "./ChatHeader";
import MessagesContainer from "./MessagesContainer";
import MessageInput from "./MessageInput";

export default function ChatArea({ selectedUser, currentUserId, onBack, sharedState, setSharedState }) {
  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
          <MessageSquareDot className="w-8 h-8 text-blue-300" />
        </div>
        <p className="text-sm font-semibold text-slate-600">Select a conversation</p>
        <p className="text-xs text-slate-400 mt-1.5">Choose a user from the list to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ChatHeader user={selectedUser} onBack={onBack} />
      <MessagesContainer
        currentUserId={currentUserId}
        selectedUser={selectedUser}
        sharedState={sharedState}
        setSharedState={setSharedState}
      />
      <MessageInput selectedUser={selectedUser} />
    </div>
  );
}
