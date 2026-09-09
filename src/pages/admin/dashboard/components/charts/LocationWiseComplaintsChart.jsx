import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard, PieChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function LocationWiseComplaintsChart({ data }) {
  const { t } = useLanguage();

  const dummyBarData = [
    {
      location: t("Bihar", "बिहार"),
      complaints: 4820,
    },
    {
      location: t("Outer Bihar", "बिहार से बाहर"),
      complaints: 540,
    },
  ];

  const chartData = data && data.length > 0 ? data : dummyBarData;

  return (
    <ChartCard
      title={t("Bihar vs Outer Bihar Complaints", "बिहार बनाम बाहरी बिहार शिकायतें")}
      subtitle={t(
        "Grievances origin within vs outside Bihar",
        "बिहार के भीतर बनाम बाहर से प्राप्त शिकायतें",
      )}
    >
      <BarChartCard
        data={chartData}
        xKey="location"
        bars={[
          {
            key: "complaints",
            label: t("No. of Complaints", "शिकायतों की संख्या"),
            color: "#6366f1",
          },
        ]}
        height={280}
        legend={false}
      />
    </ChartCard>
  );
}
