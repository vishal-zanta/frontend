import React from "react";
import { PhoneCall, ShieldCheck, PhoneMissed, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useLanguage } from "@/context/LanguageContext";

export default function CallHistoryStats({
  totalCalls = 0,
  evidenceCount = 0,
  missedCount = 0,
  avgDuration = "—",
}) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        icon={PhoneCall}
        label={t("Total Calls Logged", "कुल दर्ज कॉल")}
        value={totalCalls}
        color="blue"
      />
      <StatCard
        icon={ShieldCheck}
        label={t("Evidence Tagged", "साक्ष्य चिह्नित")}
        value={evidenceCount}
        color="purple"
      />
      <StatCard
        icon={PhoneMissed}
        label={t("Missed / Failed", "मिस्ड / असफल")}
        value={missedCount}
        color="red"
      />
      <StatCard
        icon={Clock}
        label={t("Avg Duration", "औसत अवधि")}
        value={avgDuration}
        color="amber"
      />
    </div>
  );
}
