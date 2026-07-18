import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { RadarChartCard } from "@/components/Charts";

export default function ChannelSatisfactionChart({ data, xKey }) {
  return (
    <ChartCard
      title="Channel Satisfaction"
      subtitle="CSAT by communication channel"
    >
      <RadarChartCard
        data={data}
        xKey={xKey}
        series={[
          { key: "A", label: "Satisfaction", color: "#1d4ed8" },
          { key: "B", label: "Volume (scaled)", color: "#22c55e" },
        ]}
      />
    </ChartCard>
  );
}
