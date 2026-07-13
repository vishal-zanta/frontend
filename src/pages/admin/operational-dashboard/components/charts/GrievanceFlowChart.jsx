import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { AreaChartCard } from "@/components/Charts";

export default function GrievanceFlowChart({ data, xKey, label }) {
  return (
    <ChartCard
      title={`Grievance Flow (${label})`}
      subtitle="Raised vs resolved vs pending"
    >
      <AreaChartCard
        data={data}
        xKey={xKey}
        areas={[
          { key: "raised", label: "Raised", color: "#1d4ed8" },
          { key: "resolved", label: "Resolved", color: "#22c55e" },
          { key: "pending", label: "Pending", color: "#f59e0b" },
        ]}
        height={320}
      />
    </ChartCard>
  );
}
