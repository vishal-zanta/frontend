import React from "react";
import { IMG_BASE_URL } from "@/utils/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function ComplaintEvidenceSection({
  description,
  attachments,
  geotaggedImages,
  subjectText,
}) {
  const { t } = useLanguage();
  return (
    <>
      {/* Description */}
      <div className="bg-[#F4F7FA] rounded-lg p-2.5 lg:p-3 bg-white">
        <div className="text-[10px] lg:text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">
          {t("Description / Details", "विवरण / विवरण")}
        </div>
        <p className="text-xs lg:text-sm leading-relaxed text-foreground whitespace-pre-wrap">
          {description}
        </p>
      </div>
      <div className="bg-[#F4F7FA] rounded-lg p-2.5 lg:p-3 bg-white">
        <div className="text-[10px] lg:text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">
          {t("Subject", "विषय")}
        </div>
        <p className="text-xs lg:text-sm leading-relaxed text-foreground whitespace-pre-wrap">
          {subjectText}
        </p>
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] lg:text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">
            {t("Evidence Attachments", "साक्ष्य संलग्नक")} ({attachments.length}
            )
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {attachments.map((att, idx) => {
              const isImage =
                att.type === "IMAGE" ||
                att.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
              return (
                <div
                  key={idx}
                  className="border border-border rounded-lg p-2 bg-card overflow-hidden bg-white"
                >
                  {isImage ? (
                    <a
                      href={IMG_BASE_URL + att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={IMG_BASE_URL + att.url}
                        alt={att.fileName || "Attachment"}
                        className=" max-h-48 max-w-48 mx-auto w-full h-full object-contain rounded hover:scale-105 transition-transform"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-24 bg-[#F4F7FA] rounded flex items-center justify-center flex-col p-1 text-center">
                      <span className="text-[10px] text-muted-foreground font-mono truncate w-full">
                        {att.fileName}
                      </span>
                      <a
                        href={IMG_BASE_URL + att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 font-semibold"
                      >
                        {t("Download", "डाउनलोड करें")}
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Geotagged Images */}
      {geotaggedImages.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] lg:text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">
            {t("Geo-Tagged Field Photos", "जियो-टैग की गई फील्ड तस्वीरें")} (
            {geotaggedImages.length})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {geotaggedImages.map((img, idx) => {
              const url =
                typeof img === "string" ? img : img?.url || img?.path || "";
              const displayUrl = url.startsWith("http")
                ? url
                : IMG_BASE_URL + url;
              const fileName =
                typeof img === "object"
                  ? img?.fileName || img?.name || `Field Photo ${idx + 1}`
                  : url.split("/").pop() || `Field Photo ${idx + 1}`;
              const isImage =
                (typeof img === "object" && img?.type === "IMAGE") ||
                !!url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

              return (
                <div
                  key={idx}
                  className="border border-border rounded-lg p-2 bg-card overflow-hidden bg-white"
                >
                  {isImage ? (
                    <a
                      href={displayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={displayUrl}
                        alt={fileName}
                        className="max-h-48 max-w-48 mx-auto w-full h-full object-contain  rounded hover:scale-105 transition-transform"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-24 bg-[#F4F7FA] rounded flex items-center justify-center flex-col p-1 text-center">
                      <span className="text-[10px] text-muted-foreground font-mono truncate w-full">
                        {fileName}
                      </span>
                      <a
                        href={displayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 font-semibold"
                      >
                        {t("Download", "डाउनलोड करें")}
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
