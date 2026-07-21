import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, sublabel, trend, color = "blue", trendValue }) {
  const colorMap = {
    blue:   { bg: "bg-blue-500/10",    text: "text-blue-600",    ring: "ring-blue-500/20" },
    green:  { bg: "bg-emerald-500/10", text: "text-emerald-600", ring: "ring-emerald-500/20" },
    amber:  { bg: "bg-amber-500/10",  text: "text-amber-600",   ring: "ring-amber-500/20" },
    red:    { bg: "bg-red-500/10",     text: "text-red-600",     ring: "ring-red-500/20" },
    purple: { bg: "bg-purple-500/10",  text: "text-purple-600",  ring: "ring-purple-500/20" },
    sky:    { bg: "bg-sky-500/10",     text: "text-sky-600",     ring: "ring-sky-500/20" },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-card rounded-xl border border-border p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className={`w-9 h-9 rounded-lg ${c.bg} ${c.text} flex items-center justify-center ring-2 ${c.ring}`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"
          }`}>
            {trend === "up" ? <TrendingUp className="w-3.5 h-3.5" /> : trend === "down" ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
      {sublabel && <div className="text-[11px] text-muted-foreground/70 mt-1">{sublabel}</div>}
    </div>
  );
}