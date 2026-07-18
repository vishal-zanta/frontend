import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";

export default function SlaComplianceChart({ data, xKey }) {
  return (
    <ChartCard
      title="SLA Compliance by Service"
      subtitle="Within vs beyond SLA per service category"
    >
      <BarChartCard
        data={data}
        xKey={xKey}
        bars={[
          { key: "withinSLA", label: "Within SLA", color: "#22c55e" },
          { key: "beyondSLA", label: "Beyond SLA", color: "#ef4444" },
        ]}
        height={320}
      />
    </ChartCard>
  );
}
