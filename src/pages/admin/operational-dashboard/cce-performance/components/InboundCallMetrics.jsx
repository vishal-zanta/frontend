import React from "react";
import { Phone, PhoneMissed, Hourglass, AlertTriangle, CheckCircle } from "lucide-react";
import StatCard from "@/components/StatCard";

export default function InboundCallMetrics() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <div className="w-1.5 h-4 bg-primary rounded-full" />
        In-Bound Call Metrics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Phone}
          label="Total Calls"
          value="8,444"
          color="sky"
        />
        <StatCard
          icon={PhoneMissed}
          label="Missed Calls"
          value="1"
          color="green"
        />
        <StatCard
          icon={Hourglass}
          label="In Queue"
          value="0"
          color="amber"
        />
        <StatCard
          icon={AlertTriangle}
          label="Abandoned"
          value="0"
          color="red"
        />
        <StatCard
          icon={CheckCircle}
          label="Avg Successful Calls Per Agent"
          value="62.81"
          color="blue"
          sublabel="Data for: 07 Jul 2026"
        />
      </div>
    </div>
  );
}
