import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FilePlus2,
} from "lucide-react";
import MyTable from "@/components/MyTable";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import moment from "moment";
import { Link } from "react-router-dom";

export default function InmailTable({
  inmails = [],
  onPreview,
  onRaiseComplaint,
  onOpenReject,
  onOpenClose,
  pagination,
}) {
  const { t } = useLanguage();

  const tableHeaders = [
    {
      id: "emailId",
      label: t("Ref ID", "संदर्भ आईडी"),
      isSortable: true,
      className: "w-28 font-medium",
    },
    {
      id: "from",
      label: t("From", "प्रेषक"),
      className: "min-w-[180px]",
    },
    {
      id: "subject",
      label: t("Subject & Content", "विषय एवं सामग्री"),
      className: "min-w-[280px]",
    },
    {
      id: "date",
      label: t("Received", "प्राप्त"),
      isSortable: true,
      className: "w-32",
    },
    {
      id: "status",
      label: t("Status", "स्थिति"),
      className: "w-36 text-center",
    },
    {
      id: "actions",
      label: t("Actions", "कार्रवाई"),
      className: "w-52 text-center",
    },
  ];

  const tableBody = inmails.map((m) => ({
    emailId: {
      render: () => (
        <button
          onClick={() => onPreview(m)}
          className="font-mono text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          {m.emailId}
        </button>
      ),
    },
    from: {
      render: () => (
        <div className="space-y-0.5">
          <p className="font-semibold text-foreground text-xs leading-tight">
            {m.fromName}
          </p>
          <p
            className="text-[11px] text-muted-foreground truncate max-w-[200px]"
            title={m.fromEmail}
          >
            {m.fromEmail}
          </p>
        </div>
      ),
    },
    subject: {
      render: () => (
        <div
          onClick={() => onPreview(m)}
          className="cursor-pointer group max-w-md"
        >
          <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {m.subject}
          </p>
          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
            {m.body}
          </p>
        </div>
      ),
    },
    date: {
      render: () => (
        <div className="text-xs text-nowrap whitespace-nowrap">
          <p className="font-medium text-foreground text-[11px]">
            {moment(m.receivedAt).format("DD MMM, hh:mm A")}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {moment(m.receivedAt).fromNow()}
          </p>
        </div>
      ),
    },
    status: {
      className: "text-center",
      render: () => {
        if (m.status === "CONVERTED") {
          return (
            <div className="inline-flex flex-col items-center">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                {t("Converted", "शिकायत दर्ज")}
              </span>
              {m.grievance && (
                <Link to={`/crm/track-complaint?complaint=${m.grievance?.grievanceId}`}>
                <span className="text-[10px] font-mono text-primary hover:text-primary/70 hover:underline cursor-pointer transition-colors font-semibold mt-0.5">
                  {typeof m.grievance === "object" ? m.grievance?.grievanceId : m.grievance }
                </span>
                </Link>
              )}
            </div>
          );
        }
        if (m.status === "REJECTED") {
          return (
            <div className="inline-flex flex-col items-center">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                <XCircle className="w-3 h-3" />
                {t("Rejected", "अस्वीकृत")}
              </span>
            </div>
          );
        }
        if (m.status === "CLOSED") {
          return (
            <div className="inline-flex flex-col items-center">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                <CheckCircle2 className="w-3 h-3" />
                {t("Closed", "बंद")}
              </span>
            </div>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" />
            {t("Pending", "लंबित")}
          </span>
        );
      },
    },
    actions: {
      className: "text-right",
      render: () => (
        <div className="flex items-center justify-end gap-1">
          {m.status === "PENDING" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px] bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700 border-emerald-500/30 cursor-pointer font-medium rounded-md"
                onClick={() => onRaiseComplaint(m)}
              >
                <FilePlus2 className="w-3 h-3 mr-1" />
                {t("Raise", "दर्ज करें")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px] bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 border-red-500/30 cursor-pointer font-medium rounded-md"
                onClick={() => onOpenReject(m)}
              >
                <XCircle className="w-3 h-3 mr-1" />
                {t("Reject", "अस्वीकार")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px] bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-200 border-slate-500/30 cursor-pointer font-medium rounded-md"
                onClick={() => onOpenClose(m)}
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {t("Close", "बंद")}
              </Button>
            </>
          )}

          {m.status === "CONVERTED" && (
            <span className="text-[11px] text-emerald-600 font-medium px-1">
              ✓ {t("Created", "दर्ज")}
            </span>
          )}

          {m.status === "REJECTED" && (
            <span className="text-[11px] text-destructive font-medium px-1">
              ✕ {t("Rejected", "अस्वीकृत")}
            </span>
          )}

          {m.status === "CLOSED" && (
            <span className="text-[11px] text-muted-foreground font-medium px-1">
              ✓ {t("Closed", "बंद")}
            </span>
          )}
        </div>
      ),
    },
  }));

  return (
    <MyTable
      tableHeaders={tableHeaders}
      tableBody={tableBody}
      emptyText={t(
        "No inmails found matching criteria.",
        "कोई इनमेल नहीं मिला।",
      )}
      pagination={pagination}
    />
  );
}
