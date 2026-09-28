import React, { useState } from "react";
import MyTable from "@/components/MyTable";
import Pagination from "@/components/Pagination";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Image as ImageIcon, Clock, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import moment from "moment";
import AttachmentPreviewDialog from "./AttachmentPreviewDialog";

export default function ChatHistoryTable({
  docs = [],
  pagination,
  page,
  setPage,
  limit,
  setLimit,
  limitOptions,
  isLoading,
  error,
}) {
  const { t } = useLanguage();
  const [previewAttachment, setPreviewAttachment] = useState(null);

  const tableHeaders = [
    {
      id: "from",
      label: t("From", "प्रेषक"),
      className: "w-[25%]",
    },
    {
      id: "to",
      label: t("To", "प्राप्तकर्ता"),
      className: "w-[25%]",
    },
    {
      id: "message",
      label: t("Message / Content", "संदेश / सामग्री"),
      className: "w-[32%]",
    },
    {
      id: "time",
      label: t("Time", "समय"),
      className: "w-[18%] text-right",
    },
  ];

  const tableBody = docs.map((item) => {
    const isImage = item?.type === "IMAGE";
    const fromName = item?.from?.name || "N/A";
    const toName = item?.to?.name || "N/A";
    const timeValue = item?.time || item?.createdAt;

    const formattedTime = timeValue
      ? moment(timeValue).format("DD MMM YYYY, hh:mm A")
      : "N/A";

    return {
      from: {
        className: "font-medium",
        value: (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-foreground block truncate">
                {fromName}
              </span>
              {item?.from?.email && (
                <span className="text-[11px] text-muted-foreground block truncate">
                  {item.from.email}
                </span>
              )}
            </div>
          </div>
        ),
      },
      to: {
        className: "font-medium",
        value: (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-foreground block truncate">
                {toName}
              </span>
              {item?.to?.email && (
                <span className="text-[11px] text-muted-foreground block truncate">
                  {item.to.email}
                </span>
              )}
            </div>
          </div>
        ),
      },
      message: {
        value: isImage ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setPreviewAttachment({
                url: item.message,
                from: fromName,
                to: toName,
              })
            }
            className="h-8 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/10 hover:border-primary font-medium"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{t("View Attachment", "अनुलग्नक देखें")}</span>
          </Button>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate max-w-[280px] sm:max-w-md block cursor-pointer text-foreground hover:text-primary transition-colors">
                  {item.message || "—"}
                </span>
              </TooltipTrigger>
              {item.message && (
                <TooltipContent className="max-w-md break-words p-2.5">
                  <p className="text-xs leading-relaxed">{item.message}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ),
      },
      time: {
        className: "text-right text-xs text-muted-foreground",
        value: (
          <span className="flex items-center justify-end gap-1">
            <Clock className="w-3 h-3 opacity-60 shrink-0" />
            <span>{formattedTime}</span>
          </span>
        ),
      },
    };
  });

  return (
    <>
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        <LoaderErrWrapper isLoading={isLoading} error={error}>
          <MyTable
            tableHeaders={tableHeaders}
            tableBody={tableBody}
            emptyText={t("No chat records found", "कोई चैट रिकॉर्ड नहीं मिला")}
            pagination={
              <Pagination
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                totalPage={pagination?.totalPages || 1}
                limitOptions={limitOptions}
                isLoading={isLoading}
              />
            }
          />
        </LoaderErrWrapper>
      </div>

      <AttachmentPreviewDialog
        isOpen={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        attachmentUrl={previewAttachment?.url}
        fromName={previewAttachment?.from}
        toName={previewAttachment?.to}
      />
    </>
  );
}
