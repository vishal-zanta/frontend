import React, { useState } from "react";
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Star,
  Activity,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import { getTrendProps } from "@/utils/helpers";
import EscalatedDetails from "./EscalatedDetails";
import { useLanguage } from "@/context/LanguageContext";

export default function StatsBoxes({ metrics }) {
  const { t } = useLanguage();
  const current = metrics?.currentPeriod || {};
  const previous = metrics?.previousPeriod || {};
  const [click, setClick] = useState(null);

  const total = current.totalComplaints ?? 0;
  const active = current.active ?? 0;
  const resolved = current.resolved ?? 0;
  const escalated = current.escalated ?? 0;
  const slaCompliance = current.slaCompliance ?? 0;
  const satisfaction = current.satisfaction ?? 0;

  const totalTrend = getTrendProps(
    current.totalComplaints,
    previous.totalComplaints,
  );
  const activeTrend = getTrendProps(current.active, previous.active);
  const resolvedTrend = getTrendProps(current.resolved, previous.resolved);
  const escalatedTrend = getTrendProps(
    current.escalated,
    previous.escalated,
    true,
  );
  const slaTrend = getTrendProps(current.slaCompliance, previous.slaCompliance);
  const satisfactionTrend = getTrendProps(
    current.satisfaction,
    previous.satisfaction,
  );

  function toggleClick(key) {
    if (click === key) {
      setClick(null);
    } else {
      setClick(key);
    }
  }
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5 xs:gap-3 sm:gap-4">
        <StatCard
          icon={Inbox}
          label={t("Total Complaints", "कुल शिकायतें")}
          value={total.toLocaleString("en-IN")}
          color="blue"
          {...totalTrend}
        />
        <StatCard
          icon={Activity}
          label={t("Active", "सक्रिय")}
          value={active.toLocaleString("en-IN")}
          color="amber"
          {...activeTrend}
        />
        <StatCard
          icon={CheckCircle2}
          label={t("Resolved", "निराकृत")}
          value={resolved.toLocaleString("en-IN")}
          color="green"
          {...resolvedTrend}
        />
        <StatCard
          icon={AlertTriangle}
          label={t("Escalated", "बढ़ाई गई")}
          value={escalated.toLocaleString("en-IN")}
          color="red"
          {...escalatedTrend}
          onClick={() => toggleClick("Escalated")}
          isClicked={click=== "Escalated"}
        />
        <StatCard
          icon={Clock}
          label={t("SLA Compliance", "SLA अनुपालन")}
          value={`${slaCompliance}%`}
          color="purple"
          sublabel={t("Target: 95%", "लक्ष्य: 95%")}
          {...slaTrend}
        />
        <StatCard
          icon={Star}
          label={t("Satisfaction", "संतुष्टि")}
          value={`${satisfaction}/5`}
          color="sky"
          sublabel={t("Target: 4.5", "लक्ष्य: 4.5")}
          {...satisfactionTrend}
        />
      </div>
      {click=== "Escalated" && (
        <EscalatedDetails/>
      )}
    </>
  );
}
