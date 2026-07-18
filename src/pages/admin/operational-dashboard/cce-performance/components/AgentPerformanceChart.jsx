import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";

export default function AgentPerformanceChart({ data, xKey }) {
  return (
    <ChartCard
      title="Agent Performance Comparison"
      subtitle="Calls handled by agent"
    >
      <BarChartCard
        data={data}
        xKey={xKey}
        bars={[
          { key: "calls", label: "Total Calls", color: "#1d4ed8" },
          { key: "resolved", label: "Resolved", color: "#22c55e" },
        ]}
      />
    </ChartCard>
  );
}
