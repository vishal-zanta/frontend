import React from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import { useLanguage } from "@/context/LanguageContext";
import PreviousCallCards from "@/pages/crm/components/PreviousCallCards";
import { getDispositionBadgeClass } from "../constants";

export default function CallerHistoryTable({ calls = [] }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const tableHeaders = [
    { id: "id", label: t("Call ID", "कॉल आईडी") },
    { id: "time", label: t("Date / Time", "दिनांक / समय") },
    { id: "agent", label: t("Agent", "एजेंट") },
    { id: "duration", label: t("Duration", "अवधि") },
    { id: "disposition", label: t("Disposition", "निपटान") },
    { id: "complaint", label: t("Complaint", "शिकायत") },
  ];

  const tableBody = calls.map((c) => ({
    id: {
      value: c.id || "N/A",
      className: "font-mono text-xs text-primary font-semibold",
    },
    time: {
      value: c.time || "N/A",
      className: "text-muted-foreground",
    },
    agent: {
      value: c.agent || "N/A",
    },
    duration: {
      value: c.duration || "N/A",
      className: "text-muted-foreground",
    },
    disposition: {
      render: () => (
        <Badge
          variant="outline"
          className={`text-xs ${getDispositionBadgeClass(c.disposition)}`}
        >
          {c.disposition || "N/A"}
        </Badge>
      ),
    },
    complaint: {
      render: () =>
        c.complaintId ? <ComplaintId id={c.complaintId} /> : "N/A",
    },
  }));

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-bold text-foreground">
          {t(
            "Caller History - Previous Interactions",
            "कॉलर इतिहास - पिछला संवाद",
          )}
        </h3>
      </div>
      {isMobile ? (
        <PreviousCallCards calls={calls} />
      ) : (
        <MyTable
          tableHeaders={tableHeaders}
          tableBody={tableBody}
          emptyText={t("No previous calls found.", "कोई पिछला कॉल नहीं मिला।")}
        />
      )}
    </div>
  );
}
