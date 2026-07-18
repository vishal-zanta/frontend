import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";

export default function ResourceUsageChart({ data, xKey }) {
  return (
    <ChartCard
      title="System Resource Usage"
      subtitle="CPU, Memory & DB connection utilization"
    >
      <BarChartCard
        data={data}
        xKey={xKey}
        bars={[{ key: "usage", label: "Usage %", color: "#1d4ed8" }]}
        legend={false}
      />
    </ChartCard>
  );
}
