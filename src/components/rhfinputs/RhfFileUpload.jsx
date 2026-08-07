import React, { useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Upload, X, ExternalLink, FileText, Image as ImageIcon, Paperclip } from "lucide-react";
import { getErrorToast } from "@/utils/helpers";

export default function RhfFileUpload({
  name,
  label,
  required = false,
  disabled = false,
  multiple = false,
  accept = "image/*,application/pdf",
  MAX_SIZE = 10, // Max size in MB
  className,
  labelClassName,
  inputClassName,
  placeholder = "Choose File",
  ...props
}) {
  const { control } = useFormContext();
  const fileInputRef = useRef(null);
  const [localError, setLocalError] = useState("");

  const maxBytes = MAX_SIZE * 1024 * 1024;

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return [val];
  };

  const getFileNameStr = (file) => {
    if (typeof file === "string") return file;
    if (file && typeof file === "object") {
      if (typeof file.name === "string") return file.name;
      if (typeof file.url === "string") return file.url;
    }
    return "";
  };

  const getFileIcon = (file) => {
    const type = file?.type || "";
    const fileName = getFileNameStr(file).toLowerCase();
    if (type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fileName)) {
      return <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />;
    }
    if (type === "application/pdf" || fileName.endsWith(".pdf")) {
      return <FileText className="w-4 h-4 text-red-500 shrink-0" />;
    }
    return <Paperclip className="w-4 h-4 text-gray-500 shrink-0" />;
  };

  const openFileInNewTab = (file) => {
    if (!file) return;
    try {
      if (file instanceof File || file instanceof Blob) {
        const objectUrl = URL.createObjectURL(file);
        window.open(objectUrl, "_blank");
      } else if (typeof file === "string") {
        window.open(file, "_blank");
      } else if (file?.url) {
        window.open(file.url, "_blank");
      }
    } catch (err) {
      console.error("Error opening file:", err);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const fileList = getFileList(field.value);

        const handleFileChange = (e) => {
          setLocalError("");
          const selectedFiles = Array.from(e.target.files || []);
          if (selectedFiles.length === 0) return;

          // Size check
          const oversized = selectedFiles.find((f) => f.size > maxBytes);
          if (oversized) {
            const msg = `File "${oversized.name}" exceeds maximum allowed size of ${MAX_SIZE}MB.`;
            setLocalError(msg);
            getErrorToast?.({ message: msg });
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }

          if (multiple) {
            const updated = [...fileList, ...selectedFiles];
            field.onChange(updated);
          } else {
            field.onChange(selectedFiles[0] || null);
          }

          if (fileInputRef.current) fileInputRef.current.value = "";
        };

        const handleRemoveFile = (indexToRemove) => {
          setLocalError("");
          if (multiple) {
            const updated = fileList.filter((_, idx) => idx !== indexToRemove);
            field.onChange(updated.length > 0 ? updated : null);
          } else {
            field.onChange(null);
          }
        };

        const displayError = error?.message || localError;

        return (
          <div className={cn("flex flex-col gap-1.5", className)}>
            {label && (
              <Label
                htmlFor={name}
                className={cn(
                  "font-normal text-sm md:text-sm text-foreground mb-0.5 w-fit",
                  labelClassName
                )}
              >
                {label}
                {required && <span className="text-destructive"> *</span>}
              </Label>
            )}

            {/* Hidden Native Input */}
            <input
              type="file"
              id={name}
              ref={fileInputRef}
              accept={accept}
              disabled={disabled}
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
              {...props}
            />

            {/* Custom Input Button & Status Box */}
            <div
              onClick={() => {
                if (!disabled) fileInputRef.current?.click();
              }}
              className={cn(
                "group flex items-center justify-between border border-input rounded-md px-3 py-2 bg-card cursor-pointer hover:bg-muted/60 hover:border-primary/50 transition-all duration-200",
                disabled && "opacity-50 cursor-not-allowed",
                displayError && "border-destructive focus-visible:ring-destructive",
                inputClassName
              )}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
                <Upload className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium text-foreground">
                  {placeholder}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  (Max {MAX_SIZE}MB)
                </span>
              </div>
              <span className="text-xs bg-muted px-3 py-1 rounded-md text-muted-foreground font-medium shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                Browse
              </span>
            </div>

            {/* Error Message */}
            {displayError && (
              <p className="text-xs text-destructive mt-0.5">{displayError}</p>
            )}

            {/* Uploaded Files List */}
            {fileList.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {fileList.map((file, idx) => {
                  const fileName =
                    file?.name ||
                    (typeof file === "string" ? file.split("/").pop() : file?.url?.split("/").pop()) ||
                    `File ${idx + 1}`;
                  const fileSize = file?.size ? formatFileSize(file.size) : "";

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 bg-muted/50 border border-border rounded-lg text-xs transition-colors hover:bg-muted"
                    >
                      <button
                        type="button"
                        onClick={() => openFileInNewTab(file)}
                        title="Click to view file in new tab"
                        className="flex items-center gap-2 flex-1 min-w-0 text-left hover:underline focus:outline-none"
                      >
                        {getFileIcon(file)}
                        <span className="font-medium text-foreground truncate">
                          {fileName}
                        </span>
                        {fileSize && (
                          <span className="text-[11px] text-muted-foreground shrink-0">
                            ({fileSize})
                          </span>
                        )}
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-60 hover:opacity-100 shrink-0 ml-1" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(idx);
                        }}
                        disabled={disabled}
                        title="Remove file"
                        className="p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}

// Export alias RhfFileInput for flexibility
export const RhfFileInput = RhfFileUpload;
