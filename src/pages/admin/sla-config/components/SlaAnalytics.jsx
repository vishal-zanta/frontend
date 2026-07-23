import React from "react";
import StatCard from "@/components/StatCard";

export default function SlaAnalytics({ docs = [], rolesCount = 0 }) {
  const configured = docs.length;
  const withOfficer = docs.filter((s) => s.officer).length;
  const missingOfficer = docs.filter((s) => !s.officer).length;
  const rolesCountValue = rolesCount;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        color="blue"
        value={configured}
        label="Sub-services Configured"
      />
      <StatCard
        color="emerald"
        value={withOfficer}
        label="With Officer Assigned"
      />
      <StatCard
        color="amber"
        value={missingOfficer}
        label="Missing Officer"
      />
      <StatCard
        color="purple"
        value={rolesCountValue}
        label="Escalation Levels"
      />
    </div>
  );
}
