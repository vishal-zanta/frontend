import React, { useState } from "react";
import {
  IVR_STATS,
  HOURLY_DISPOSITION,
  DAILY_VOLUME,
  WEEKLY_VOLUME,
  MONTHLY_VOLUME,
} from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { CCE_ROLES, MAX_LIMIT } from "@/utils/constants";
import CcePerformanceTab from "@/pages/admin/operational-dashboard/cce-performance";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import TimeRangeFilter from "@/components/TimeRangeFilter";
import { SectionTitle } from "@/components/ChartCard";
import { useGetUsers } from "@/pages/admin/user-management/hooks";

export default function CCEOperationalDashboard() {
  const { t } = useLanguage();
  const { rolesMap } = useAuth();
  const [period, setPeriod] = useState("daily");
  const [dateRange, setDateRange] = useState({});
  const [filters, setFilters] = useState({
    users: "",
  });

  const cceRoleIds = CCE_ROLES.map((r) => rolesMap?.get(r)).filter(Boolean);
  const params = {
    page: 1,
    limit: MAX_LIMIT,
    roles: cceRoleIds.join(","),
  };

  const { data: userDataApi } = useGetUsers(
    [JSON.stringify(params)],
    params,
    cceRoleIds.length > 0,
  );
  const usersData = (userDataApi?.data?.data?.docs || []).map((v) => ({
    label: v.name,
    value: v._id,
  }));

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

  const pd = periodData[period] || {
    ...periodData.daily,
    label:
      dateRange?.from && dateRange?.to
        ? `${new Date(dateRange.from).toLocaleDateString()} - ${new Date(dateRange.to).toLocaleDateString()}`
        : t("Custom Range", "कस्टम अवधि"),
    sub: t("custom range", "कस्टम अवधि"),
  };

  return (
    <PortalLayout role="cce">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <SectionTitle
          title={`${t("CCE Operational Dashboard", "ग्राहक सेवा अधिकारी परिचालन डैशबोर्ड")} - ${t("CCE Performance", "ग्राहक सेवा अधिकारी प्रदर्शन")}`}
          subtitle=""
        >
          <TimeRangeFilter
            period={period}
            setPeriod={setPeriod}
            dateRange={dateRange}
            setDateRange={setDateRange}
            boxClassName={"flex-wrap sm:flex-nowrap"}
            filterOptions={[
              {
                filterKey: "user",
                label: t("By Users", "उपयोगकर्ता के अनुसार"),
                options: usersData,
              },
            ]}
            filters={filters}
            setFilters={setFilters}
          />
        </SectionTitle>

        <CcePerformanceTab pd={pd} />
      </div>
    </PortalLayout>
  );
}
