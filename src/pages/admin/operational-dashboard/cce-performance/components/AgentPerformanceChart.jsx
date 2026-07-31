import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function AgentPerformanceChart({ data, xKey }) {
  const { t } = useLanguage();
  return (
    <ChartCard
      title={t("Top Agent Performances", "शीर्ष एजेंट प्रदर्शन")}
      subtitle={t("Calls handled by agent", "एजेंट द्वारा संभाली गई कॉल")}
    >
      <BarChartCard
        data={data}
        xKey={xKey}
        bars={[
          { key: "calls", label: t("Total Calls", "कुल कॉल"), color: "#1d4ed8" },
          { key: "resolved", label: t("Resolved", "निराकृत"), color: "#22c55e" },
        ]}
      />
    </ChartCard>
  );
}
