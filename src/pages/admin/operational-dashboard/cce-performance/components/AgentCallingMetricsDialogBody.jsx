import React from "react";
import {
  PhoneCall,
  CheckCircle2,
  Clock,
  Timer,
  Star,
  ShieldCheck,
  PhoneOff,
  FileText,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AgentCallingMetricsDialogBody({ agent }) {
  if (!agent) return null;

  const totalCalls = agent.calls ?? 42;
  const resolvedCalls = agent.resolved ?? 38;
  const resolutionPercentage = totalCalls > 0 ? Math.round((resolvedCalls / totalCalls) * 100) : 0;

  const metrics = [
    {
      label: "Total Calls Handled",
      value: totalCalls,
      subtext: "Today's shift",
      icon: PhoneCall,
      color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Calls Resolved (FCR)",
      value: resolvedCalls,
      subtext: `${resolutionPercentage}% Resolution Rate`,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Avg Talk Time (AHT)",
      value: agent.avgTalk || agent.avgTalkTime || "4m 12s",
      subtext: "Target < 4m 30s",
      icon: Clock,
      color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Avg Hold Time",
      value: "35s",
      subtext: "Within 45s threshold",
      icon: Timer,
      color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "CSAT Rating",
      value: `★ ${agent.csat || "4.5"}/5`,
      subtext: "Based on 34 reviews",
      icon: Star,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "SLA Compliance",
      value: `${agent.slaCompliance || "96.2"}%`,
      subtext: "Target: 95%",
      icon: ShieldCheck,
      color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      label: "Missed / Abandoned",
      value: "2",
      subtext: "4.8% Abandonment Rate",
      icon: PhoneOff,
      color: "text-red-600 bg-red-500/10 border-red-500/20",
    },
    {
      label: "After Call Work (ACW)",
      value: "45s",
      subtext: "Wrap-up & notes time",
      icon: FileText,
      color: "text-sky-600 bg-sky-500/10 border-sky-500/20",
    },
  ];

  return (
    <div className="space-y-4 mb-4">
      {/* Header Info */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-base">
              {agent.name || agent.agent}
            </h4>
            <span className="text-xs text-muted-foreground">
              Agent ID: {agent.id || "cce-001"} • Shift: {agent.shift || "Morning"}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`text-xs ${
            agent.status === "Available" || agent.status === "Online"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : agent.status === "On Call"
                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                : agent.status === "Break" || agent.status === "On Break"
                  ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                  : "bg-muted/50 text-muted-foreground"
          }`}
        >
          {agent.status || "Active"}
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="p-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground font-medium">
                  {m.label}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center ${m.color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">
                  {m.value}
                </div>
                <div className="text-[11px] text-muted-foreground/80 mt-0.5">
                  {m.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
