import React, { useState, useRef, useCallback } from "react";
import { Paperclip, Send } from "lucide-react";
import AttachmentPreview from "./AttachmentPreview";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed && files.length === 0) return;
    onSend(trimmed, files);
    setText("");
    setFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text, files, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const canSend = text.trim().length > 0 || files.length > 0;

  return (
    <div className="border-t border-slate-100 bg-white">
      <AttachmentPreview files={files} onRemove={removeFile} />
      <div className="flex items-end gap-2 px-3 py-2.5">
        {/* Attachment */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 p-2.5 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="Attach file"
        >
          <Paperclip className="w-[18px] h-[18px]" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 scrollbar-thin transition-all leading-relaxed max-h-[120px] overflow-y-auto"
          style={{ height: "42px" }}
        />

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`shrink-0 p-2.5 rounded-xl transition-all ${
            canSend
              ? "bg-blue-900 text-white hover:bg-blue-800 shadow-md shadow-blue-900/20 active:scale-95"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
          title="Send message"
        >
          <Send className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}
