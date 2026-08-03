import React from "react";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import ServicePerformanceCards from "./ServicePerformanceCards";
import { useLanguage } from "@/context/LanguageContext";

export default function ServicePerformanceTable({ reportRows = [] }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return <ServicePerformanceCards reportRows={reportRows} />;
  }

  const tableHeaders = [
    { id: "service", label: t("Service", "सेवा") },
    { id: "withinSLA", label: t("Within SLA", "SLA के भीतर"), className: "text-right" },
    { id: "beyondSLA", label: t("Beyond SLA", "SLA से बाहर"), className: "text-right" },
    { id: "compliance", label: t("Compliance %", "अनुपालन %"), className: "text-right" },
  ];

  const tableBody = reportRows.map((row) => ({
    service: {
      value: row.service || "N/A",
      className: "font-medium",
    },
    withinSLA: {
      value: row.withinSLA != null ? row.withinSLA.toLocaleString("en-IN") : "N/A",
      className: "text-right text-emerald-600 dark:text-emerald-400 font-semibold",
    },
    beyondSLA: {
      value: row.beyondSLA != null ? row.beyondSLA.toLocaleString("en-IN") : "N/A",
      className: "text-right text-red-600 dark:text-red-400 font-semibold",
    },
    compliance: {
      value: row.compliance != null ? `${row.compliance}%` : "N/A",
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
