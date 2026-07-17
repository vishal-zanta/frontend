import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Phone,
  Users,
  Clock,
  Activity,
  BarChart3,
  Server,
} from "lucide-react";
import {
  IVR_STATS,
  HOURLY_DISPOSITION,
  DAILY_VOLUME,
  WEEKLY_VOLUME,
  MONTHLY_VOLUME,
} from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import TimeRangeFilter from "@/components/TimeRangeFilter";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/utils/constants";

import CallVolumeTab from "./components/CallVolumeTab";
import CcePerformanceTab from "./components/CcePerformanceTab";
import SlaPerformanceTab from "./components/SlaPerformanceTab";
import GrievanceTab from "./components/GrievanceTab";
import CitizenInteractionTab from "./components/CitizenInteractionTab";
import SystemTab from "./components/SystemTab";

const tabs = [
  {
    id: "call-volume",
    label: "Call Volume & Traffic",
    icon: Phone,
    permissions: PERMISSIONS.OPERATIONAL_CALL_VOLUME,
  },
  {
    id: "cce-performance",
    label: "CCE Performance",
    icon: Users,
    permissions: PERMISSIONS.OPERATIONAL_CCE_PERFORMANCE,
  },
  {
    id: "sla-performance",
    label: "Service Level Performance",
    icon: Clock,
    permissions: PERMISSIONS.OPERATIONAL_SLA_PERFORMANCE,
  },
  {
    id: "grievance",
    label: "Grievance & Ticket Management",
    icon: Activity,
    permissions: PERMISSIONS.OPERATIONAL_GRIEVANCE,
  },
  {
    id: "citizen-interaction",
    label: "Citizen Interaction Analytics",
    icon: BarChart3,
    permissions: PERMISSIONS.OPERATIONAL_CITIZEN_INTERACTION,
  },
  {
    id: "system",
    label: "System & Infrastructure",
    icon: Server,
    permissions: PERMISSIONS.OPERATIONAL_SYSTEM,
  },
];

export default function OperationalDashboard() {
  const { hasPermission } = useAuth();
  const [searchParams] = useSearchParams();
  const [period, setPeriod] = useState("daily");

  const filteredTabs = tabs.filter((t) => hasPermission(t.permissions));

  const tab = (filteredTabs.map((t) => t.id).includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : undefined) ?? filteredTabs?.[0]?.id ?? "call-volume";

  const activeTab = filteredTabs.find((t) => t.id === tab);

  const periodData = {
    daily: {
      label: "Today",
      sub: "vs yesterday",
      calls: IVR_STATS.totalCallsToday,
      answered: IVR_STATS.callsAnswered,
      missed: IVR_STATS.callsMissed,
      successRate: IVR_STATS.successRate,
      avgWaitTime: IVR_STATS.avgWaitTime,
      peakHour: IVR_STATS.peakHour,
      chartData: HOURLY_DISPOSITION,
      chartXKey: "hour",
      chartXLabel: "Hour",
      activeTickets: 3841,
      pendingAssignment: 412,
      resolvedToday: 143,
      escalated: 537,
      grievanceChart: DAILY_VOLUME,
      grievanceXKey: "label",
    },
    weekly: {
      label: "This Week",
      sub: "vs last week",
      calls: IVR_STATS.totalCallsToday * 7,
      answered: IVR_STATS.callsAnswered * 7,
      missed: IVR_STATS.callsMissed * 7,
      successRate: 94.2,
      avgWaitTime: "42s",
      peakHour: "Mon 10:00–11:00 AM",
      chartData: WEEKLY_VOLUME.map((w) => ({
        hour: w.week,
        calls: w.raised,
        answered: w.resolved,
      })),
      chartXKey: "hour",
      chartXLabel: "Week",
      activeTickets: 4210,
      pendingAssignment: 580,
      resolvedToday: 890,
      escalated: 620,
      grievanceChart: WEEKLY_VOLUME,
      grievanceXKey: "week",
    },
    monthly: {
      label: "This Month",
      sub: "vs last month",
      calls: IVR_STATS.totalCallsToday * 30,
      answered: IVR_STATS.callsAnswered * 30,
      missed: IVR_STATS.callsMissed * 30,
      successRate: 93.8,
      avgWaitTime: "45s",
      peakHour: "Jul 10:00–11:00 AM",
      chartData: MONTHLY_VOLUME.map((m) => ({
        hour: m.month,
        calls: m.raised,
        answered: m.resolved,
      })),
      chartXKey: "hour",
      chartXLabel: "Month",
      activeTickets: 5230,
      pendingAssignment: 1240,
      resolvedToday: 3890,
      escalated: 890,
      grievanceChart: MONTHLY_VOLUME,
      grievanceXKey: "month",
    },
  };
  const pd = periodData[period];

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Operational Dashboard - {activeTab?.label}
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time operational metrics across call centre, SLA, grievances,
              and infrastructure
            </p>
          </div>
          <TimeRangeFilter period={period} setPeriod={setPeriod} />
        </div>

        {tab === "call-volume" && <CallVolumeTab pd={pd} />}
        {tab === "cce-performance" && <CcePerformanceTab pd={pd} />}
        {tab === "sla-performance" && <SlaPerformanceTab />}
        {tab === "grievance" && <GrievanceTab pd={pd} />}
        {tab === "citizen-interaction" && <CitizenInteractionTab />}
        {tab === "system" && <SystemTab />}
      </div>
    </PortalLayout>
  );
}
