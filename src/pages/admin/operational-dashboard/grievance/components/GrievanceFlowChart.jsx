import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { AreaChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function GrievanceFlowChart({ data, xKey, label }) {
  const { t } = useLanguage();
  return (
    <ChartCard
      title={`${t("Grievance Flow", "शिकायत प्रवाह")} (${label})`}
      subtitle={t("Raised vs resolved vs pending", "दर्ज बनाम निराकृत बनाम लंबित")}
    >
      <AreaChartCard
        data={data}
        xKey={xKey}
        areas={[
          { key: "raised", label: t("Raised", "दर्ज"), color: "#1d4ed8" },
          { key: "resolved", label: t("Resolved", "निराकृत"), color: "#22c55e" },
          { key: "pending", label: t("Pending", "लंबित"), color: "#f59e0b" },
        ]}
        height={320}
      />
    </ChartCard>
  );
}
