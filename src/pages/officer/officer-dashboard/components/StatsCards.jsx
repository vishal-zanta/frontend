import React from "react";
import {
  Inbox,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Percent,
  Timer,
  Star,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { getTrendProps } from "@/utils/helpers";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function StatsCards({
  officer,
  analyticsData,
  isLoading,
  error,
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();
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

  const slaPercentage = apiData.slaPercentage ?? current.slaPercentage ?? "98.5%";
  const avgResolution = apiData.avgResolution ?? current.avgResolution ?? "14h";
  const rating = apiData.rating ?? current.rating ?? "4.8/5";

  const totalTrend = getTrendProps(
    current.totalAssigned,
    previous.totalAssigned,
    false,
    t,
  );
  const pendingTrend = getTrendProps(
    current.pending,
    previous.pending,
    false,
    t,
  );
  const resolvedTrend = getTrendProps(
    current.resolved,
    previous.resolved,
    false,
    t,
  );
  const previousSlaBreached =
    previous.slaBreachIn48Hours ??
    previous.slaBreachNext48Hrs ??
    previous.slaBreachedIn48Hours ??
    previous.slaBreached ??
    0;
  const slaTrend = getTrendProps(slaBreached, previousSlaBreached, true, t);

  return (
    <LoaderErrWrapper isLoading={isLoading} error={error}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          icon={Inbox}
          label={t("Total Assigned", "कुल आवंटित")}
          value={total}
          color="blue"
          onClick={() => navigate("/officer/complaints")}
          {...totalTrend}
        />
        <StatCard
          icon={Clock}
          label={t("Pending", "लंबित")}
          value={pending}
          color="amber"
          onClick={() =>
            navigate(
              "/officer/complaints?filter.status=IN_PROGRESS,REOPENED",
            )
          }
          {...pendingTrend}
        />
        <StatCard
          icon={CheckCircle2}
          label={t("Resolved", "समाधान की गई")}
          value={resolved}
          color="green"
          onClick={() =>
            navigate(
              "/officer/complaints?filter.status=RESOLVED",
            )
          }
          {...resolvedTrend}
        />
        <StatCard
          icon={AlertTriangle}
          label={t(
            "SLA Breach in Next 48 Hrs",
            "अगले 48 घंटों में SLA उल्लंघन",
          )}
          value={slaBreached}
          color="red"
          isClicked={Number(slaBreached) > 3}
          {...slaTrend}
        />
        <StatCard
          icon={Percent}
          label={t("SLA %", "SLA %")}
          value={slaPercentage}
          color="emerald"
        />
        <StatCard
          icon={Timer}
          label={t("Avg Resolution", "औसत समाधान समय")}
          value={avgResolution}
          color="purple"
        />
        <StatCard
          icon={Star}
          label={t("Rating", "रेटिंग")}
          value={
            <span className="text-amber-500 dark:text-amber-400 flex items-center justify-center gap-1">
              <span>★</span>
              <span>{rating}</span>
            </span>
          }
          color="amber"
        />
      </div>
    </LoaderErrWrapper>
  );
}


