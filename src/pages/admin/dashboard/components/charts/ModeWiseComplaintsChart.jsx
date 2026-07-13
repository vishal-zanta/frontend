import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";

export default function ModeWiseComplaintsChart({ data }) {
  return (
    <ChartCard
      title="Mode-wise Complaints"
      subtitle="Distribution by source channel"
    >
      <BarChartCard
        data={data}
        xKey="name"
        bars={[{ key: "value", label: "Complaints", color: "#0ea5e9" }]}
        height={280}
        legend={false}
      />
    </ChartCard>
  );
}
