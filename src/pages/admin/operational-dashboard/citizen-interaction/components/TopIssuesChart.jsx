import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function TopIssuesChart({ data, xKey }) {
  const { t } = useLanguage();
  return (
    <ChartCard
      title={t("Top Issues by Volume", "मात्रा के अनुसार प्रमुख मुद्दे")}
      subtitle={t("Most frequently raised complaints", "सबसे अधिक उठाई गई शिकायतें")}
    >
      <BarChartCard
        data={data}
        xKey={xKey}
        bars={[
          {
            key: "interactions",
            label: t("Interactions", "सहभागिता"),
            color: "#0ea5e9",
          },
        ]}
        legend={false}
      />
    </ChartCard>
  );
}
