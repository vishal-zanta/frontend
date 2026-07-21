import React from "react";
import { Search, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useLanguage } from "@/context/LanguageContext";

export default function StatsCards({ totalAssigned, pendingAction, resolved, slaBreachRisk }) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard icon={Search} label={t("Total Assigned", "कुल आवंटित")} value={totalAssigned} color="blue" />
      <StatCard icon={Clock} label={t("Pending Action", "लंबित कार्रवाई")} value={pendingAction} color="amber" />
      <StatCard icon={CheckCircle2} label={t("Resolved", "हल की गई")} value={resolved} color="green" />
      <StatCard icon={AlertTriangle} label={t("SLA Breach Risk", "एसएलए उल्लंघन का जोखिम")} value={slaBreachRisk} color="red" />
    </div>
  );
}
