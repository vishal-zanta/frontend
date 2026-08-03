import React from "react";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import DistrictSummaryCards from "./DistrictSummaryCards";
import { useLanguage } from "@/context/LanguageContext";

export default function DistrictSummaryTable({ reportRows = [] }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DistrictSummaryCards reportRows={reportRows} />;
  }

  const tableHeaders = [
    { id: "district", label: t("District", "जिला") },
    { id: "total", label: t("Total", "कुल"), className: "text-right" },
    { id: "resolved", label: t("Resolved", "निराकृत"), className: "text-right" },
    { id: "pending", label: t("Pending", "लंबित"), className: "text-right" },
    { id: "escalated", label: t("Escalated", "बढ़ाई गई"), className: "text-right" },
  ];

  const tableBody = reportRows.map((row) => ({
    district: {
      value: row.district || "N/A",
      className: "font-medium",
    },
    total: {
      value: row.total != null ? row.total.toLocaleString("en-IN") : "N/A",
      className: "text-right font-medium",
    },
    resolved: {
      value: row.resolved != null ? row.resolved.toLocaleString("en-IN") : "N/A",
      className: "text-right text-emerald-600 dark:text-emerald-400 font-semibold",
    },
    pending: {
      value: row.pending != null ? row.pending.toLocaleString("en-IN") : "N/A",
      className: "text-right text-amber-600 dark:text-amber-400 font-semibold",
    },
    escalated: {
      value: row.escalated != null ? row.escalated.toLocaleString("en-IN") : "N/A",
      className: "text-right text-red-600 dark:text-red-400 font-semibold",
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
