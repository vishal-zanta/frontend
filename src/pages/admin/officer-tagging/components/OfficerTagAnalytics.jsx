import React from "react";
import StatCard from "@/components/StatCard";

export default function OfficerTagAnalytics({ tagging = [], officers = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        color="blue"
        value={officers.filter((o) => o.designation === "l1-officer").length}
        label="L1 Officers"
      />
      <StatCard
        color="purple"
        value={officers.filter((o) => o.designation === "l2-officer").length}
        label="L2 Officers"
      />
      <StatCard
        color="emerald"
        value={tagging.filter((o) => o.slaCompliant).length}
        label="SLA Compliant"
      />
      <StatCard
        color="red"
        value={tagging.filter((o) => !o.slaCompliant).length}
        label="SLA Breach Risk"
      />
    </div>
  );
}
