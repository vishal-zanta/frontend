import React from "react";
import { Inbox, Clock, AlertTriangle, CheckCircle2, TrendingUp, Activity } from "lucide-react";
import StatCard from "@/components/StatCard";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { useGetDashboardData } from "../query";
import { getTrendProps } from "@/utils/helpers";


export default function StatsCards({ profileId, officer }) {

  const { data: analyticsData, isLoading, error } = useGetDashboardData({ role: profileId });


  const apiData = analyticsData?.data?.data || {};
  const current = apiData.currentPeriod || {};
  const previous = apiData.previousPeriod || {};


  const isStateLevel =
    profileId === "suda" ||
    profileId === "division" ||
    profileId === "zone";

  const renderContent = () => {
    if (isStateLevel) {
      const total = current.totalComplaints ?? apiData.totalComplaints ?? 0;
      const active = current.active ?? apiData.active ?? 0;
      const resolved = current.resolved ?? apiData.resolved ?? 0;
      const escalated = current.escalated ?? apiData.escalated ?? 0;
      const slaCompliance = current.slaCompliance ?? apiData.slaCompliance ?? 0;
      const citizenSatisfaction = current.citizenSatisfaction ?? apiData.citizenSatisfaction ?? 0;

      const totalTrend = getTrendProps(current.totalComplaints, previous.totalComplaints);
      const activeTrend = getTrendProps(current.active, previous.active);
      const resolvedTrend = getTrendProps(current.resolved, previous.resolved);
      const escalatedTrend = getTrendProps(current.escalated, previous.escalated, true);
      const slaTrend = getTrendProps(current.slaCompliance, previous.slaCompliance);
      const satisfactionTrend = getTrendProps(current.citizenSatisfaction, previous.citizenSatisfaction);

      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
            value={escalated}
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
            icon={TrendingUp}
            label="Satisfaction"
            value={`${citizenSatisfaction}/5`}
            color="sky"
            {...satisfactionTrend}
          />
        </div>
      );
    }

 
    const total = current.totalAssigned ?? apiData.totalAssigned ?? ((officer?.resolved || 0) + (officer?.pending || 0));
    const pending = current.pending ?? apiData.pending ?? (officer?.pending || 0);
    const resolved = current.resolved ?? apiData.resolved ?? (officer?.resolved || 0);
    const slaBreached = current.slaBreached ?? apiData.slaBreached ?? (officer?.slaBreached || 0);

    const totalTrend = getTrendProps(current.totalAssigned, previous.totalAssigned);
    const pendingTrend = getTrendProps(current.pending, previous.pending);
    const resolvedTrend = getTrendProps(current.resolved, previous.resolved);
    const slaTrend = getTrendProps(current.slaBreached, previous.slaBreached, true);

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Inbox}
          label="Total Assigned"
          value={total}
          color="blue"
          {...totalTrend}
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={pending}
          color="amber"
          {...pendingTrend}
        />
        <StatCard
          icon={CheckCircle2}
          label="Resolved"
          value={resolved}
          color="green"
          {...resolvedTrend}
        />
        <StatCard
          icon={AlertTriangle}
          label="SLA Breached"
          value={slaBreached}
          color="red"
          {...slaTrend}
        />
      </div>
    );
  };

  return (
    <LoaderErrWrapper isLoading={isLoading} error={error?.message}>
      {renderContent()}
    </LoaderErrWrapper>
  );
}