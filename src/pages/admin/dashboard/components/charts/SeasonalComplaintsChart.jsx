import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function SeasonalComplaintsChart({ data }) {
  const { t } = useLanguage();

  const seasonalTypeOptions = [
    { label: t("Floods", "बाढ़"), value: "floods", defaultCount: 1850 },
    { label: t("Summer", "गर्मी"), value: "summer", defaultCount: 2420 },
    { label: t("Rain", "बारिश"), value: "rain", defaultCount: 1230 },
  ];

  const dummyData = seasonalTypeOptions.map((item) => ({
    season: item.label,
    complaints: item.defaultCount,
  }));

  const chartData =
    data && data.length > 0
      ? data.map((d) => ({
          season:
            seasonalTypeOptions.find(
              (opt) =>
                opt.value === d.value ||
                opt.value === d.seasonalType ||
                opt.value === d._id ||
                opt.label === d.name ||
                opt.label === d.label
            )?.label ||
            d.name ||
            d.label ||
            d.season ||
            d._id,
          complaints: d.count ?? d.complaints ?? d.value ?? 0,
        }))
      : dummyData;

  return (
    <ChartCard
      title={t("Seasonal Complaints", "मौसमी शिकायतें")}
      subtitle={t(
        "Complaints count by seasonal type",
        "मौसमी प्रकार के अनुसार शिकायतों की संख्या",
      )}
    >
      <BarChartCard
        data={chartData}
        xKey="season"
        bars={[
          {
            key: "complaints",
            label: t("No. of Complaints", "शिकायतों की संख्या"),
            color: "#0284c7",
          },
        ]}
        height={280}
        legend={false}
      />
    </ChartCard>
  );
}
