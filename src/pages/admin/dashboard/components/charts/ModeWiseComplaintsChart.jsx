import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function ModeWiseComplaintsChart({  mainData=[] }) {
  const { t } = useLanguage();
  return (
    <ChartCard
      title={t("Source-wise Complaints", "स्रोत-वार शिकायतें")}
      subtitle={t("Distribution by source channel", "स्रोत चैनल द्वारा वितरण")}
    >
      <BarChartCard
        data={(mainData || [])?.map((d) => ({
          name: d?.name,
          value: d?.count,
          color: "#1d4ed8",
        }))}
        xKey="name"
        bars={[{ key: "value", label: t("Complaints", "शिकायतें"), color: "#0ea5e9" }]}
        height={280}
        legend={false}
      />
    </ChartCard>
  );
}
