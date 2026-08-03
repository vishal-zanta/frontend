import React from "react";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import OfficerRankingCards from "./OfficerRankingCards";
import { useLanguage } from "@/context/LanguageContext";

export default function OfficerRankingTable({ reportRows = [] }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return <OfficerRankingCards reportRows={reportRows} />;
  }

  const tableHeaders = [
    { id: "rank", label: t("Rank", "रैंक") },
    { id: "name", label: t("Officer", "अधिकारी") },
    { id: "district", label: t("District", "जिला") },
    { id: "resolved", label: t("Resolved", "निराकृत"), className: "text-right" },
    { id: "slaCompliance", label: t("SLA %", "SLA %"), className: "text-right" },
  ];

  const tableBody = reportRows.map((row, i) => ({
    rank: {
      value: row.rank ?? i + 1,
      className: "font-medium text-amber-600 dark:text-amber-400 font-bold",
    },
    name: {
      value: row.name || "N/A",
      className: "font-medium",
    },
    district: {
      value: row.district || "N/A",
      className: "text-muted-foreground",
    },
    resolved: {
      value: row.resolved != null ? row.resolved.toLocaleString("en-IN") : "N/A",
      className: "text-right text-emerald-600 dark:text-emerald-400 font-semibold",
    },
    slaCompliance: {
      value: row.slaCompliance != null ? `${row.slaCompliance}%` : "N/A",
      className: "text-right text-primary font-semibold",
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
