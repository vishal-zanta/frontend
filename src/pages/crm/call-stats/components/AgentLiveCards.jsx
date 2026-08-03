import React from "react";
import { Badge } from "@/components/ui/badge";
import { UserCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function getCellValue(row, key) {
  const cell = row[key];
  if (!cell) return "N/A";
  if (cell.render) {
    return <cell.render />;
  }
  const val = cell.value;
  if (val === undefined || val === null || val === "" || val === "-") {
    return "N/A";
  }
  return val;
}

export default function AgentLiveCards({ headers = [], body = [] }) {
  const { t } = useLanguage();

  if (!body || body.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No agent live statistics available.", "कोई एजेंट लाइव सांख्यिकी उपलब्ध नहीं है।")}
      </div>
    );
  }

  // Filter detail headers (excluding action column 'monitor')
  const detailHeaders = headers.filter((h) => h.id !== "monitor");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {body.map((row, i) => {
        const userName = getCellValue(row, "userName");
        const agentId = getCellValue(row, "agent");
        const statusVal = row.status?.value || "N/A";

        return (
          <div
            key={i}
            className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 xs:p-3.5 border-b border-border/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-foreground truncate">
                    {userName}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {t("Agent ID", "एजेंट आईडी")}: {agentId}
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-xs shrink-0 ${
                  statusVal === "INCALL"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "bg-blue-50 text-primary dark:bg-blue-950/30 dark:text-blue-400"
                }`}
              >
                {statusVal}
              </Badge>
            </div>

            {/* Body displaying ALL keys from tableBody / headers */}
            <div className="p-3 xs:p-3.5 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
                {detailHeaders.map((h) => {
                  const displayVal = getCellValue(row, h.id);
                  const isFullWidth = h.id === "skillGroup";

                  return (
                    <div key={h.id} className={isFullWidth ? "col-span-2" : ""}>
                      <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                        {h.label}
                      </span>
                      <span className="font-medium text-foreground text-xs block truncate mt-0.5">
                        {displayVal}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Monitor Action */}
            {row.monitor?.render && (
              <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-start">
                <row.monitor.render />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
