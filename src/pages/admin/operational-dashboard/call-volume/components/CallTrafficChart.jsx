import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function CallTrafficChart({ data, xKey }) {
  const { t } = useLanguage();
  return (
    <ChartCard
      title={t("Call Traffic", "कॉल ट्रैफ़िक")}
      subtitle={t("Calls received vs answered", "प्राप्त कॉल बनाम उत्तर दी गई कॉल")}
    >
      <BarChartCard
        data={data}
        xKey={xKey}
        bars={[
          { key: "calls", label: t("Received", "प्राप्त"), color: "#1d4ed8" },
          { key: "answered", label: t("Answered", "उत्तर दी गई"), color: "#22c55e" },
        ]}
      />
    </ChartCard>
  );
}
