import React from "react";
import { Users, Activity, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import ChannelSatisfactionChart from "./components/ChannelSatisfactionChart";
import TopIssuesChart from "./components/TopIssuesChart";
import { CITIZEN_INTERACTION } from "@/lib/biharData";

export default function CitizenInteractionTab() {
  const radarData = CITIZEN_INTERACTION.channelSatisfaction.map((c) => ({
    subject: c.channel,
    A: c.satisfaction,
    B: c.volume / 5000,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Interactions"
          value={CITIZEN_INTERACTION.totalInteractions.toLocaleString(
            "en-IN",
          )}
          color="blue"
        />
        <StatCard
          icon={Users}
          label="Unique Citizens"
          value={CITIZEN_INTERACTION.uniqueCitizens.toLocaleString(
            "en-IN",
          )}
          color="green"
        />
        <StatCard
          icon={Activity}
          label="Repeat Rate"
          value={`${CITIZEN_INTERACTION.repeatRate}%`}
          color="amber"
        />
        <StatCard
          icon={TrendingUp}
          label="Satisfaction"
          value={`${CITIZEN_INTERACTION.avgResolutionSatisfaction}/5`}
          color="purple"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChannelSatisfactionChart data={radarData} xKey="subject" />
        <TopIssuesChart data={CITIZEN_INTERACTION.topIssues} xKey="issue" />
      </div>
    </div>
  );
}
