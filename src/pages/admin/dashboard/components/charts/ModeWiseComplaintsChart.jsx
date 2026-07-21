import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";

export default function ModeWiseComplaintsChart({  mainData=[] }) {
  // console.log({ data, mainData });
  return (
    <ChartCard
      title="Source-wise Complaints"
      subtitle="Distribution by source channel"
    >
      <BarChartCard
        data={(mainData || [])?.map((d) => ({
          name: d?.name,
          value: d?.count,
          color: "#1d4ed8",
        }))}
        xKey="name"
        bars={[{ key: "value", label: "Complaints", color: "#0ea5e9" }]}
        height={280}
        legend={false}
      />
    </ChartCard>
  );
}
