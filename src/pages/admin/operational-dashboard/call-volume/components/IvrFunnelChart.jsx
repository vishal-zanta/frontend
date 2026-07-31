import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { PieChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function IvrFunnelChart({ data }) {
  const { t } = useLanguage();
  return (
    <ChartCard
      title={t("IVR Completion vs Drop-off", "आईवीआर समाप्ति बनाम ड्रॉप-ऑफ")}
      subtitle={t("IVR funnel analysis", "आईवीआर फनल विश्लेषण")}
    >
      <PieChartCard data={data} />
    </ChartCard>
  );
}
