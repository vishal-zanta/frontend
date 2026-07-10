import React from "react";
import { IMG_BASE_URL } from "@/utils/constants";

export default function ComplaintEvidenceSection({ description, attachments, geotaggedImages }) {
  return (
    <>
      {/* Description */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="text-xs text-muted-foreground mb-1 font-semibold">Description / Details</div>
        <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{description}</p>
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-muted-foreground mb-2 font-semibold">Evidence Attachments ({attachments.length})</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {attachments.map((att, idx) => {
              const isImage = att.type === "IMAGE" || att.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
              return (
                <div key={idx} className="border border-border rounded-lg p-2 bg-card overflow-hidden">
                  {isImage ? (
                    <a href={IMG_BASE_URL + att.url} target="_blank" rel="noopener noreferrer">
                      <img src={IMG_BASE_URL + att.url} alt={att.fileName || "Attachment"} className="w-full h-24 object-cover rounded hover:scale-105 transition-transform" />
                    </a>
                  ) : (
                    <div className="w-full h-24 bg-muted/50 rounded flex items-center justify-center flex-col p-1 text-center">
                      <span className="text-[10px] text-muted-foreground font-mono truncate w-full">{att.fileName}</span>
                      <a href={IMG_BASE_URL + att.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 font-semibold">
                        Download
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
          <div className="text-xs text-muted-foreground mb-2 font-semibold">Geo-Tagged Field Photos ({geotaggedImages.length})</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {geotaggedImages.map((img, idx) => (
              <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="border border-border rounded-lg p-2 bg-card overflow-hidden">
                <img src={img} alt={`Field Photo ${idx + 1}`} className="w-full h-24 object-cover rounded hover:scale-105 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
