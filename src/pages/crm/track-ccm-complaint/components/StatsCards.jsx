import React from "react";
import {
  Inbox,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import { useLanguage } from "@/context/LanguageContext";

export default function StatsCards({
  total = 0,
  totalAssigned = 0,
  unassignedCount = 0,
  pendingCount = 0,
  resolvedCount = 0,
  escalatedCount = 0,
  pendingAction,
  resolved,
  slaBreachRisk,
  analytics,
}) {
  const { t } = useLanguage();

  const finalTotal = total ?? analytics?.total ?? 0;
  const finalAssigned = totalAssigned ?? analytics?.totalAssigned ?? 0;
  const finalUnassigned = unassignedCount ?? analytics?.unassignedCount ?? 0;
  const finalPending =
    pendingCount ?? pendingAction ?? analytics?.pendingCount ?? 0;
  const finalResolved =
    resolvedCount ?? resolved ?? analytics?.resolvedCount ?? 0;
  const finalEscalated =
    escalatedCount ?? slaBreachRisk ?? analytics?.escalatedCount ?? 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      <StatCard
        icon={Inbox}
        label={t("Total Complaints", "कुल शिकायतें")}
        value={finalTotal}
        color="blue"
      />
      <StatCard
        icon={UserCheck}
        label={t("Total Assigned", "कुल आवंटित")}
        value={finalAssigned}
        color="indigo"
      />
      <StatCard
        icon={UserX}
        label={t("Unassigned", "अनावंटित")}
        value={finalUnassigned}
        color="purple"
      />
      <StatCard
        icon={Clock}
        label={t("Pending Action", "लंबित कार्रवाई")}
        value={finalPending}
        color="amber"
      />
      <StatCard
        icon={CheckCircle2}
        label={t("Resolved", "समाधान की गई")}
        value={finalResolved}
        color="green"
      />
      <StatCard
        icon={AlertTriangle}
        label={t("Escalated", "हस्तांतरित किया गया")}
        value={finalEscalated}
        color="red"
      />
    </div>
  );
}
