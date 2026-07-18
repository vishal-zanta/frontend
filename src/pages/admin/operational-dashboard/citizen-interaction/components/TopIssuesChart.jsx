import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";

export default function TopIssuesChart({ data, xKey }) {
  return (
    <ChartCard
      title="Top Issues by Volume"
      subtitle="Most frequently raised complaints"
    >
      <BarChartCard
        data={data}
        xKey={xKey}
        bars={[
          {
            key: "interactions",
            label: "Interactions",
            color: "#0ea5e9",
          },
        ]}
        legend={false}
      />
    </ChartCard>
  );
}
