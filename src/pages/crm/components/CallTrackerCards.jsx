import React from "react";
import { Badge } from "@/components/ui/badge";
import { CallId, ComplaintId } from "@/components/ComplaintDetailDialog";
import { useLanguage } from "@/context/LanguageContext";

export default function CallTrackerCards({ calls = [] }) {
  const { t } = useLanguage();

  if (!calls || calls.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No calls match your filters.", "आपके फ़िल्टर से कोई कॉल मेल नहीं खाती।")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {calls.map((c, i) => (
        <div
          key={c.id || i}
          className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden"
        >
          {/* Header */}
          <div className="p-3 xs:p-3.5 border-b border-border/60 flex items-center justify-between gap-2">
            <CallId id={c.id} />
            <Badge
              variant="outline"
              className={`text-xs shrink-0 ${
                c.status === "Resolved"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : c.status === "Missed"
                    ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                    : c.status === "Escalated"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      : "bg-muted/50 text-muted-foreground border-border"
              }`}
            >
              {c.status === "Resolved"
                ? t("Resolved", "हल की गई")
                : c.status === "Missed"
                  ? t("Missed", "छूटी हुई")
                  : c.status === "Escalated"
                    ? t("Escalated", "बढ़ाया गया")
                    : c.status || "N/A"}
            </Badge>
          </div>

          {/* Body */}
          <div className="p-3 xs:p-3.5 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("Agent", "एजेंट")}
                </span>
                <span className="font-medium text-foreground text-xs block truncate mt-0.5">
                  {c.agent || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("Duration", "अवधि")}
                </span>
                <span className="font-medium text-foreground text-xs block truncate mt-0.5">
                  {c.duration || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("Complaint ID", "शिकायत आईडी")}
                </span>
                {c.complaintId ? (
                  <ComplaintId id={c.complaintId} />
                ) : (
                  <span className="text-muted-foreground text-xs font-medium">N/A</span>
                )}
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("Disposition", "निपटान")}
                </span>
                <span className="font-medium text-foreground text-xs block truncate mt-0.5">
                  {c.disposition || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-between text-xs">
            <span className="text-muted-foreground text-[11px]">
              {t("Time", "समय")}: {c.time || "N/A"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
