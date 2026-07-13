import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { PieChartCard } from "@/components/Charts";

export default function AgentStatusChart({ data }) {
  return (
    <ChartCard
      title="Helpdesk Agent Status"
      subtitle="Live agent availability"
    >
      <PieChartCard data={data} />
    </ChartCard>
  );
}
