import React from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Eye, PhoneCall, Loader2, Phone, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import moment from "moment";
import clsx from "clsx";

export default function CrmCallCards({
  calls = [],
  selected = [],
  toggleSelect,
  onOpenEvidenceDialog,
  onViewCall,
  onCallCitizen,
  callingId,
  isCallingPending,
  canCallCitizen = false,
}) {
  const { t } = useLanguage();

  if (!calls || calls.length === 0) {
    return (
      <div className="p-8 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No calls match your filters.", "आपके फ़िल्टर से कोई कॉल मेल नहीं खाती।")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {calls.map((c, i) => {
        const id = c.callId || c._id || `CALL-${i + 1}`;
        const isSelected = selected.includes(id);
        const isOutbound = c.callType === "Outbound";
        const complaintCode =
          c.complaintIdString ||
          c.complaintId?.grievanceId ||
          (typeof c.complaintId === "string" ? c.complaintId : null);
        const agentName =
          c.agent?.name || (typeof c.agent === "string" ? c.agent : "—");
        const formattedDate = c.createdAt
          ? moment(c.createdAt).isValid()
            ? moment(c.createdAt).format("DD MMM YYYY, hh:mm A")
            : c.createdAt
          : "—";

        const hasMobile =
          c.citizenMobile && c.citizenMobile !== "N/A" && c.citizenMobile !== "-";
        const isThisCalling = isCallingPending && callingId === id;

        return (
          <div
            key={c._id || c.callId || i}
            className={`rounded-xl border transition-all overflow-hidden bg-card shadow-xs hover:shadow-md ${
              isSelected
                ? "border-purple-500/60 ring-1 ring-purple-500/40"
                : "border-border"
            }`}
          >
            {/* Header */}
            <div className="p-3 xs:p-3.5 border-b border-border/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(id)}
                  className="rounded cursor-pointer shrink-0"
                />
                <button
                  type="button"
                  onClick={() => onViewCall?.(c)}
                  className="font-mono text-xs font-bold text-primary hover:underline cursor-pointer truncate"
                >
                  {id}
                </button>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Badge
                  variant="outline"
                  className={clsx(
                    "text-[10px] px-1.5 py-0",
                    isOutbound
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                      : "bg-primary/10 text-primary border-primary/20"
                  )}
                >
                  {isOutbound
                    ? t("Outbound", "आउटबाउंड")
                    : t("Inbound", "इनबाउंड")}
                </Badge>
                <Badge
                  variant="outline"
                  className={clsx(
                    "text-[10px] px-1.5 py-0",
                    c.status === "Resolved" || c.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : c.status === "Missed" || c.status === "Failed"
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  )}
                >
                  {c.status || t("Initiated", "आरंभ")}
                </Badge>
              </div>
            </div>

            {/* Body */}
            <div className="p-3 xs:p-3.5 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-medium flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5" />
                    {t("Citizen Mobile", "नागरिक मोबाइल")}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {canCallCitizen && hasMobile && (
                      <button
                        type="button"
                        disabled={isCallingPending}
                        onClick={(e) => onCallCitizen?.(e, c)}
                        className="p-0.5 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
                        title={t("Call Citizen", "नागरिक को कॉल करें")}
                      >
                        {isThisCalling ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <PhoneCall className="w-3 h-3" />
                        )}
                      </button>
                    )}
                    <span className="font-mono text-xs text-foreground block truncate">
                      {c.citizenMobile || "—"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-medium flex items-center gap-1">
                    <User className="w-2.5 h-2.5" />
                    {t("Agent", "एजेंट")}
                  </span>
                  <span className="font-medium text-foreground text-xs block truncate mt-0.5">
                    {agentName}
                  </span>
                </div>

                <div className="col-span-2">
                  <span className="text-muted-foreground block text-[10px] uppercase font-medium flex items-center gap-1">
                    <FileText className="w-2.5 h-2.5" />
                    {t("Complaint", "शिकायत")}
                  </span>
                  <span className="font-mono text-xs text-foreground block truncate mt-0.5">
                    {complaintCode || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-between text-xs gap-2">
              <span className="text-muted-foreground text-[11px] truncate">
                {formattedDate}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                {c.evidenceTagged ? (
                  <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t("Tagged", "चिह्नित")}</span>
                  </div>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenEvidenceDialog?.(c)}
                    className="h-7 px-2 text-[11px] text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/10 cursor-pointer flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>{t("Mark as evidence", "साक्ष्य")}</span>
                  </Button>
                )}

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onViewCall?.(c)}
                  className="h-7 px-2.5 text-xs gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t("View", "देखें")}</span>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
