import React from "react";
import { Building2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function UlbPerformanceCards({ reportRows = [] }) {
  const { t } = useLanguage();

  if (!reportRows || reportRows.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No data found for selected filters", "चयनित फ़िल्टर के लिए कोई डेटा नहीं मिला")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {reportRows.map((row, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden"
        >
          <div className="p-3 xs:p-3.5 border-b border-border/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="font-semibold text-sm text-foreground truncate">
                {row.ulb || "N/A"}
              </div>
            </div>
          </div>

          <div className="p-3 xs:p-3.5">
            <div className="grid grid-cols-3 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("Complaints", "शिकायतें")}
                </span>
                <span className="font-semibold text-foreground text-xs block">
                  {row.complaints != null ? row.complaints.toLocaleString("en-IN") : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("SLA %", "SLA %")}
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs block">
                  {row.slaCompliance != null ? `${row.slaCompliance}%` : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("Rating", "रेटिंग")}
                </span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 text-xs block">
                  {row.rating != null ? `★ ${row.rating}/5` : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
