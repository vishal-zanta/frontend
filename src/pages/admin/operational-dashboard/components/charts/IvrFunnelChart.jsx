import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { PieChartCard } from "@/components/Charts";

export default function IvrFunnelChart({ data }) {
  return (
    <ChartCard
      title="IVR Completion vs Drop-off"
      subtitle="IVR funnel analysis"
    >
      <PieChartCard data={data} />
    </ChartCard>
  );
}
