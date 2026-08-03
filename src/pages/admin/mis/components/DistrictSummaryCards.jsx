import React from "react";
import { FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function DistrictSummaryCards({ reportRows = [] }) {
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
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="font-semibold text-sm text-foreground truncate">
                {row.district || "N/A"}
              </div>
            </div>
          </div>

          <div className="p-3 xs:p-3.5">
            <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("Total", "कुल")}
                </span>
                <span className="font-semibold text-foreground text-xs block">
                  {row.total != null ? row.total.toLocaleString("en-IN") : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("Resolved", "निराकृत")}
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs block">
                  {row.resolved != null ? row.resolved.toLocaleString("en-IN") : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("Pending", "लंबित")}
                </span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 text-xs block">
                  {row.pending != null ? row.pending.toLocaleString("en-IN") : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("Escalated", "बढ़ाई गई")}
                </span>
                <span className="font-semibold text-red-600 dark:text-red-400 text-xs block">
                  {row.escalated != null ? row.escalated.toLocaleString("en-IN") : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
