import React from "react";
import { Paperclip } from "lucide-react";
import Avatar from "./Avatar";
import { formatTime, fileSize } from "@/utils/helpers";

export default function MessageBubble({ msg, isOwn, senderName }) {
  const isImage = (type) => type?.startsWith("image/");

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}>
      {!isOwn && (
        <div className="shrink-0 mr-2 mt-auto">
          <Avatar initials={senderName.slice(0, 2).toUpperCase()} size="sm" />
        </div>
      )}
      <div className={`max-w-[75%] min-w-0 space-y-1 ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
        {!isOwn && (
          <p className="text-[11px] text-slate-500 font-medium px-1">{senderName}</p>
        )}

        {/* Attachments */}
        {msg.attachments?.length > 0 && (
          <div className="space-y-1.5">
            {msg.attachments.map((att, i) => (
              <div key={i}>
                {isImage(att.type) ? (
                  <a href={att.url} target="_blank" rel="noreferrer">
                    <img
                      src={att.url}
                      alt={att.name}
                      className="max-h-48 max-w-xs rounded-xl object-cover border border-slate-200 shadow-sm"
                    />
                  </a>
                ) : (
                  <a
                    href={att.url}
                    download={att.name}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border shadow-sm
                      ${isOwn
                        ? "bg-blue-700 text-white border-blue-600"
                        : "bg-white text-slate-700 border-slate-200"
                      }`}
                  >
                    <Paperclip className="w-4 h-4 shrink-0 opacity-70" />
                    <div className="min-w-0">
                      <p className="font-medium text-xs truncate max-w-[160px]">{att.name}</p>
                      {att.size && (
                        <p className="text-[11px] opacity-70">{fileSize(att.size)}</p>
                      )}
                    </div>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Text content */}
        {msg.content && (
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words
              ${isOwn
                ? "bg-blue-900 text-white rounded-br-sm"
                : "bg-white text-slate-800 border border-slate-100 rounded-bl-sm"
              }`}
          >
            {msg.content}
          </div>
        )}

        <p className={`text-[11px] text-slate-400 px-1 ${isOwn ? "text-right" : "text-left"}`}>
          {formatTime(msg.createdAt)}
        </p>
      </div>
      {isOwn && (
        <div className="shrink-0 ml-2 mt-auto">
          <Avatar initials="Me" size="sm" />
        </div>
      )}
    </div>
  );
}
