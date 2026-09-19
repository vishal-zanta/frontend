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
  const slaBreached =
    current.slaBreachIn48Hours ??
    current.slaBreachNext48Hrs ??
    current.slaBreachedIn48Hours ??
    current.slaBreached ??
    0;

  const totalTrend = getTrendProps(current.totalAssigned, previous.totalAssigned, false, t);
  const pendingTrend = getTrendProps(current.pending, previous.pending, false, t);
  const resolvedTrend = getTrendProps(current.resolved, previous.resolved, false, t);
  const previousSlaBreached =
    previous.slaBreachIn48Hours ??
    previous.slaBreachNext48Hrs ??
    previous.slaBreachedIn48Hours ??
    previous.slaBreached ??
    0;
  const slaTrend = getTrendProps(slaBreached, previousSlaBreached, true,  t);

  return (
    <LoaderErrWrapper isLoading={isLoading} error={error}>
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
          label={t("SLA Breach in Next 48 Hrs", "अगले 48 घंटों में SLA उल्लंघन")}
          value={slaBreached}
          color="red"
          isClicked={Number(slaBreached) > 3}
          {...slaTrend}
        />
      </div>
    </LoaderErrWrapper>
  );
}