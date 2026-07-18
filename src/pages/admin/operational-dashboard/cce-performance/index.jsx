import React from "react";
import { Users, Clock, TrendingUp, Activity } from "lucide-react";
import StatCard from "@/components/StatCard";
import AgentPerformanceChart from "./components/AgentPerformanceChart";
import AgentStatusChart from "./components/AgentStatusChart";
import { Badge } from "@/components/ui/badge";
import ExportButton from "@/components/ExportButton";
import { OfficerId } from "@/components/ComplaintDetailDialog";
import {
  IVR_STATS,
  AGENT_PERFORMANCE,
  HELPDESK_STATUS,
} from "@/lib/biharData";

const HELPDESK_AGENTS = [
  {
    name: "Priya Sharma",
    id: "cce-001",
    status: "On Call",
    calls: 42,
    resolved: 38,
    avgTalk: "4m 12s",
    csat: 4.5,
    shift: "Morning",
  },
  {
    name: "Amit Verma",
    id: "cce-002",
    status: "Available",
    calls: 38,
    resolved: 35,
    avgTalk: "3m 55s",
    csat: 4.3,
    shift: "Morning",
  },
  {
    name: "Neha Singh",
    id: "cce-003",
    status: "On Call",
    calls: 35,
    resolved: 32,
    avgTalk: "4m 28s",
    csat: 4.4,
    shift: "Morning",
  },
  {
    name: "Rohit Kumar",
    id: "cce-004",
    status: "Break",
    calls: 28,
    resolved: 25,
    avgTalk: "5m 02s",
    csat: 4.1,
    shift: "Afternoon",
  },
  {
    name: "Sneha Gupta",
    id: "cce-005",
    status: "Available",
    calls: 12,
    resolved: 10,
    avgTalk: "4m 15s",
    csat: 4.6,
    shift: "Full Day",
  },
  {
    name: "Manish Tiwari",
    id: "cce-006",
    status: "Offline",
    calls: 0,
    resolved: 0,
    avgTalk: "-",
    csat: 4.2,
    shift: "Night",
  },
  {
    name: "Kavita Kumari",
    id: "cce-007",
    status: "On Call",
    calls: 31,
    resolved: 28,
    avgTalk: "3m 45s",
    csat: 4.5,
    shift: "Morning",
  },
  {
    name: "Deepak Yadav",
    id: "cce-008",
    status: "Available",
    calls: 26,
    resolved: 24,
    avgTalk: "4m 30s",
    csat: 4.2,
    shift: "Afternoon",
  },
  {
    name: "Anita Singh",
    id: "cce-009",
    status: "On Call",
    calls: 29,
    resolved: 26,
    avgTalk: "4m 10s",
    csat: 4.4,
    shift: "Afternoon",
  },
  {
    name: "Vikash Prasad",
    id: "cce-010",
    status: "Available",
    calls: 22,
    resolved: 20,
    avgTalk: "3m 50s",
    csat: 4.3,
    shift: "Night",
  },
];

const agentExportColumns = [
  { key: "agent", label: "Agent" },
  { key: "calls", label: "Calls" },
  { key: "resolved", label: "Resolved" },
  { key: "avgTalkTime", label: "Avg Talk Time" },
  { key: "csat", label: "CSAT" },
  { key: "slaCompliance", label: "SLA %" },
  { key: "status", label: "Status" },
];

export default function CcePerformanceTab({ pd }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Active Agents"
          value={IVR_STATS.activeAgents}
          color="blue"
        />
        <StatCard
          icon={Clock}
          label="Avg Talk Time"
          value={IVR_STATS.avgTalkTime}
          color="amber"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg CSAT"
          value="4.3/5"
          color="green"
          sublabel="Target: 4.5"
        />
        <StatCard
          icon={Activity}
          label="SLA Compliance"
          value="95.1%"
          color="purple"
          trend="up"
          trendValue={`+0.5% (${pd.sub})`}
          sublabel="Target: 95%"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentPerformanceChart data={AGENT_PERFORMANCE} xKey="agent" />
        <AgentStatusChart data={HELPDESK_STATUS} />
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground">
            Helpdesk Agent Status Board
          </h3>
          <ExportButton
            data={HELPDESK_AGENTS}
            columns={[
              { key: "name", label: "Agent" },
              { key: "status", label: "Status" },
              { key: "calls", label: "Calls" },
              { key: "resolved", label: "Resolved" },
              { key: "avgTalk", label: "Avg Talk" },
              { key: "csat", label: "CSAT" },
              { key: "shift", label: "Shift" },
            ]}
            filename="helpdesk_agent_status"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Agent</th>
                <th className="px-4 py-2 font-medium">ID</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Calls</th>
                <th className="px-4 py-2 font-medium">Resolved</th>
                <th className="px-4 py-2 font-medium">Avg Talk</th>
                <th className="px-4 py-2 font-medium">Rating</th>
                <th className="px-4 py-2 font-medium">Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {HELPDESK_AGENTS.map((a, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-4 py-2.5 font-medium">{a.name}</td>
                  <td className="px-4 py-2.5">
                    <OfficerId id={a.id} />
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge
                      variant="outline"
                      className={`text-xs ${a.status === "Available" ? "bg-emerald-50 text-emerald-700" : a.status === "On Call" ? "bg-amber-50 text-amber-700" : a.status === "Break" ? "bg-purple-50 text-purple-700" : "bg-slate-50 text-slate-500"}`}
                    >
                      {a.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5">{a.calls}</td>
                  <td className="px-4 py-2.5 text-emerald-600">
                    {a.resolved}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {a.avgTalk}
                  </td>
                  <td className="px-4 py-2.5 text-amber-600 font-medium">
                    ★ {a.csat}/5
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {a.shift}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground">
            Agent Performance Detail
          </h3>
          <ExportButton
            data={AGENT_PERFORMANCE}
            columns={agentExportColumns}
            filename="agent_performance"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Agent</th>
                <th className="px-4 py-2 font-medium">Calls</th>
                <th className="px-4 py-2 font-medium">Resolved</th>
                <th className="px-4 py-2 font-medium">Avg Talk</th>
                <th className="px-4 py-2 font-medium">CSAT</th>
                <th className="px-4 py-2 font-medium">SLA %</th>
                <th className="px-4 py-2 font-medium">Rating</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {AGENT_PERFORMANCE.map((a, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-4 py-2.5 font-medium">{a.agent}</td>
                  <td className="px-4 py-2.5">{a.calls}</td>
                  <td className="px-4 py-2.5 text-emerald-600">
                    {a.resolved}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {a.avgTalkTime}
                  </td>
                  <td className="px-4 py-2.5 text-amber-600 font-medium">
                    ★ {a.csat}/5
                  </td>
                  <td className="px-4 py-2.5">{a.slaCompliance}%</td>
                  <td className="px-4 py-2.5 text-amber-600">
                    ★ {a.csat}/5
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge
                      variant="outline"
                      className={`text-xs ${a.status === "Online" ? "bg-emerald-50 text-emerald-700" : a.status === "On Break" ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-500"}`}
                    >
                      {a.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
