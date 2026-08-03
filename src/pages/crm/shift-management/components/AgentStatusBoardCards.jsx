import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AgentStatusBoardCards({
  shiftsData = [],
  isSupervisor = false,
  setEditingAgent,
  formatShift,
}) {
  const { t } = useLanguage();

  if (!shiftsData || shiftsData.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No agent status data found.", "कोई एजेंट स्थिति डेटा नहीं मिला।")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {shiftsData.map((a) => {
        const initials = a.name
          ? a.name
              .split(" ")
              .map((n) => n[0])
              .join("")
          : "?";

        const formattedShiftVal = formatShift(a?.shift);

        return (
          <div
            key={a._id}
            className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 xs:p-3.5 border-b border-border/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold capitalize shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-foreground truncate">
                    {a.name || "N/A"}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {a.role?.level || a.role?.designationEnglish || "N/A"}
                  </div>
                </div>
              </div>

              <Badge
                variant="outline"
                className={`text-xs shrink-0 ${
                  a?.status === "On Call"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    : a?.status === "Available"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : a?.status === "Break"
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                        : "bg-muted/50 text-muted-foreground border-border"
                }`}
              >
                {a?.status === "On Call"
                  ? t("On Call", "कॉल पर")
                  : a?.status === "Available"
                    ? t("Available", "उपलब्ध")
                    : a?.status === "Break"
                      ? t("Break", "ब्रेक")
                      : a?.status || "N/A"}
              </Badge>
            </div>

            {/* Body Grid */}
            <div className="p-3 xs:p-3.5 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
                <div className="col-span-2">
                  <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                    {t("Shift", "शिफ्ट")}
                  </span>
                  <span className="font-medium text-foreground text-xs block truncate mt-0.5">
                    {formattedShiftVal === "-" ? "N/A" : formattedShiftVal}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                    {t("Calls Today", "आज की कॉल")}
                  </span>
                  <span className="font-semibold text-foreground text-xs block mt-0.5">
                    {a?.callsToday != null ? a.callsToday : "N/A"}
                  </span>
                </div>

                {isSupervisor && (
                  <>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                        {t("Resolved", "हल की गई")}
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs block mt-0.5">
                        {a?.resolvedToday != null ? a.resolvedToday : "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                        {t("Avg Talk Time", "औसत बात करने का समय")}
                      </span>
                      <span className="font-medium text-muted-foreground text-xs block mt-0.5">
                        {a?.avgTalkTime && a.avgTalkTime !== "-" ? a.avgTalkTime : "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                        {t("CSAT", "सीएसएटी")}
                      </span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400 text-xs block mt-0.5">
                        {a?.csat && a.csat !== "-" ? `★ ${a.csat}` : "N/A"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            {isSupervisor && (
              <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingAgent(a)}
                  className="h-8 text-xs px-2.5"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  {t("Edit Shift", "शिफ्ट संपादित करें")}
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
