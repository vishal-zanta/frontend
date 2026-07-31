import React from "react";
import StatCard from "@/components/StatCard";
import { useLanguage } from "@/context/LanguageContext";

export default function OfficerTagAnalytics({ tagging = [], officers = [] }) {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        color="blue"
        value={officers.filter((o) => o.designation === "l1-officer").length}
        label={t("L1 Officers", "L1 अधिकारी")}
      />
      <StatCard
        color="purple"
        value={officers.filter((o) => o.designation === "l2-officer").length}
        label={t("L2 Officers", "L2 अधिकारी")}
      />
      <StatCard
        color="emerald"
        value={tagging.filter((o) => o.slaCompliant).length}
        label={t("SLA Compliant", "SLA अनुपालन")}
      />
      <StatCard
        color="red"
        value={tagging.filter((o) => !o.slaCompliant).length}
        label={t("SLA Breach Risk", "SLA उल्लंघन जोखिम")}
      />
    </div>
  );
}
