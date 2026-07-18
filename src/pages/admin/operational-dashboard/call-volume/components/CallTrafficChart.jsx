import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";

export default function CallTrafficChart({ data, xKey }) {
  return (
    <ChartCard
      title="Call Traffic"
      subtitle="Calls received vs answered"
    >
      <BarChartCard
        data={data}
        xKey={xKey}
        bars={[
          { key: "calls", label: "Received", color: "#1d4ed8" },
          { key: "answered", label: "Answered", color: "#22c55e" },
        ]}
      />
    </ChartCard>
  );
}
