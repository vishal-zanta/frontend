import React from "react";
import { PhoneCall, Users, Clock, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CallStatsCards({ headers = [], body = [] }) {
  const { t } = useLanguage();
  const dataRow = body[0] || {};

  if (!headers || headers.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No call statistics data available.", "कोई कॉल सांख्यिकी डेटा उपलब्ध नहीं है।")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-3 p-3 xs:p-4">
      {headers.map((h) => {
        const valObj = dataRow[h.id];
        const rawVal = valObj ? (valObj.value !== undefined ? valObj.value : valObj) : "N/A";
        const displayVal = (rawVal === undefined || rawVal === null || rawVal === "" || rawVal === "-") ? "N/A" : rawVal;

        let accentColor = "text-foreground";
        if (["agentReady", "totalInBoundCalls"].includes(h.id)) {
          accentColor = "text-emerald-600 dark:text-emerald-400 font-bold";
        } else if (["agentInCall", "totalOutBoundCalls"].includes(h.id)) {
          accentColor = "text-blue-600 dark:text-blue-400 font-bold";
        } else if (["agentBreak", "callsInQueue"].includes(h.id)) {
          accentColor = "text-amber-600 dark:text-amber-400 font-bold";
        } else if (["missedCalls", "callsAbandoned"].includes(h.id)) {
          accentColor = "text-red-600 dark:text-red-400 font-bold";
        }

        return (
          <div
            key={h.id}
            className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden p-3"
          >
            <span className="text-muted-foreground block text-[10px] uppercase font-medium truncate">
              {h.label}
            </span>
            <span className={`text-base xs:text-lg font-bold block mt-1 ${accentColor}`}>
              {displayVal}
            </span>
          </div>
        );
      })}
    </div>
  );
}
