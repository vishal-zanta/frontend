import React from "react";

export default function SlaAnalytics({ docs = [], rolesCount = 0 }) {
  const configured = docs.length;
  const withOfficer = docs.filter((s) => s.officer).length;
  const missingOfficer = docs.filter((s) => !s.officer).length;
  const rolesCountValue = rolesCount;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="text-2xl font-bold text-blue-600">{configured}</div>
        <div className="text-sm text-muted-foreground">Sub-services Configured</div>
      </div>
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="text-2xl font-bold text-emerald-600">{withOfficer}</div>
        <div className="text-sm text-muted-foreground">With Officer Assigned</div>
      </div>
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="text-2xl font-bold text-amber-600">{missingOfficer}</div>
        <div className="text-sm text-muted-foreground">Missing Officer</div>
      </div>
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="text-2xl font-bold text-purple-600">{rolesCountValue}</div>
        <div className="text-sm text-muted-foreground">Escalation Levels</div>
      </div>
    </div>
  );
}
