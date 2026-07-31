import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { AreaChartCard } from "@/components/Charts";
import { transformComplaintVolume } from "../../helpers";
import { useLanguage } from "@/context/LanguageContext";

export default function ComplaintVolumeChart({ mainData}) {
  const { t } = useLanguage();
  const chartData =transformComplaintVolume(mainData) ;

  return (
    <ChartCard
      title={t("Complaint Volume (30 Days)", "शिकायत की मात्रा (30 दिन)")}
      subtitle={t("Daily raised vs resolved trends", "दैनिक दर्ज बनाम निराकृत रुझान")}
      className="lg:col-span-2"
    >
      <AreaChartCard
        data={chartData}
        xKey="label"
        areas={[
          { key: "raised", label: t("Raised", "दर्ज की गई"), color: "#1d4ed8" },
          { key: "resolved", label: t("Resolved", "निराकृत"), color: "#22c55e" },
        ]}
        height={300}
      />
    </ChartCard>
  );
}
