import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { PieChartCard } from "@/components/Charts";
import { transformCategoryDistribution } from "../../helpers";

export default function CategoryDistributionChart({ mainData }) {
  const chartData = transformCategoryDistribution(mainData);

  return (
    <ChartCard
      title="Category Distribution"
      subtitle="Complaints by service type"
    >
      <PieChartCard data={chartData} height={300} />
    </ChartCard>
  );
}
