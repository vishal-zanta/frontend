import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { RadarChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function ChannelSatisfactionChart({ data, xKey }) {
  const { t } = useLanguage();
  return (
    <ChartCard
      title={t("Channel Satisfaction", "चैनल संतुष्टि")}
      subtitle={t("CSAT by communication channel", "संचार चैनल द्वारा संतुष्टि स्कोर")}
    >
      <RadarChartCard
        data={data}
        xKey={xKey}
        series={[
          { key: "A", label: t("Satisfaction", "संतुष्टि"), color: "#1d4ed8" },
          { key: "B", label: t("Volume (scaled)", "मात्रा (मापित)"), color: "#22c55e" },
        ]}
      />
    </ChartCard>
  );
}
