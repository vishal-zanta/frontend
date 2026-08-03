import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Phone, Users, Clock, Activity, BarChart3, Server } from "lucide-react";
import {
  IVR_STATS,
  HOURLY_DISPOSITION,
  DAILY_VOLUME,
  WEEKLY_VOLUME,
  MONTHLY_VOLUME,
} from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/utils/constants";

import CallVolumeTab from "./call-volume";
import CcePerformanceTab from "./cce-performance";
import SlaPerformanceTab from "./sla-performance";
import GrievanceTab from "./grievance";
import CitizenInteractionTab from "./citizen-interaction";
import SystemTab from "./system";
import { useLanguage } from "@/context/LanguageContext";

import { SectionTitle } from "@/components/ChartCard";

const tabs = [
  {
    id: "call-volume",
    labelEn: "Call Volume & Traffic",
    labelHi: "कॉल मात्रा और ट्रैफ़िक",
    icon: Phone,
    permissions: PERMISSIONS.OPERATIONAL_CALL_VOLUME,
  },
  {
    id: "cce-performance",
    labelEn: "CCE Performance",
    labelHi: "CCE प्रदर्शन",
    icon: Users,
    permissions: PERMISSIONS.OPERATIONAL_CCE_PERFORMANCE,
  },
  {
    id: "sla-performance",
    labelEn: "Service Level Performance",
    labelHi: "सेवा स्तर का प्रदर्शन",
    icon: Clock,
    permissions: PERMISSIONS.OPERATIONAL_SLA_PERFORMANCE,
  },
  {
    id: "grievance",
    labelEn: "Grievance & Ticket Management",
    labelHi: "शिकायत और टिकटिंग प्रबंधन",
    icon: Activity,
    permissions: PERMISSIONS.OPERATIONAL_GRIEVANCE,
  },
  {
    id: "citizen-interaction",
    labelEn: "Citizen Interaction Analytics",
    labelHi: "नागरिक सहभागिता विश्लेषण",
    icon: BarChart3,
    permissions: PERMISSIONS.OPERATIONAL_CITIZEN_INTERACTION,
  },
  {
    id: "system",
    labelEn: "System & Infrastructure",
    labelHi: "सिस्टम और अवसंरचना",
    icon: Server,
    permissions: PERMISSIONS.OPERATIONAL_SYSTEM,
  },
];

export default function OperationalDashboard() {
  const { t } = useLanguage();
  const { hasPermission } = useAuth();
  const [searchParams] = useSearchParams();
  const [period, setPeriod] = useState("daily");
  const [dateRange, setDateRange] = useState({});

  const filteredTabs = tabs.filter((t) => hasPermission(t.permissions));

  const tab =
    (filteredTabs.map((t) => t.id).includes(searchParams.get("tab"))
      ? searchParams.get("tab")
      : undefined) ??
    filteredTabs?.[0]?.id ??
    "call-volume";

  const activeTab = filteredTabs.find((t) => t.id === tab);

  const periodData = {
    daily: {
      label: t("Today", "आज"),
      sub: t("vs yesterday", "बनाम कल"),
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
      label: t("This Week", "इस सप्ताह"),
      sub: t("vs last week", "बनाम पिछला सप्ताह"),
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
      label: t("This Month", "इस महीने"),
      sub: t("vs last month", "बनाम पिछला महीना"),
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
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <SectionTitle
          title={`${t("Operational Dashboard", "परिचालन डैशबोर्ड")} -
              ${t(activeTab?.labelEn || "", activeTab?.labelHi || "")}`}
          subtitle={t(
            "Real-time operational metrics across call centre, SLA, grievances, and infrastructure",
            "कॉल सेंटर, SLA, शिकायतों और अवसंरचना में वास्तविक समय के परिचालन मेट्रिक्स",
          )}
        />

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
