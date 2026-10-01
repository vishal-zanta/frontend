import React from "react";
import ExportButton from "@/components/ExportButton";
import { useLanguage } from "@/context/LanguageContext";

export default function CallHistoryBulkBar({
  selectedCount = 0,
  exportData = [],
  exportColumns = [],
}) {
  const { t } = useLanguage();

  return (
    <div className="bg-muted/50 rounded-xl border border-border p-3 xs:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div className="text-sm text-muted-foreground">
        {selectedCount > 0
          ? `${selectedCount} ${t("call(s) selected", "कॉल चयनित")}`
          : t(
              "Click checkboxes to select calls for bulk actions",
              "थोक कार्यों के लिए कॉल चुनने के लिए चेकबॉक्स पर क्लिक करें"
            )}
      </div>
      <div className="flex gap-2">
        <ExportButton
          data={exportData}
          columns={exportColumns}
          filename={
            selectedCount > 0
              ? "call_history_selected"
              : "call_history_all"
          }
          label={t("Export", "निर्यात")}
        />
      </div>
    </div>
  );
}
