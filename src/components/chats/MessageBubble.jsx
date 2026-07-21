import React from "react";
import { Paperclip } from "lucide-react";
import Avatar from "./Avatar";
import { formatTime, fileSize } from "@/utils/helpers";
import { IMG_BASE_URL } from "@/utils/constants";
import clsx from "clsx";

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
          <p className="text-[11px] text-muted-foreground font-medium px-1">{senderName}</p>
        )}

        {/* Attachments */}
        {msg.attachments?.length > 0 && (
          <div className="space-y-1.5 min-w-0 max-w-[100%]">
            {msg.attachments.map((att, i) => {
              const url = IMG_BASE_URL + att.url ;
              return (
              <div key={i}>
                {isImage(att.type) ? (
                  <div className={clsx("h-48 flex items-center", isOwn ? "justify-end" : "justify-start")}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center h-full max-w-full"
                    >
                      <img
                        src={url}
                        alt={att.name}
                        className="max-h-48 max-w-full rounded-xl object-contain border border-border shadow-sm"
                      />
                    </a>
                  </div>
                ) : (
                  <a
                    href={url}
                    download={att.name}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border shadow-sm
                      ${isOwn
                        ? "bg-blue-700 text-white border-blue-600"
                        : "bg-card text-foreground border-border"
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
            )
            })}
          </div>
        )}

        {/* Text content */}
        {msg.content && (
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words
              ${isOwn
                ? "bg-blue-900 text-white rounded-br-sm"
                : "bg-card text-foreground border border-border rounded-bl-sm"
              }`}
          >
            {msg.content}
          </div>
        )}

        <p className={`text-[11px] text-muted-foreground/70 px-1 ${isOwn ? "text-right" : "text-left"}`}>
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
