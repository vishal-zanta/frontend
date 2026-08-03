import React from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { CallId, ComplaintId } from "@/components/ComplaintDetailDialog";
import { useLanguage } from "@/context/LanguageContext";

export default function CrmCallCards({
  calls = [],
  selected = [],
  toggleSelect,
  setTagDialog,
}) {
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
      {calls.map((c, i) => {
        const isSelected = selected.includes(c.id);

        return (
          <div
            key={c.id || i}
            className={`rounded-xl border transition-all overflow-hidden bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md ${
              isSelected ? "border-purple-500/60 ring-1 ring-purple-500/40" : "border-border"
            }`}
          >
            {/* Header */}
            <div className="p-3 xs:p-3.5 border-b border-border/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(c.id)}
                  className="rounded cursor-pointer shrink-0"
                />
                <CallId id={c.id} />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    c.callType === "Outbound"
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {c.callType === "Outbound"
                    ? t("Outbound", "आउटबाउंड")
                    : t("Inbound", "इनबाउंड")}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    c.status === "Resolved"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : c.status === "Missed"
                        ? "bg-destructive/10 text-destructive"
                        : c.status === "Escalated"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-muted/50 text-muted-foreground"
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
            </div>

            {/* Body */}
            <div className="p-3 xs:p-3.5 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                    {t("Citizen Mobile", "नागरिक मोबाइल")}
                  </span>
                  <span className="font-mono text-xs text-foreground block truncate">
                    {c.citizenMobile || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                    {t("Agent", "एजेंट")}
                  </span>
                  <span className="font-medium text-foreground text-xs block truncate">
                    {c.agent || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                    {t("Duration", "अवधि")}
                  </span>
                  <span className="font-medium text-foreground text-xs block truncate">
                    {c.duration || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                    {t("Complaint", "शिकायत")}
                  </span>
                  {c.complaintId ? (
                    <ComplaintId id={c.complaintId} />
                  ) : (
                    <span className="text-muted-foreground text-xs font-medium">N/A</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-muted-foreground text-[11px]">
                {c.time || "N/A"}
              </span>
              {c.evidenceTagged ? (
                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium text-[11px]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t("Tagged", "चिह्नित")}</span>
                </div>
              ) : (
                <button
                  onClick={() => setTagDialog({ ids: [c.id] })}
                  className="text-xs text-muted-foreground hover:text-primary underline cursor-pointer font-medium"
                >
                  {t("Tag", "चिह्नित")}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
