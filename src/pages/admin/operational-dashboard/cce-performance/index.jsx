import React from "react";
import { Users, Clock, TrendingUp, Activity } from "lucide-react";
import RealTimeStats from "./components/RealTimeStats";
import InboundCallMetrics from "./components/InboundCallMetrics";
import StatCard from "@/components/StatCard";
import AgentPerformanceChart from "./components/AgentPerformanceChart";
import AgentStatusChart from "./components/AgentStatusChart";
import HelpdeskAgentStatusBoard from "./components/HelpdeskAgentStatusBoard";
import AgentPerformanceDetailTable from "./components/AgentPerformanceDetailTable";
import { IVR_STATS, AGENT_PERFORMANCE, HELPDESK_STATUS } from "@/lib/biharData";
import { useLanguage } from "@/context/LanguageContext";

export default function CcePerformanceTab({ pd }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      {/* Previous stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={Users}
          label={t("Active Agents", "सक्रिय एजेंट")}
          value={IVR_STATS.activeAgents}
          color="blue"
        />
        <StatCard
          icon={Clock}
          label={t("Avg Talk Time", "औसत बात का समय")}
          value={IVR_STATS.avgTalkTime}
          color="amber"
        />
         <StatCard
                  icon={Clock}
                  label={t("Calls within 15 mins", "15 मिनट के भीतर कॉल")}
                  value="4,786"
                  color="purple"
                />
        <StatCard
          icon={TrendingUp}
          label={t("Avg CSAT", "औसत संतुष्टि (CSAT)")}
          value="4.3/5"
          color="green"
          sublabel={t("Target: 4.5", "लक्ष्य: 4.5")}
        />
        <StatCard
          icon={Activity}
          label={t("SLA Compliance", "SLA अनुपालन")}
          value="95.1%"
          color="purple"
          trend="up"
          trendValue={`+0.5% (${pd.sub})`}
          sublabel={t("Target: 95%", "लक्ष्य: 95%")}
        />
      </div>

      {/* New Real-Time & In-Bound Metrics Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentPerformanceChart data={AGENT_PERFORMANCE} xKey="agent" />
        <AgentStatusChart data={HELPDESK_STATUS} />
      </div>

      <HelpdeskAgentStatusBoard />
      <AgentPerformanceDetailTable data={AGENT_PERFORMANCE} />

      <RealTimeStats />
      <InboundCallMetrics />
    </div>
  );
}
