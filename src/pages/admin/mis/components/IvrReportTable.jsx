import React from "react";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import IvrReportCards from "./IvrReportCards";
import { useLanguage } from "@/context/LanguageContext";

export default function IvrReportTable({ reportRows = [] }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return <IvrReportCards reportRows={reportRows} />;
  }

  const tableHeaders = [
    { id: "label", label: t("Metric", "मीट्रिक") },
    { id: "value", label: t("Value", "मान"), className: "text-right" },
  ];

  const tableBody = reportRows.map((row) => ({
    label: {
      value: row.label || "N/A",
      className: "font-medium",
    },
    value: {
      value: row.value != null ? row.value : "N/A",
      className: "text-right font-semibold text-primary",
    },
  }));

  return (
    <MyTable
      tableHeaders={tableHeaders}
      tableBody={tableBody}
      emptyText={t("No data found for selected filters", "चयनित फ़िल्टर के लिए कोई डेटा नहीं मिला")}
    />
  );
}
