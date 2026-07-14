import React from "react";
import Avatar from "./Avatar";

export default function UserItem({ user, selected, onClick, unreadCounts }) {
  return (
    <button
      onClick={() => onClick(user)}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-all hover:bg-slate-50 ${
        selected ? "bg-blue-50 border-r-2 border-r-blue-600" : ""
      }`}
    >
      <Avatar initials={user.name[0]}  />
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold truncate ${selected ? "text-blue-900" : "text-slate-800"}`}>
          {user.name}
        </p>
        <p className="text-xs text-slate-500 truncate">{user.email}</p>
        {user.role && (
          <p className="text-[11px] text-slate-400 truncate">{user.role}</p>
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
