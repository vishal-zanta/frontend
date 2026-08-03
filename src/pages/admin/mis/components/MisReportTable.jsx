import React from "react";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import MisReportCards from "./MisReportCards";
import { useLanguage } from "@/context/LanguageContext";
import clsx from "clsx";

export default function MisReportTable({
  selectedReport,
  reportRows = [],
  reportColumns = [],
  formatCell,
}) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MisReportCards
        selectedReport={selectedReport}
        reportRows={reportRows}
        reportColumns={reportColumns}
        formatCell={formatCell}
      />
    );
  }

  const tableHeaders = reportColumns.map((col) => ({
    id: col.key,
    label: col.label,
    className: [
      "total",
      "resolved",
      "pending",
      "escalated",
      "withinSLA",
      "beyondSLA",
      "compliance",
      "slaCompliance",
      "complaints",
      "calls",
      "value",
    ].includes(col.key)
      ? "text-right"
      : "",
  }));

  const tableBody = reportRows.map((row) => {
    const rowObj = {};

    reportColumns.forEach((col) => {
      const rawVal = formatCell(selectedReport, col.key, row);
      const formattedVal = rawVal === "-" ? "N/A" : rawVal;

      const isRightAligned = [
        "total",
        "resolved",
        "pending",
        "escalated",
        "withinSLA",
        "beyondSLA",
        "compliance",
        "slaCompliance",
        "complaints",
        "calls",
        "value",
      ].includes(col.key);

      const isBold = [
        "name",
        "agent",
        "district",
        "block",
        "service",
        "ulb",
        "label",
      ].includes(col.key);

      let textColor = "";
      if (col.key === "resolved" || col.key === "withinSLA") {
        textColor = "text-emerald-600 dark:text-emerald-400";
      } else if (col.key === "pending") {
        textColor = "text-amber-600 dark:text-amber-400";
      } else if (col.key === "escalated" || col.key === "beyondSLA") {
        textColor = "text-red-600 dark:text-red-400";
      }

      rowObj[col.key] = {
        value: formattedVal,
        className: clsx(
          isRightAligned && "text-right",
          isBold && "font-medium",
          textColor
        ),
      };
    });

    return rowObj;
  });

  return (
    <MyTable
      tableHeaders={tableHeaders}
      tableBody={tableBody}
      emptyText={t(
        "No data found for selected filters",
        "चयनित फ़िल्टर के लिए कोई डेटा नहीं मिला"
      )}
    />
  );
}
