import React, { useState, useRef, useCallback } from "react";
import { Paperclip, Send, Loader2 } from "lucide-react";
import AttachmentPreview from "./AttachmentPreview";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postChatMessage, postConversation } from "@/api/chats.api";
import { QUERY_KEYS } from "@/utils/constants";
import { getErrorToast } from "@/utils/helpers";

// ─── Allowed MIME types & size limit ────────────────────────────────────────
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "audio/mpeg",
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// ─── Build FormData for POST /chat/message ───────────────────────────────────
const buildMessageFormData = ({ conversationId, text, file }) => {
  const formData = new FormData();
  formData.append("conversationId", conversationId);
  if (text?.trim()) formData.append("content", text.trim());
  if (file) {
    // Determine type from mime
    const mime = file.type || "";
    let type = "FILE";
    if (mime.startsWith("image/")) type = "IMAGE";
    else if (mime.startsWith("video/")) type = "VIDEO";
    else if (mime.startsWith("audio/")) type = "AUDIO";
    else type = "FILE";
    formData.append("type", type);
    formData.append("file", file);
  } else {
    formData.append("type", "TEXT");
  }
  return formData;
};

export default function MessageInput({ selectedUser, setAllMessages , setSelectedUser}) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const qc = useQueryClient();
  

  const postMessageMutation = useMutation({
    mutationFn: postChatMessage,
    onSuccess: (data, variables) => {
      setAllMessages((prev)=> [...prev, data?.data?.data]);
      setSelectedUser((prev)=> ({...prev, conversationId: data?.data?.data?.conversation}));
      // qc.invalidateQueries({ queryKey: ["chat-messages"] });
      
    },
  });

  const postConversionMutation = useMutation({
    mutationFn: postConversation,
    onSuccess: (res, variables) => {
      const conversationId = res?.data?.data?._id;
      if (conversationId) {
        const formData = buildMessageFormData({
          conversationId,
          text: variables._pendingText,
          file: variables._pendingFile,
        });
        postMessageMutation.mutate(formData);
      }
    },
  });

  const onSend = (trimmedText, attachedFiles) => {
    const conversationId = selectedUser?.conversationId;
    const file = attachedFiles?.[0] ?? null; // single file support

    if (!!conversationId && conversationId.startsWith("new_")) {
      // No conversation yet → create one first, then send message in onSuccess
      const targetUserId = selectedUser?._id;
      postConversionMutation.mutate({
        id: targetUserId,
        _pendingText: trimmedText,
        _pendingFile: file,
      });
    } else {
      // Conversation exists → send message directly
      const formData = buildMessageFormData({
        conversationId,
        text: trimmedText,
        file,
      });
      postMessageMutation.mutate(formData);
    }
  };

  const isSending =
    postMessageMutation.isPending || postConversionMutation.isPending;

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
    const oversized = [];
    const selected = Array.from(e.target.files || []).filter((f) => {
      if (!ALLOWED_MIME_TYPES.has(f.type)) return false;
      if (f.size > MAX_FILE_SIZE) { oversized.push(f.name); return false; }
      return true;
    });
    if (oversized.length) {
      getErrorToast(`File(s) exceed the 10 MB limit and were not attached:\n${oversized.join("\n")}`);
      // return;
    }
    setFiles(() => [...selected]);
    e.target.value = "";
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const canSend = (text.trim().length > 0 || files.length > 0) && !isSending;

  const isInactive = selectedUser?.status === "INACTIVE";

  return (
    <div className="border-t border-slate-100 bg-white">
      {isInactive ? (
        <div className="flex items-center justify-center py-5 px-3 text-sm font-medium text-slate-500 bg-slate-50/50">
          This user is no longer active.
        </div>
      ) : (
        <>
          <AttachmentPreview files={files} onRemove={removeFile} />
          <div className="flex items-end gap-2 px-3 py-2.5">
            {/* Attachment */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,audio/mpeg"
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
              rows={2}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 scrollbar-thin transition-all leading-relaxed max-h-[120px] overflow-y-auto"
              // style={{ height: "46px !important" }}
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
              {isSending ? (
                <Loader2 className="w-[18px] h-[18px] animate-spin" />
              ) : (
                <Send className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
