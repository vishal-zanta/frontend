import React from "react";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import UlbPerformanceCards from "./UlbPerformanceCards";
import { useLanguage } from "@/context/LanguageContext";

export default function UlbPerformanceTable({ reportRows = [] }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return <UlbPerformanceCards reportRows={reportRows} />;
  }

  const tableHeaders = [
    { id: "ulb", label: t("ULB", "ULB") },
    { id: "complaints", label: t("Complaints", "शिकायतें"), className: "text-right" },
    { id: "slaCompliance", label: t("SLA %", "SLA %"), className: "text-right" },
    { id: "rating", label: t("Rating", "रेटिंग"), className: "text-right" },
  ];

  const tableBody = reportRows.map((row) => ({
    ulb: {
      value: row.ulb || "N/A",
      className: "font-medium",
    },
    complaints: {
      value: row.complaints != null ? row.complaints.toLocaleString("en-IN") : "N/A",
      className: "text-right font-medium",
    },
    slaCompliance: {
      value: row.slaCompliance != null ? `${row.slaCompliance}%` : "N/A",
      className: "text-right text-emerald-600 dark:text-emerald-400 font-semibold",
    },
    rating: {
      value: row.rating != null ? `★ ${row.rating}/5` : "N/A",
      className: "text-right text-amber-600 dark:text-amber-400 font-semibold",
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
