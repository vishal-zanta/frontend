import React from "react";
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Star,
  Activity,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import { DASHBOARD_KPIS } from "@/lib/biharData";

export default function KPIs() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard
        icon={Inbox}
        label="Total Complaints"
        value={DASHBOARD_KPIS.totalComplaints.toLocaleString("en-IN")}
        color="blue"
        trend="up"
        trendValue="+3.2% vs last period"
      />
      <StatCard
        icon={Activity}
        label="Active"
        value={DASHBOARD_KPIS.active.toLocaleString("en-IN")}
        color="amber"
      />
      <StatCard
        icon={CheckCircle2}
        label="Resolved"
        value={DASHBOARD_KPIS.resolved.toLocaleString("en-IN")}
        color="green"
        trend="up"
        trendValue="+5.1% vs last period"
      />
      <StatCard
        icon={AlertTriangle}
        label="Escalated"
        value={DASHBOARD_KPIS.escalated}
        color="red"
        trend="down"
        trendValue="-1.4% vs last period"
      />
      <StatCard
        icon={Clock}
        label="SLA Compliance"
        value={`${DASHBOARD_KPIS.slaCompliance}%`}
        color="purple"
        trend="up"
        trendValue="+0.8% vs last period"
        sublabel="Target: 95%"
      />
      <StatCard
        icon={Star}
        label="Satisfaction"
        value={`${DASHBOARD_KPIS.citizenSatisfaction}/5`}
        color="sky"
        trend="up"
        trendValue="+0.2 vs last period"
        sublabel="Target: 4.5"
      />
    </div>
  );
}
