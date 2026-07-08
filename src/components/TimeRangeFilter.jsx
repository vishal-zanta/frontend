import React from "react";

export default function TimeRangeFilter({ period, setPeriod }) {
  const options = [
    { id: "daily", label: "Today", sub: "vs yesterday" },
    { id: "weekly", label: "This Week", sub: "vs last week" },
    { id: "monthly", label: "This Month", sub: "vs last month" },
  ];
  return (
    <div className="flex items-center gap-1 bg-white border border-border rounded-lg p-0.5">
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => setPeriod(opt.id)}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${period === opt.id ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:bg-muted"}`}
          title={`Trends compared ${opt.sub}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}