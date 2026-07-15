import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { AreaChartCard } from "@/components/Charts";
import { transformComplaintVolume } from "../../helpers";

export default function ComplaintVolumeChart({ mainData}) {
  const chartData =transformComplaintVolume(mainData) ;

  return (
    <ChartCard
      title="Complaint Volume (30 Days)"
      subtitle="Daily raised vs resolved trends"
      className="lg:col-span-2"
    >
      <AreaChartCard
        data={chartData}
        xKey="label"
        areas={[
          { key: "raised", label: "Raised", color: "#1d4ed8" },
          { key: "resolved", label: "Resolved", color: "#22c55e" },
        ]}
        height={300}
      />
    </ChartCard>
  );
}
