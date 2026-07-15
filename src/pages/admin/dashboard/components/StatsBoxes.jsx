import React from "react";
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Star,
  Activity,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import { getTrendProps } from "@/utils/helpers";

export default function StatsBoxes({ metrics }) {
  const current = metrics?.currentPeriod || {};
  const previous = metrics?.previousPeriod || {};

  const total = current.totalComplaints ?? 0;
  const active = current.active ?? 0;
  const resolved = current.resolved ?? 0;
  const escalated = current.escalated ?? 0;
  const slaCompliance = current.slaCompliance ?? 0;
  const satisfaction = current.satisfaction ?? 0;

  const totalTrend = getTrendProps(current.totalComplaints, previous.totalComplaints);
  const activeTrend = getTrendProps(current.active, previous.active);
  const resolvedTrend = getTrendProps(current.resolved, previous.resolved);
  const escalatedTrend = getTrendProps(current.escalated, previous.escalated, true);
  const slaTrend = getTrendProps(current.slaCompliance, previous.slaCompliance);
  const satisfactionTrend = getTrendProps(current.satisfaction, previous.satisfaction);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        icon={Inbox}
        label="Total Complaints"
        value={total.toLocaleString("en-IN")}
        color="blue"
        {...totalTrend}
      />
      <StatCard
        icon={Activity}
        label="Active"
        value={active.toLocaleString("en-IN")}
        color="amber"
        {...activeTrend}
      />
      <StatCard
        icon={CheckCircle2}
        label="Resolved"
        value={resolved.toLocaleString("en-IN")}
        color="green"
        {...resolvedTrend}
      />
      <StatCard
        icon={AlertTriangle}
        label="Escalated"
        value={escalated.toLocaleString("en-IN")}
        color="red"
        {...escalatedTrend}
      />
      <StatCard
        icon={Clock}
        label="SLA Compliance"
        value={`${slaCompliance}%`}
        color="purple"
        sublabel="Target: 95%"
        {...slaTrend}
      />
      <StatCard
        icon={Star}
        label="Satisfaction"
        value={`${satisfaction}/5`}
        color="sky"
        sublabel="Target: 4.5"
        {...satisfactionTrend}
      />
    </div>
  );
}
