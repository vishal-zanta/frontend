import React from "react";
import { PhoneCall, PhoneMissed, Clock, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import CallTrafficChart from "./charts/CallTrafficChart";
import IvrFunnelChart from "./charts/IvrFunnelChart";
import PeakHourChart from "./charts/PeakHourChart";

export default function CallVolumeTab({ pd }) {
  const funnelData = [
    {
      name: "IVR Completed",
      value: Math.round(pd.calls * 0.87),
      color: "#22c55e",
    },
    {
      name: "Transferred to Agent",
      value: Math.round(pd.calls * 0.064),
      color: "#f59e0b",
    },
    {
      name: "Dropped in IVR",
      value: Math.round(pd.calls * 0.066),
      color: "#ef4444",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={PhoneCall}
          label={`Total Calls (${pd.label})`}
          value={pd.calls.toLocaleString("en-IN")}
          color="blue"
          trend="up"
          trendValue={`+8% (${pd.sub})`}
        />
        <StatCard
          icon={PhoneMissed}
          label="Missed Calls"
          value={pd.missed.toLocaleString("en-IN")}
          color="red"
          trend="down"
          trendValue={`-3% (${pd.sub})`}
        />
        <StatCard
          icon={Clock}
          label="Avg Wait Time"
          value={pd.avgWaitTime}
          color="amber"
        />
        <StatCard
          icon={TrendingUp}
          label="Success Rate"
          value={`${pd.successRate}%`}
          color="green"
          trend="up"
          trendValue={`+1.2% (${pd.sub})`}
          sublabel="Target: 95%"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CallTrafficChart data={pd.chartData} xKey={pd.chartXKey} />
        <IvrFunnelChart data={funnelData} />
      </div>
      <PeakHourChart
        data={pd.chartData}
        xKey={pd.chartXKey}
        peakHour={pd.peakHour}
      />
    </div>
  );
}
