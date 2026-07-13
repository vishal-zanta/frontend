import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { PieChartCard } from "@/components/Charts";

export default function CategoryDistributionChart({ data }) {
  return (
    <ChartCard
      title="Category Distribution"
      subtitle="Complaints by service type"
    >
      <PieChartCard data={data} height={300} />
    </ChartCard>
  );
}
