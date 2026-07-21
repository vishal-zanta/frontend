import React from "react";
import { ArrowLeft } from "lucide-react";
import Avatar from "./Avatar";
import { useGetUserOnlineStatus } from "@/hooks/query/useGetChats";

export default function ChatHeader({ user, onBack }) {
  const { data: statusRes } = useGetUserOnlineStatus(user?._id);
  const isOnline = !!statusRes?.data?.data?.isOnline;

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
      {onBack && (
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors mr-1"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      )}
      {user?.name && (
        <Avatar initials={user?.name.slice(0, 1)} size="lg" online={isOnline} />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        {user.role && (
          <p className="text-[11px] text-muted-foreground/70">{user.role}</p>
        )}
      </div>
      <div
        className={`w-2 h-2 rounded-full shrink-0 ${
          isOnline ? "bg-emerald-500" : "bg-muted-foreground/30"
        }`}
      />
    </div>
  );
}
