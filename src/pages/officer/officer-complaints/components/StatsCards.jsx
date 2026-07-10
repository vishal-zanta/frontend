import React from "react";
import { Search, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import StatCard from "@/components/StatCard";

export default function StatsCards({ totalAssigned, pendingAction, resolved, slaBreachRisk }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
      <StatCard icon={Search} label="Total Assigned" value={totalAssigned} color="blue" />
      <StatCard icon={Clock} label="Pending Action" value={pendingAction} color="amber" />
      <StatCard icon={CheckCircle2} label="Resolved" value={resolved} color="green" />
      <StatCard icon={AlertTriangle} label="SLA Breach Risk" value={slaBreachRisk} color="red" />
    </div>
  );
}
