import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Phone, Users, Clock, Activity, BarChart3, Server, PhoneCall, PhoneMissed, TrendingUp, AlertTriangle, CheckCircle2, Database, Wifi, Cpu, HardDrive, MapPin } from "lucide-react";
import { IVR_STATS, HOURLY_DISPOSITION, AGENT_PERFORMANCE, HELPDESK_STATUS, SLA_PERFORMANCE, CITIZEN_INTERACTION, SYSTEM_HEALTH, DAILY_VOLUME, WEEKLY_VOLUME, MONTHLY_VOLUME } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import StatCard from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard, LineChartCard, PieChartCard, AreaChartCard, RadarChartCard } from "@/components/Charts";
import { Badge } from "@/components/ui/badge";
import ExportButton from "@/components/ExportButton";
import TimeRangeFilter from "@/components/TimeRangeFilter";
import { OfficerId } from "@/components/ComplaintDetailDialog";

const HELPDESK_AGENTS = [
  { name: "Priya Sharma", id: "cce-001", status: "On Call", calls: 42, resolved: 38, avgTalk: "4m 12s", csat: 4.5, shift: "Morning" },
  { name: "Amit Verma", id: "cce-002", status: "Available", calls: 38, resolved: 35, avgTalk: "3m 55s", csat: 4.3, shift: "Morning" },
  { name: "Neha Singh", id: "cce-003", status: "On Call", calls: 35, resolved: 32, avgTalk: "4m 28s", csat: 4.4, shift: "Morning" },
  { name: "Rohit Kumar", id: "cce-004", status: "Break", calls: 28, resolved: 25, avgTalk: "5m 02s", csat: 4.1, shift: "Afternoon" },
  { name: "Sneha Gupta", id: "cce-005", status: "Available", calls: 12, resolved: 10, avgTalk: "4m 15s", csat: 4.6, shift: "Full Day" },
  { name: "Manish Tiwari", id: "cce-006", status: "Offline", calls: 0, resolved: 0, avgTalk: "—", csat: 4.2, shift: "Night" },
  { name: "Kavita Kumari", id: "cce-007", status: "On Call", calls: 31, resolved: 28, avgTalk: "3m 45s", csat: 4.5, shift: "Morning" },
  { name: "Deepak Yadav", id: "cce-008", status: "Available", calls: 26, resolved: 24, avgTalk: "4m 30s", csat: 4.2, shift: "Afternoon" },
  { name: "Anita Singh", id: "cce-009", status: "On Call", calls: 29, resolved: 26, avgTalk: "4m 10s", csat: 4.4, shift: "Afternoon" },
  { name: "Vikash Prasad", id: "cce-010", status: "Available", calls: 22, resolved: 20, avgTalk: "3m 50s", csat: 4.3, shift: "Night" },
];

const API_ENDPOINTS = [
  { name: "Complaint Service API", endpoint: "/api/v1/complaints", status: "Operational", responseTime: "142ms", uptime: "99.97%", lastError: "None" },
  { name: "User Auth Service API", endpoint: "/api/v1/auth", status: "Operational", responseTime: "89ms", uptime: "99.99%", lastError: "None" },
  { name: "SMS Gateway API", endpoint: "/api/v1/sms/send", status: "Operational", responseTime: "320ms", uptime: "99.85%", lastError: "03 Jul, 14:22" },
  { name: "Email Service API", endpoint: "/api/v1/email/send", status: "Degraded", responseTime: "2,140ms", uptime: "98.20%", lastError: "06 Jul, 09:15" },
  { name: "IVR Service API", endpoint: "/api/v1/ivr/call", status: "Operational", responseTime: "210ms", uptime: "99.92%", lastError: "None" },
  { name: "File Upload API", endpoint: "/api/v1/upload", status: "Operational", responseTime: "450ms", uptime: "99.80%", lastError: "05 Jul, 18:30" },
  { name: "Geo-Tag Service API", endpoint: "/api/v1/geo/tag", status: "Down", responseTime: "—", uptime: "97.50%", lastError: "07 Jul, 08:42 (Ongoing)" },
  { name: "Notification Service API", endpoint: "/api/v1/notify", status: "Operational", responseTime: "180ms", uptime: "99.90%", lastError: "None" },
  { name: "Analytics API", endpoint: "/api/v1/analytics", status: "Degraded", responseTime: "1,820ms", uptime: "98.50%", lastError: "06 Jul, 22:10" },
  { name: "AI Chatbot API", endpoint: "/api/v1/ai/chat", status: "Operational", responseTime: "1,200ms", uptime: "99.70%", lastError: "04 Jul, 11:05" },
];

