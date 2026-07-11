import React from "react";
import { Camera, FileText, X } from "lucide-react";
import FormSection from "./FormSection";

export default function AttachmentsSection({
  fileInputRef,
  attachments,
  fileError,
  handleFileChange,
  removeAttachment,
  t,
}) {
  return (
    <FormSection title={t("Attachments", "संलग्नक")}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        onChange={handleFileChange}
      />

      {attachments.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="block w-full border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
        >
          <Camera className="w-9 h-9 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {t(
              "Click to upload photos, videos, or documents",
              "फ़ोटो, वीडियो या दस्तावेज अपलोड करने के लिए क्लिक करें",
            )}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {t("Max 10 MB per file", "प्रति फ़ाइल अधिकतम 10 MB")}
          </p>
        </button>
      ) : (
        <div className="space-y-2">
          {attachments.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 border border-border rounded-lg p-3"
            >
              <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
              <span className="text-sm flex-1 truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {(file.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={() => removeAttachment(idx)}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-blue-600 hover:underline inline-block mt-2"
          >
            + {t("Add more files", "और फ़ाइलें जोड़ें")}
          </button>
        </div>
      )}

      {fileError && (
        <p className="text-destructive text-xs mt-1">{fileError}</p>
      )}
    </FormSection>
  );
}
