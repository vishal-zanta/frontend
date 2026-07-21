import React from "react";
import { Inbox, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import StatCard from "@/components/StatCard";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { getTrendProps } from "@/utils/helpers";
import { useLanguage } from "@/context/LanguageContext";

export default function StatsCards({ officer, analyticsData, isLoading, error }) {
  const { t } = useLanguage();
  const apiData = analyticsData?.data?.data || {};
  const current = apiData.currentPeriod || {};
  const previous = apiData.previousPeriod || {};

  const total = current.totalAssigned ?? 0;
  const pending = current.pending ?? 0;
  const resolved = current.resolved ?? 0;
  const slaBreached = current.slaBreached ?? 0;

  const totalTrend = getTrendProps(current.totalAssigned, previous.totalAssigned);
  const pendingTrend = getTrendProps(current.pending, previous.pending);
  const resolvedTrend = getTrendProps(current.resolved, previous.resolved);
  const slaTrend = getTrendProps(current.slaBreached, previous.slaBreached, true);

  return (
    <LoaderErrWrapper isLoading={isLoading} error={error?.message}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Inbox}
          label={t("Total Assigned", "कुल आवंटित")}
          value={total}
          color="blue"
          {...totalTrend}
        />
        <StatCard
          icon={Clock}
          label={t("Pending", "लंबित")}
          value={pending}
          color="amber"
          {...pendingTrend}
        />
        <StatCard
          icon={CheckCircle2}
          label={t("Resolved", "हल की गई")}
          value={resolved}
          color="green"
          {...resolvedTrend}
        />
        <StatCard
          icon={AlertTriangle}
          label={t("SLA Breached", "एसएलए उल्लंघन")}
          value={slaBreached}
          color="red"
          {...slaTrend}
        />
      </div>
    </LoaderErrWrapper>
  );
}