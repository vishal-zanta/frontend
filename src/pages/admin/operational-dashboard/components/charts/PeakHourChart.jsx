import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { LineChartCard } from "@/components/Charts";

export default function PeakHourChart({ data, xKey, peakHour }) {
  return (
    <ChartCard
      title="Peak Hour Analysis"
      subtitle={`Peak hour: ${peakHour}`}
    >
      <LineChartCard
        data={data}
        xKey={xKey}
        lines={[
          { key: "calls", label: "Incoming", color: "#1d4ed8" },
          { key: "answered", label: "Answered", color: "#22c55e" },
        ]}
      />
    </ChartCard>
  );
}
