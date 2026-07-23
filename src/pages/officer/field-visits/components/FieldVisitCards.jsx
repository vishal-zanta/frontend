import React from "react";
import StatCard from "@/components/StatCard";

export default function FieldVisitCards({ data = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        color="blue"
        value={data.length}
        label="Total Visits"
      />
      <StatCard
        color="amber"
        value={data.filter((f) => f.status === "Scheduled").length}
        label="Scheduled"
      />
      <StatCard
        color="purple"
        value={data.filter((f) => f.status === "In Progress").length}
        label="In Progress"
      />
      <StatCard
        color="emerald"
        value={data.filter((f) => f.status === "Completed").length}
        label="Completed"
      />
    </div>
  );
}
