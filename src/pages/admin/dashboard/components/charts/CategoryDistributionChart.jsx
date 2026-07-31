import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { PieChartCard } from "@/components/Charts";
import { transformCategoryDistribution } from "../../helpers";
import { useLanguage } from "@/context/LanguageContext";

export default function CategoryDistributionChart({ mainData }) {
  const { t } = useLanguage();
  const chartData = transformCategoryDistribution(mainData);

  return (
    <ChartCard
      title={t("Category Distribution", "श्रेणी विवरण")}
      subtitle={t("Complaints by service type", "सेवा के प्रकार द्वारा शिकायतें")}
    >
      <PieChartCard data={chartData} height={350} />
    </ChartCard>
  );
}
