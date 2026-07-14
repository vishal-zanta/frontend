import React, { useEffect } from "react";
import { MessageSquareDot } from "lucide-react";
import ChatHeader from "./ChatHeader";
import MessagesContainer from "./MessagesContainer";
import MessageInput from "./MessageInput";
import { useLocalChatMessages } from "./useChatData";
import { usePutMarkMessagesAsRead } from "../../hooks/query/useGetChats";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../utils/constants";

export default function ChatArea({ selectedUser, currentUserId, onBack }) {
  const { messages, sendMessage } = useLocalChatMessages(currentUserId, selectedUser?.id);
  const queryClient = useQueryClient();
  const readMutation = usePutMarkMessagesAsRead({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHATS_INFINTE] });
    },
  });

  useEffect(() => {
    if (selectedUser?.conversationId) {
      readMutation.mutate(selectedUser.conversationId);
    }
  }, [selectedUser?.conversationId]);

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

  console.log({selectedUser})
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ChatHeader user={selectedUser} onBack={onBack} />
      <MessagesContainer
        messages={messages}
        currentUserId={currentUserId}
        selectedUser={selectedUser}
      />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
