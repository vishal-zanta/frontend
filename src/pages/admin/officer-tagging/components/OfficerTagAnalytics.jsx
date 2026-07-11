import React from "react";

export default function OfficerTagAnalytics({ tagging = [], officers = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="text-2xl font-bold text-blue-600">
          {officers.filter((o) => o.designation === "l1-officer").length}
        </div>
        <div className="text-sm text-muted-foreground">L1 Officers</div>
      </div>
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="text-2xl font-bold text-purple-600">
          {officers.filter((o) => o.designation === "l2-officer").length}
        </div>
        <div className="text-sm text-muted-foreground">L2 Officers</div>
      </div>
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="text-2xl font-bold text-emerald-600">
          {tagging.filter((o) => o.slaCompliant).length}
        </div>
        <div className="text-sm text-muted-foreground">SLA Compliant</div>
      </div>
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="text-2xl font-bold text-red-600">
          {tagging.filter((o) => !o.slaCompliant).length}
        </div>
        <div className="text-sm text-muted-foreground">SLA Breach Risk</div>
      </div>
    </div>
  );
}
