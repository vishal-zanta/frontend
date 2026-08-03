import React from "react";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function MisReportCards({
  selectedReport,
  reportRows = [],
  reportColumns = [],
  formatCell,
}) {
  const { t } = useLanguage();

  if (!reportRows || reportRows.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t(
          "No data found for selected filters",
          "चयनित फ़िल्टर के लिए कोई डेटा नहीं मिला"
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {reportRows.map((row, i) => (
        <Card
          key={i}
          row={row}
          selectedReport={selectedReport}
          reportColumns={reportColumns}
          formatCell={formatCell}
          t={t}
        />
      ))}
    </div>
  );
}

function Card({ row, selectedReport, reportColumns, formatCell, t }) {
  // Find primary title column (e.g. name, district, service, block, ulb, agent, label)
  const titleCol = reportColumns.find((c) =>
    ["name", "district", "service", "block", "ulb", "agent", "label"].includes(
      c.key
    )
  );

  const titleVal = titleCol ? formatCell(selectedReport, titleCol.key, row) : null;
  const cardTitle = titleVal && titleVal !== "-" ? titleVal : "Report Item";

  // Filter remaining detail columns
  const detailCols = reportColumns.filter((c) => c.key !== titleCol?.key);

  return (
    <div className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Header */}
      <div className="p-3 xs:p-3.5 sm:p-4 border-b border-border/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-foreground truncate">
              {cardTitle}
            </div>
          </div>
        </div>
      </div>

      {/* Body Grid */}
      <div className="p-3 xs:p-3.5 sm:p-4">
        <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
          {detailCols.map((col) => {
            const rawVal = formatCell(selectedReport, col.key, row);
            const formattedVal = rawVal === "-" ? "N/A" : rawVal;

            let textColor = "text-foreground";
            if (col.key === "resolved" || col.key === "withinSLA") {
              textColor = "text-emerald-600 dark:text-emerald-400 font-semibold";
            } else if (col.key === "pending") {
              textColor = "text-amber-600 dark:text-amber-400 font-semibold";
            } else if (col.key === "escalated" || col.key === "beyondSLA") {
              textColor = "text-red-600 dark:text-red-400 font-semibold";
            }

            return (
              <div key={col.key}>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {col.label}
                </span>
                <span className={`text-xs block truncate ${textColor}`}>
                  {formattedVal}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
