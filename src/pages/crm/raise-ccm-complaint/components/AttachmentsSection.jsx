import React, { useMemo } from "react";
import {
  Camera,
  Film,
  Music,
  FileText,
  X,
  Plus,
  ExternalLink,
} from "lucide-react";
import FormSection from "./FormSection";

function ThumbnailItem({ file, onRemove, t }) {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const isAudio = file.type.startsWith("audio/");

  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  const handleClick = () => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  return (
    <div
      onClick={handleClick}
      title={`${file.name} (${(file.size / 1024).toFixed(0)} KB)`}
      className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl border border-border/80 bg-muted/30 overflow-hidden cursor-pointer shadow-xs hover:shadow-md hover:border-primary/50 transition-all flex flex-col items-center justify-center select-none"
    >
      {isImage ? (
        <img
          src={previewUrl}
          alt={file.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      ) : isVideo ? (
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <Film className="w-8 h-8 text-blue-500 mb-1" />
          <span className="text-[10px] text-muted-foreground truncate max-w-[80px] font-medium">
            {file.name}
          </span>
        </div>
      ) : isAudio ? (
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <Music className="w-8 h-8 text-emerald-500 mb-1" />
          <span className="text-[10px] text-muted-foreground truncate max-w-[80px] font-medium">
            {file.name}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <FileText className="w-8 h-8 text-amber-500 mb-1" />
          <span className="text-[10px] text-muted-foreground truncate max-w-[80px] font-medium">
            {file.name}
          </span>
        </div>
      )}

      {/* Hover overlay hint */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
        <ExternalLink className="w-5 h-5 text-white drop-shadow" />
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        title={t("Remove file", "फ़ाइल हटाएं")}
        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 hover:bg-destructive text-white shadow-sm transition-colors z-10 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* File size badge */}
      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-black/60 text-white backdrop-blur-xs">
        {(file.size / 1024).toFixed(0)} KB
      </div>
    </div>
  );
}

export default function AttachmentsSection({
  fileInputRef,
  attachments,
  fileError,
  handleFileChange,
  removeAttachment,
  t,
  grievanceMaxUploadSizeMB = 1,
}) {
  return (
    <FormSection
      title={t(
        "Upload Supporting Documents",
        "सहायक दस्तावेज़ अपलोड करें",
      )}
    >
      <p className="text-xs text-muted-foreground mb-3">
        {t(
          `Allowed file types: Images, Videos, Audio. Max size: ${grievanceMaxUploadSizeMB}MB per file.`,
          `स्वीकृत फ़ाइल प्रकार: चित्र, वीडियो, ऑडियो। अधिकतम आकार: प्रति फ़ाइल ${grievanceMaxUploadSizeMB}MB।`,
        )}
      </p>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        accept="image/jpeg,image/png,image/webp,video/mp4,audio/mpeg"
        onChange={handleFileChange}
      />

      {attachments.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="block w-full border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/60 hover:bg-accent/20 transition-all cursor-pointer"
        >
          <Camera className="w-9 h-9 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">
            {t(
              "Click to upload photos, videos, or documents",
              "फ़ोटो, वीडियो या दस्तावेज़ अपलोड करने के लिए क्लिक करें",
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t(
              `Max ${grievanceMaxUploadSizeMB} MB per file`,
              `प्रति फ़ाइल अधिकतम ${grievanceMaxUploadSizeMB} MB`,
            )}
          </p>
        </button>
      ) : (
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {attachments.map((file, idx) => (
              <ThumbnailItem
                key={`${file.name}-${file.lastModified}-${idx}`}
                file={file}
                onRemove={() => removeAttachment(idx)}
                t={t}
              />
            ))}

            {/* Add more button as a matching square card */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center text-muted-foreground hover:text-primary cursor-pointer gap-1"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs font-medium">
                {t("Add more", "और जोड़ें")}
              </span>
            </button>
          </div>
        </div>
      )}

      {fileError && (
        <p className="text-destructive text-xs mt-2 font-medium">{fileError}</p>
      )}
    </FormSection>
  );
}
