import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function ResourceUsageChart({ data, xKey }) {
  const { t } = useLanguage();
  return (
    <ChartCard
      title={t("System Resource Usage", "सिस्टम संसाधन उपयोग")}
      subtitle={t("CPU, Memory & DB connection utilization", "सीपीयू, मेमोरी और डीबी कनेक्शन उपयोग")}
    >
      <BarChartCard
        data={data}
        xKey={xKey}
        bars={[{ key: "usage", label: t("Usage %", "उपयोग %"), color: "#1d4ed8" }]}
        legend={false}
      />
    </ChartCard>
  );
}
