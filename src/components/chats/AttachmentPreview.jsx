import React from "react";
import { Paperclip, X } from "lucide-react";

export default function AttachmentPreview({ files, onRemove }) {
  if (!files.length) return null;
  const isImage = (f) => f.type.startsWith("image/");

  return (
    <div className="flex flex-wrap gap-2 px-4 pt-2 pb-1">
      {files.map((file, i) => (
        <div key={i} className="relative group">
          {isImage(file) ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-14 h-14 rounded-lg object-cover border border-slate-200"
              />
              <button
                onClick={() => onRemove(i)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ) : (
            <div className="relative flex items-center gap-1.5 bg-slate-100 rounded-lg px-2.5 py-1.5 max-w-[140px]">
              <Paperclip className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="text-xs text-slate-700 truncate">{file.name}</span>
              <button
                onClick={() => onRemove(i)}
                className="ml-1 text-slate-500 hover:text-red-500 transition-colors shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
