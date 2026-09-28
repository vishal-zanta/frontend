import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Image as ImageIcon } from "lucide-react";
import { IMG_BASE_URL } from "@/utils/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function AttachmentPreviewDialog({
  isOpen,
  onClose,
  attachmentUrl,
  fromName,
  toName,
}) {
  const { t } = useLanguage();

  if (!attachmentUrl) return null;

  const fullUrl = attachmentUrl.startsWith("http")
    ? attachmentUrl
    : `${IMG_BASE_URL || ""}${attachmentUrl.startsWith("/") ? "" : "/"}${attachmentUrl}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-6 bg-card border-border">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 ">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>{t("Attachment Preview", "अनुलग्नक पूर्वावलोकन")}</span>
          </DialogTitle>
        
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-2 bg-muted/20 rounded-xl border border-border/50 min-h-[260px] max-h-[65vh] overflow-hidden">
          <img
            src={fullUrl}
            alt="Attachment-Preview"
            className="max-h-[58vh] w-auto max-w-full object-contain rounded-lg shadow-xs"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "";
            }}
          />
        </div>

        <div className="flex items-center justify-between pt-2 ">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            {t("Close", "बंद करें")}
          </Button>

          <div className="flex items-center gap-2">
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t("Open in New Tab", "नए टैब में खोलें")}</span>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
