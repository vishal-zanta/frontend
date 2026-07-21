import React from "react";

export default function FieldVisitCards({ data = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="text-2xl font-bold text-blue-600">{data.length}</div>
        <div className="text-sm text-muted-foreground">Total Visits</div>
      </div>
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="text-2xl font-bold text-amber-600">
          {data.filter((f) => f.status === "Scheduled").length}
        </div>
        <div className="text-sm text-muted-foreground">Scheduled</div>
      </div>
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="text-2xl font-bold text-purple-600">
          {data.filter((f) => f.status === "In Progress").length}
        </div>
        <div className="text-sm text-muted-foreground">In Progress</div>
      </div>
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="text-2xl font-bold text-emerald-600">
          {data.filter((f) => f.status === "Completed").length}
        </div>
        <div className="text-sm text-muted-foreground">Completed</div>
      </div>
    </div>
  );
}
