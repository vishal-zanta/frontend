import React from "react";
import { Activity, Clock, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import GrievanceFlowChart from "./components/GrievanceFlowChart";

export default function GrievanceTab({ pd }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Activity}
          label="Active Tickets"
          value={pd.activeTickets.toLocaleString("en-IN")}
          color="blue"
        />
        <StatCard
          icon={Clock}
          label="Pending Assignment"
          value={pd.pendingAssignment.toLocaleString("en-IN")}
          color="amber"
        />
        <StatCard
          icon={TrendingUp}
          label={`Resolved (${pd.label})`}
          value={pd.resolvedToday.toLocaleString("en-IN")}
          color="green"
        />
        <StatCard
          icon={Activity}
          label="Escalated"
          value={pd.escalated.toLocaleString("en-IN")}
          color="red"
        />
      </div>
      <GrievanceFlowChart
        data={pd.grievanceChart}
        xKey={pd.grievanceXKey}
        label={pd.label}
      />
    </div>
  );
}
