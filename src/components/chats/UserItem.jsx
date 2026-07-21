import React from "react";
import Avatar from "./Avatar";

export default function UserItem({ user, selected, onClick, unreadCounts }) {
  return (
    <button
      onClick={() => onClick(user)}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-all hover:bg-muted/50 ${
        selected ? "bg-primary/10 border-r-2 border-r-primary" : ""
      }`}
    >
      <Avatar initials={user.name[0]}  />
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold truncate ${selected ? "text-primary" : "text-foreground"}`}>
          {user.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        {user.role && (
          <p className="text-[11px] text-muted-foreground/70 truncate">{user.role}</p>
        )}
      </div>
      {unreadCounts > 0 && (
        <div className="shrink-0 flex items-center justify-center h-5 min-w-[20px] rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unreadCounts}
        </div>
      )}
    </button>
  );
}
