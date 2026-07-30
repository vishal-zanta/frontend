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

export default function CcePerformanceTab({ pd }) {
  return (
    <div className="space-y-6">
      {/* Previous stats cards: do not change these */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={Users}
          label="Active Agents"
          value={IVR_STATS.activeAgents}
          color="blue"
        />
        <StatCard
          icon={Clock}
          label="Avg Talk Time"
          value={IVR_STATS.avgTalkTime}
          color="amber"
        />
         <StatCard
                  icon={Clock}
                  label="Calls within 15 mins"
                  value="4,786"
                  color="purple"
                />
        <StatCard
          icon={TrendingUp}
          label="Avg CSAT"
          value="4.3/5"
          color="green"
          sublabel="Target: 4.5"
        />
        <StatCard
          icon={Activity}
          label="SLA Compliance"
          value="95.1%"
          color="purple"
          trend="up"
          trendValue={`+0.5% (${pd.sub})`}
          sublabel="Target: 95%"
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
