import React from "react";
import { PhoneCall, PhoneMissed, Clock, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import CallTrafficChart from "./components/CallTrafficChart";
import IvrFunnelChart from "./components/IvrFunnelChart";
import PeakHourChart from "./components/PeakHourChart";
import { useLanguage } from "@/context/LanguageContext";

export default function CallVolumeTab({ pd }) {
  const { t } = useLanguage();
  const funnelData = [
    {
      name: t("IVR Completed", "आईवीआर पूरा हुआ"),
      value: Math.round(pd.calls * 0.87),
      color: "#22c55e",
    },
    {
      name: t("Transferred to Agent", "एजेंट को स्थानांतरित"),
      value: Math.round(pd.calls * 0.064),
      color: "#f59e0b",
    },
    {
      name: t("Dropped in IVR", "आईवीआर में ड्रॉप हुआ"),
      value: Math.round(pd.calls * 0.066),
      color: "#ef4444",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={PhoneCall}
          label={`${t("Total Calls", "कुल कॉल")} (${pd.label})`}
          value={pd.calls.toLocaleString("en-IN")}
          color="blue"
          trend="up"
          trendValue={`+8% (${pd.sub})`}
        />
        <StatCard
          icon={PhoneMissed}
          label={t("Missed Calls", "मिस कॉल")}
          value={pd.missed.toLocaleString("en-IN")}
          color="red"
          trend="down"
          trendValue={`-3% (${pd.sub})`}
        />
        <StatCard
          icon={Clock}
          label={t("Avg Wait Time", "औसत प्रतीक्षा समय")}
          value={pd.avgWaitTime}
          color="amber"
        />
        <StatCard
          icon={TrendingUp}
          label={t("Success Rate", "सफलता दर")}
          value={`${pd.successRate}%`}
          color="green"
          trend="up"
          trendValue={`+1.2% (${pd.sub})`}
          sublabel={t("Target: 95%", "लक्ष्य: 95%")}
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