const statusBadge = (status) => {
  if (status === "Operational") return <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700">{"● " + status}</Badge>;
  if (status === "Degraded") return <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700">{"● " + status}</Badge>;
  return <Badge variant="outline" className="text-xs bg-red-50 text-red-700">{"● " + status}</Badge>;
};

const agentExportColumns = [
  { key: "agent", label: "Agent" },
  { key: "calls", label: "Calls" },
  { key: "resolved", label: "Resolved" },
  { key: "avgTalkTime", label: "Avg Talk Time" },
  { key: "csat", label: "CSAT" },
  { key: "slaCompliance", label: "SLA %" },
  { key: "status", label: "Status" },
];

const slaExportColumns = [
  { key: "service", label: "Service" },
  { key: "withinSLA", label: "Within SLA" },
  { key: "beyondSLA", label: "Beyond SLA" },
  { key: "compliance", label: "Compliance %" },
];

const tabs = [
  { id: "call-volume", label: "Call Volume & Traffic", icon: Phone },
  { id: "cce-performance", label: "CCE Performance", icon: Users },
  { id: "sla-performance", label: "Service Level Performance", icon: Clock },
  { id: "grievance", label: "Grievance & Ticket Management", icon: Activity },
  { id: "citizen-interaction", label: "Citizen Interaction Analytics", icon: BarChart3 },
  { id: "system", label: "System & Infrastructure", icon: Server },
];

