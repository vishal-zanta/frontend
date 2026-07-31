import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { LineChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function PeakHourChart({ data, xKey, peakHour }) {
  const { t } = useLanguage();
  return (
    <ChartCard
      title={t("Peak Hour Analysis", "पीक आवर्स का विश्लेषण")}
      subtitle={`${t("Peak hour:", "पीक घंटा:")} ${peakHour}`}
    >
      <LineChartCard
        data={data}
        xKey={xKey}
        lines={[
          { key: "calls", label: t("Incoming", "आवक"), color: "#1d4ed8" },
          { key: "answered", label: t("Answered", "उत्तर दी गई"), color: "#22c55e" },
        ]}
      />
    </ChartCard>
  );
}
