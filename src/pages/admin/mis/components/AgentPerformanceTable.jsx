import React from "react";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import AgentPerformanceCards from "./AgentPerformanceCards";
import { useLanguage } from "@/context/LanguageContext";

export default function AgentPerformanceTable({ reportRows = [] }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return <AgentPerformanceCards reportRows={reportRows} />;
  }

  const tableHeaders = [
    { id: "agent", label: t("Agent", "एजेंट") },
    { id: "calls", label: t("Calls", "कॉल"), className: "text-right" },
    { id: "resolved", label: t("Resolved", "निराकृत"), className: "text-right" },
    { id: "csat", label: t("CSAT", "CSAT"), className: "text-right" },
    { id: "slaCompliance", label: t("SLA %", "SLA %"), className: "text-right" },
  ];

  const tableBody = reportRows.map((row) => ({
    agent: {
      value: row.agent || "N/A",
      className: "font-medium",
    },
    calls: {
      value: row.calls != null ? row.calls.toLocaleString("en-IN") : "N/A",
      className: "text-right font-medium",
    },
    resolved: {
      value: row.resolved != null ? row.resolved.toLocaleString("en-IN") : "N/A",
      className: "text-right text-emerald-600 dark:text-emerald-400 font-semibold",
    },
    csat: {
      value: row.csat != null ? `★ ${row.csat}/5` : "N/A",
      className: "text-right text-amber-600 dark:text-amber-400 font-semibold",
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