export default function OperationalDashboards() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "call-volume";
  const [period, setPeriod] = useState("daily");
  const activeTab = tabs.find(t => t.id === tab);

  const periodData = {
    daily: {
      label: "Today", sub: "vs yesterday",
      calls: IVR_STATS.totalCallsToday, answered: IVR_STATS.callsAnswered, missed: IVR_STATS.callsMissed,
      successRate: IVR_STATS.successRate, avgWaitTime: IVR_STATS.avgWaitTime, peakHour: IVR_STATS.peakHour,
      chartData: HOURLY_DISPOSITION, chartXKey: "hour", chartXLabel: "Hour",
      activeTickets: 3841, pendingAssignment: 412, resolvedToday: 143, escalated: 537,
      grievanceChart: DAILY_VOLUME, grievanceXKey: "label",
    },
    weekly: {
      label: "This Week", sub: "vs last week",
      calls: IVR_STATS.totalCallsToday * 7, answered: IVR_STATS.callsAnswered * 7, missed: IVR_STATS.callsMissed * 7,
      successRate: 94.2, avgWaitTime: "42s", peakHour: "Mon 10:00–11:00 AM",
      chartData: WEEKLY_VOLUME.map(w => ({ hour: w.week, calls: w.raised, answered: w.resolved })), chartXKey: "hour", chartXLabel: "Week",
      activeTickets: 4210, pendingAssignment: 580, resolvedToday: 890, escalated: 620,
      grievanceChart: WEEKLY_VOLUME, grievanceXKey: "week",
    },
    monthly: {
      label: "This Month", sub: "vs last month",
      calls: IVR_STATS.totalCallsToday * 30, answered: IVR_STATS.callsAnswered * 30, missed: IVR_STATS.callsMissed * 30,
      successRate: 93.8, avgWaitTime: "45s", peakHour: "Jul 10:00–11:00 AM",
      chartData: MONTHLY_VOLUME.map(m => ({ hour: m.month, calls: m.raised, answered: m.resolved })), chartXKey: "hour", chartXLabel: "Month",
      activeTickets: 5230, pendingAssignment: 1240, resolvedToday: 3890, escalated: 890,
      grievanceChart: MONTHLY_VOLUME, grievanceXKey: "month",
    },
  };
  const pd = periodData[period];

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Operational Dashboard — {activeTab?.label}</h1>
            <p className="text-sm text-muted-foreground">Real-time operational metrics across call centre, SLA, grievances, and infrastructure</p>
          </div>
          <TimeRangeFilter period={period} setPeriod={setPeriod} />
        </div>

        {/* Call Volume */}
        {tab === "call-volume" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={PhoneCall} label={`Total Calls (${pd.label})`} value={pd.calls.toLocaleString("en-IN")} color="blue" trend="up" trendValue={`+8% (${pd.sub})`} />
              <StatCard icon={PhoneMissed} label="Missed Calls" value={pd.missed.toLocaleString("en-IN")} color="red" trend="down" trendValue={`-3% (${pd.sub})`} />
              <StatCard icon={Clock} label="Avg Wait Time" value={pd.avgWaitTime} color="amber" />
              <StatCard icon={TrendingUp} label="Success Rate" value={`${pd.successRate}%`} color="green" trend="up" trendValue={`+1.2% (${pd.sub})`} sublabel="Target: 95%" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title={`Call Traffic (${pd.label})`} subtitle="Calls received vs answered">
                <BarChartCard data={pd.chartData} xKey={pd.chartXKey} bars={[{ key: "calls", label: "Received", color: "#1d4ed8" }, { key: "answered", label: "Answered", color: "#22c55e" }]} />
              </ChartCard>
              <ChartCard title="IVR Completion vs Drop-off" subtitle="IVR funnel analysis">
                <PieChartCard data={[
                  { name: "IVR Completed", value: Math.round(pd.calls * 0.87), color: "#22c55e" },
                  { name: "Transferred to Agent", value: Math.round(pd.calls * 0.064), color: "#f59e0b" },
                  { name: "Dropped in IVR", value: Math.round(pd.calls * 0.066), color: "#ef4444" },
                ]} />
              </ChartCard>
            </div>
            <ChartCard title="Peak Hour Analysis" subtitle={`Peak hour: ${pd.peakHour}`}>
              <LineChartCard data={pd.chartData} xKey={pd.chartXKey} lines={[{ key: "calls", label: "Incoming", color: "#1d4ed8" }, { key: "answered", label: "Answered", color: "#22c55e" }]} />
            </ChartCard>
          </div>
        )}

        {/* CCE Performance */}
        {tab === "cce-performance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Active Agents" value={IVR_STATS.activeAgents} color="blue" />
              <StatCard icon={Clock} label="Avg Talk Time" value={IVR_STATS.avgTalkTime} color="amber" />
              <StatCard icon={TrendingUp} label="Avg CSAT" value="4.3/5" color="green" sublabel="Target: 4.5" />
              <StatCard icon={Activity} label="SLA Compliance" value="95.1%" color="purple" trend="up" trendValue={`+0.5% (${pd.sub})`} sublabel="Target: 95%" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Agent Performance Comparison" subtitle="Calls handled by agent">
                <BarChartCard data={AGENT_PERFORMANCE} xKey="agent" bars={[{ key: "calls", label: "Total Calls", color: "#1d4ed8" }, { key: "resolved", label: "Resolved", color: "#22c55e" }]} />
              </ChartCard>
              <ChartCard title="Helpdesk Agent Status" subtitle="Live agent availability">
                <PieChartCard data={HELPDESK_STATUS} />
              </ChartCard>
            </div>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground">Helpdesk Agent Status Board</h3>
                <ExportButton data={HELPDESK_AGENTS} columns={[{ key: "name", label: "Agent" }, { key: "status", label: "Status" }, { key: "calls", label: "Calls" }, { key: "resolved", label: "Resolved" }, { key: "avgTalk", label: "Avg Talk" }, { key: "csat", label: "CSAT" }, { key: "shift", label: "Shift" }]} filename="helpdesk_agent_status" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-4 py-2 font-medium">Agent</th><th className="px-4 py-2 font-medium">ID</th><th className="px-4 py-2 font-medium">Status</th><th className="px-4 py-2 font-medium">Calls</th><th className="px-4 py-2 font-medium">Resolved</th><th className="px-4 py-2 font-medium">Avg Talk</th><th className="px-4 py-2 font-medium">Rating</th><th className="px-4 py-2 font-medium">Shift</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {HELPDESK_AGENTS.map((a, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{a.name}</td>
                        <td className="px-4 py-2.5"><OfficerId id={a.id} /></td>
                        <td className="px-4 py-2.5"><Badge variant="outline" className={`text-xs ${a.status === "Available" ? "bg-emerald-50 text-emerald-700" : a.status === "On Call" ? "bg-amber-50 text-amber-700" : a.status === "Break" ? "bg-purple-50 text-purple-700" : "bg-slate-50 text-slate-500"}`}>{a.status}</Badge></td>
                        <td className="px-4 py-2.5">{a.calls}</td>
                        <td className="px-4 py-2.5 text-emerald-600">{a.resolved}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{a.avgTalk}</td>
                        <td className="px-4 py-2.5 text-amber-600 font-medium">★ {a.csat}/5</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{a.shift}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between"><h3 className="font-bold text-foreground">Agent Performance Detail</h3><ExportButton data={AGENT_PERFORMANCE} columns={agentExportColumns} filename="agent_performance" /></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-4 py-2 font-medium">Agent</th><th className="px-4 py-2 font-medium">Calls</th><th className="px-4 py-2 font-medium">Resolved</th>
                      <th className="px-4 py-2 font-medium">Avg Talk</th><th className="px-4 py-2 font-medium">CSAT</th><th className="px-4 py-2 font-medium">SLA %</th><th className="px-4 py-2 font-medium">Rating</th><th className="px-4 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {AGENT_PERFORMANCE.map((a, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{a.agent}</td>
                        <td className="px-4 py-2.5">{a.calls}</td><td className="px-4 py-2.5 text-emerald-600">{a.resolved}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{a.avgTalkTime}</td>
                        <td className="px-4 py-2.5 text-amber-600 font-medium">★ {a.csat}/5</td>
                        <td className="px-4 py-2.5">{a.slaCompliance}%</td>
                        <td className="px-4 py-2.5 text-amber-600">★ {a.csat}/5</td>
                        <td className="px-4 py-2.5"><Badge variant="outline" className={`text-xs ${a.status === "Online" ? "bg-emerald-50 text-emerald-700" : a.status === "On Break" ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-500"}`}>{a.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SLA Performance */}
        {tab === "sla-performance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Clock} label="Within SLA" value="38,290" color="green" />
              <StatCard icon={Activity} label="Beyond SLA" value="1,953" color="red" />
              <StatCard icon={TrendingUp} label="Compliance Rate" value="95.1%" color="blue" sublabel="Target: 95%" />
              <StatCard icon={BarChart3} label="Worst Service" value="Road (86.8%)" color="amber" />
            </div>
            <ChartCard title="SLA Compliance by Service" subtitle="Within vs beyond SLA per service category">
              <BarChartCard data={SLA_PERFORMANCE} xKey="service" bars={[{ key: "withinSLA", label: "Within SLA", color: "#22c55e" }, { key: "beyondSLA", label: "Beyond SLA", color: "#ef4444" }]} height={320} />
            </ChartCard>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between"><h3 className="font-bold text-foreground">SLA Performance Detail</h3><ExportButton data={SLA_PERFORMANCE} columns={slaExportColumns} filename="sla_performance" /></div>
              <table className="w-full text-sm">
                <thead className="bg-muted/50"><tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Service</th><th className="px-4 py-2 font-medium text-right">Within SLA</th><th className="px-4 py-2 font-medium text-right">Beyond SLA</th><th className="px-4 py-2 font-medium text-right">Compliance %</th><th className="px-4 py-2 font-medium text-right">Benchmark</th>
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {SLA_PERFORMANCE.map((s, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-medium">{s.service}</td>
                      <td className="px-4 py-2.5 text-right text-emerald-600">{s.withinSLA.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-2.5 text-right text-red-600">{s.beyondSLA}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`font-bold ${s.compliance >= 95 ? "text-emerald-600" : s.compliance >= 90 ? "text-amber-600" : "text-red-600"}`}>{s.compliance}%</span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-xs text-muted-foreground">Target: 95% | {s.compliance >= 95 ? "✓ Met" : `${(95 - s.compliance).toFixed(1)}% below`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grievance Management */}
        {tab === "grievance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Activity} label="Active Tickets" value={pd.activeTickets.toLocaleString("en-IN")} color="blue" />
              <StatCard icon={Clock} label="Pending Assignment" value={pd.pendingAssignment.toLocaleString("en-IN")} color="amber" />
              <StatCard icon={TrendingUp} label={`Resolved (${pd.label})`} value={pd.resolvedToday.toLocaleString("en-IN")} color="green" />
              <StatCard icon={Activity} label="Escalated" value={pd.escalated.toLocaleString("en-IN")} color="red" />
            </div>
            <ChartCard title={`Grievance Flow (${pd.label})`} subtitle="Raised vs resolved vs pending">
              <AreaChartCard data={pd.grievanceChart} xKey={pd.grievanceXKey} areas={[{ key: "raised", label: "Raised", color: "#1d4ed8" }, { key: "resolved", label: "Resolved", color: "#22c55e" }, { key: "pending", label: "Pending", color: "#f59e0b" }]} height={320} />
            </ChartCard>
          </div>
        )}

        {/* Citizen Interaction */}
        {tab === "citizen-interaction" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Interactions" value={CITIZEN_INTERACTION.totalInteractions.toLocaleString("en-IN")} color="blue" />
              <StatCard icon={Users} label="Unique Citizens" value={CITIZEN_INTERACTION.uniqueCitizens.toLocaleString("en-IN")} color="green" />
              <StatCard icon={Activity} label="Repeat Rate" value={`${CITIZEN_INTERACTION.repeatRate}%`} color="amber" />
              <StatCard icon={TrendingUp} label="Satisfaction" value={`${CITIZEN_INTERACTION.avgResolutionSatisfaction}/5`} color="purple" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Channel Satisfaction" subtitle="CSAT by communication channel">
                <RadarChartCard data={CITIZEN_INTERACTION.channelSatisfaction.map(c => ({ subject: c.channel, A: c.satisfaction, B: c.volume / 5000 }))} xKey="subject" series={[{ key: "A", label: "Satisfaction", color: "#1d4ed8" }, { key: "B", label: "Volume (scaled)", color: "#22c55e" }]} />
              </ChartCard>
              <ChartCard title="Top Issues by Volume" subtitle="Most frequently raised complaints">
                <BarChartCard data={CITIZEN_INTERACTION.topIssues} xKey="issue" bars={[{ key: "interactions", label: "Interactions", color: "#0ea5e9" }]} legend={false} />
              </ChartCard>
            </div>
          </div>
        )}

        {/* System & Infrastructure */}
        {tab === "system" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <StatCard icon={Server} label="Uptime" value={SYSTEM_HEALTH.uptime} color="green" sublabel="Target: 99.9%" />
              <StatCard icon={Activity} label="API Response" value={SYSTEM_HEALTH.apiResponseTime} color="blue" sublabel="Target: <200ms" />
              <StatCard icon={Users} label="Active Sessions" value={SYSTEM_HEALTH.activeSessions} color="purple" />
              <StatCard icon={Cpu} label="CPU Usage" value={`${SYSTEM_HEALTH.cpuUsage}%`} color="amber" sublabel="Threshold: 80%" />
              <StatCard icon={HardDrive} label="Memory" value={`${SYSTEM_HEALTH.memoryUsage}%`} color="blue" sublabel="Threshold: 85%" />
              <StatCard icon={Database} label="DB Connections" value={`${SYSTEM_HEALTH.dbConnections}/100`} color="purple" sublabel="Pool: 100" />
            </div>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground flex items-center gap-2"><Activity className="w-5 h-5 text-blue-500" /> API Endpoint Health</h3>
                <ExportButton data={API_ENDPOINTS} columns={[{ key: "name", label: "Service" }, { key: "endpoint", label: "Endpoint" }, { key: "status", label: "Status" }, { key: "responseTime", label: "Response" }, { key: "uptime", label: "Uptime" }, { key: "lastError", label: "Last Error" }]} filename="api_health" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-4 py-2 font-medium">Service</th><th className="px-4 py-2 font-medium">Endpoint</th><th className="px-4 py-2 font-medium">Status</th><th className="px-4 py-2 font-medium text-right">Response Time</th><th className="px-4 py-2 font-medium text-right">Uptime</th><th className="px-4 py-2 font-medium">Last Error</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {API_ENDPOINTS.map((api, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{api.name}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{api.endpoint}</td>
                        <td className="px-4 py-2.5">{statusBadge(api.status)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs">{api.responseTime}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs">{api.uptime}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{api.lastError}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="System Resource Usage" subtitle="CPU, Memory & DB connection utilization">
                <BarChartCard data={[
                  { name: "CPU", usage: SYSTEM_HEALTH.cpuUsage, limit: 100 },
                  { name: "Memory", usage: SYSTEM_HEALTH.memoryUsage, limit: 100 },
                  { name: "DB Conn", usage: Math.round(SYSTEM_HEALTH.dbConnections / 100 * 100), limit: 100 },
                ]} xKey="name" bars={[{ key: "usage", label: "Usage %", color: "#1d4ed8" }]} legend={false} />
              </ChartCard>
              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="font-bold text-foreground mb-3">Service Status</h3>
                <div className="space-y-2">
                  {[
                    { name: "SMS Gateway", status: SYSTEM_HEALTH.smsGateway, icon: Phone },
                    { name: "Email Service", status: SYSTEM_HEALTH.emailService, icon: Activity },
                    { name: "IVR Service", status: SYSTEM_HEALTH.ivrService, icon: PhoneCall },
                    { name: "Mobile App Sync", status: SYSTEM_HEALTH.mobileAppSync, icon: Wifi },
                    { name: "Geo-Tag Service", status: "Down", icon: MapPin },
                    { name: "Analytics API", status: "Degraded", icon: BarChart3 },
                  ].map((s, i) => {
                    const SIcon = s.icon;
                    return (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-2">
                          <SIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{s.name}</span>
                        </div>
                        {statusBadge(s.status)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Server className="w-5 h-5 text-blue-500" /> Infrastructure Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg"><div className="text-xs text-muted-foreground">Storage Used</div><div className="text-lg font-bold text-foreground">{SYSTEM_HEALTH.storageUsed}</div><div className="mt-1 w-full bg-border rounded-full h-1.5"><div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "48%" }}></div></div></div>
                <div className="p-3 bg-muted/50 rounded-lg"><div className="text-xs text-muted-foreground">CPU Usage</div><div className="text-lg font-bold text-foreground">{SYSTEM_HEALTH.cpuUsage}%</div><div className="mt-1 w-full bg-border rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${SYSTEM_HEALTH.cpuUsage}%` }}></div></div></div>
                <div className="p-3 bg-muted/50 rounded-lg"><div className="text-xs text-muted-foreground">Memory Usage</div><div className="text-lg font-bold text-foreground">{SYSTEM_HEALTH.memoryUsage}%</div><div className="mt-1 w-full bg-border rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${SYSTEM_HEALTH.memoryUsage}%` }}></div></div></div>
                <div className="p-3 bg-muted/50 rounded-lg"><div className="text-xs text-muted-foreground">DB Connection Pool</div><div className="text-lg font-bold text-foreground">{SYSTEM_HEALTH.dbConnections} / 100</div><div className="mt-1 w-full bg-border rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${SYSTEM_HEALTH.dbConnections}%` }}></div></div></div>
                <div className="p-3 bg-muted/50 rounded-lg"><div className="text-xs text-muted-foreground">API Avg Response</div><div className="text-lg font-bold text-foreground">{SYSTEM_HEALTH.apiResponseTime}</div><div className="text-xs text-emerald-600 mt-1">Within target (&lt;200ms)</div></div>
                <div className="p-3 bg-muted/50 rounded-lg"><div className="text-xs text-muted-foreground">System Uptime (30d)</div><div className="text-lg font-bold text-foreground">{SYSTEM_HEALTH.uptime}</div><div className="text-xs text-emerald-600 mt-1">Exceeds target (99.9%)</div></div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="font-bold text-foreground flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Recent System Errors &amp; Alerts</h3>
              </div>
              <div className="divide-y divide-border">
                {[
                  { time: "07 Jul, 08:42", severity: "Critical", service: "Geo-Tag Service API", message: "Service down — geolocation tagging unavailable for new complaints. Engineering team notified.", color: "text-red-600 bg-red-50" },
                  { time: "06 Jul, 22:10", severity: "Warning", service: "Analytics API", message: "Response time degraded (1,820ms vs 200ms baseline). Investigating database query performance.", color: "text-amber-600 bg-amber-50" },
                  { time: "06 Jul, 09:15", severity: "Warning", service: "Email Service API", message: "SMTP connection timeout — retrying. Some notification emails may be delayed.", color: "text-amber-600 bg-amber-50" },
                  { time: "05 Jul, 18:30", severity: "Resolved", service: "File Upload API", message: "Storage tier temporarily unavailable — resolved after 12 minutes. No data loss.", color: "text-emerald-600 bg-emerald-50" },
                  { time: "04 Jul, 11:05", severity: "Resolved", service: "AI Chatbot API", message: "LLM provider rate limit hit — request queue backed up for 8 minutes. Auto-scaled.", color: "text-emerald-600 bg-emerald-50" },
                ].map((err, i) => (
                  <div key={i} className="px-5 py-3 flex items-start gap-3">
                    <div className={`px-2 py-1 rounded text-[10px] font-bold ${err.color}`}>{err.severity}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{err.service}</span>
                        <span className="text-xs text-muted-foreground">{err.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{err.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}