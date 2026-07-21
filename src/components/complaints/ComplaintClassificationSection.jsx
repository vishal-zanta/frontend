import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ComplaintClassificationSection({ departmentText, occurrenceDate }) {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3 text-[10px] lg:text-xs bg-muted/20 p-2.5 lg:p-3 rounded-lg border border-border bg-white">
      <div>
        <span className="text-muted-foreground block font-medium">{t("Department", "विभाग")}</span>
        <span className="font-semibold text-foreground">{departmentText}</span>
      </div>
     
      <div>
        <span className="text-muted-foreground block font-medium">{t("Occurrence Date", "घटना की तिथि")}</span>
        <span className="font-semibold text-foreground">{occurrenceDate}</span>
      </div>
    </div>
  );
}
