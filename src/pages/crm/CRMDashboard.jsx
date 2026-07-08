import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Clock, CheckCircle2, Users, TrendingUp, Headphones, ArrowRight, BarChart3, Activity, Star, AlertTriangle, Inbox, Ticket, PhoneMissed } from "lucide-react";
import { IVR_STATS, CALL_TRACKER, AGENT_PERFORMANCE, HOURLY_DISPOSITION, CRM_AGENTS } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { usePortalProfile } from "@/hooks/usePortalProfile";
import StatCard from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard, PieChartCard } from "@/components/Charts";
import { ComplaintId, CallId } from "@/components/ComplaintDetailDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CCE_SCORECARD = {
  daily: { calls: 42, answered: 40, missed: 2, ticketsRaised: 38, resolved: 38, avgTalk: "4m 12s", csat: 4.5, sla: 96.2, label: "Today", sub: "vs yesterday" },
  weekly: { calls: 298, answered: 282, missed: 16, ticketsRaised: 265, resolved: 260, avgTalk: "4m 18s", csat: 4.4, sla: 95.8, label: "This Week", sub: "vs last week" },
  monthly: { calls: 1240, answered: 1180, missed: 60, ticketsRaised: 1120, resolved: 1090, avgTalk: "4m 22s", csat: 4.5, sla: 96.0, label: "This Month", sub: "vs last month" },
};

const agentName = "Priya Sharma";

export default function CRMDashboard() {
  const [profile] = usePortalProfile("crm");
  const isSupervisor = profile === "supervisor";
  const [scorecardPeriod, setScorecardPeriod] = useState("daily");

  if (isSupervisor) {
    return (
      <PortalLayout role="crm">
        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Supervisor Dashboard</h1>
                <p className="text-white/80 text-sm">Call centre performance overview • Shift: Full Day (08:00-20:00) • Supervisor: Sneha Gupta</p>
              </div>
              <div className="flex gap-2">
                <Link to="/admin/performance"><Button className="bg-white text-primary hover:bg-white/90"><BarChart3 className="w-4 h-4 mr-1" /> Performance Dashboard</Button></Link>
                <Link to="/crm/shift"><Button className="bg-amber-500 hover:bg-amber-600 text-white"><Users className="w-4 h-4 mr-1" /> Manage Agents</Button></Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Phone} label="Calls Today" value={IVR_STATS.totalCallsToday} color="blue" trend="up" trendValue="+8% vs yesterday" />
            <StatCard icon={CheckCircle2} label="Calls Answered" value={IVR_STATS.callsAnswered} color="green" trend="up" trendValue="+5% vs yesterday" />
            <StatCard icon={Users} label="Active Agents" value={`${IVR_STATS.activeAgents}/${IVR_STATS.totalAgents}`} color="purple" />
            <StatCard icon={TrendingUp} label="SLA Compliance" value="95.1%" color="green" trend="up" trendValue="+0.5% vs yesterday" sublabel="Target: 95%" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Hourly Call Disposition" subtitle="Calls received vs answered (today)">
              <BarChartCard data={HOURLY_DISPOSITION} xKey="hour" bars={[{ key: "calls", label: "Calls Received", color: "#f59e0b" }, { key: "answered", label: "Calls Answered", color: "#22c55e" }]} />
            </ChartCard>
            <ChartCard title="IVR Success Rate" subtitle={`Overall: ${IVR_STATS.successRate}%`}>
              <PieChartCard data={[{ name: "Answered", value: IVR_STATS.callsAnswered, color: "#22c55e" }, { name: "Missed", value: IVR_STATS.callsMissed, color: "#ef4444" }]} height={280} />
            </ChartCard>
          </div>

          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Agent Performance Overview</h3>
              <Link to="/admin/agents" className="text-sm text-blue-600 hover:underline">Manage All Agents →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Agent</th>
                    <th className="px-4 py-2 font-medium">Role</th>
                    <th className="px-4 py-2 font-medium">Shift</th>
                    <th className="px-4 py-2 font-medium text-center">Calls Today</th>
                    <th className="px-4 py-2 font-medium text-center">Resolved</th>
                    <th className="px-4 py-2 font-medium">Avg Talk</th>
                    <th className="px-4 py-2 font-medium text-center">CSAT</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {CRM_AGENTS.map((a, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-medium">{a.name}</td>
                      <td className="px-4 py-2.5"><Badge variant="outline" className={`text-xs ${a.role === "Supervisor" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>{a.role}</Badge></td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{a.shift}</td>
                      <td className="px-4 py-2.5 text-center font-semibold">{a.callsToday}</td>
                      <td className="px-4 py-2.5 text-center text-emerald-600">{a.resolvedToday}</td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs">{a.avgTalkTime}</td>
                      <td className="px-4 py-2.5 text-center text-amber-600 font-medium">★ {a.csat}/5</td>
                      <td className="px-4 py-2.5"><Badge variant="outline" className={`text-xs ${a.status === "Available" ? "bg-emerald-50 text-emerald-700" : a.status === "On Call" ? "bg-amber-50 text-amber-700" : a.status === "Break" ? "bg-purple-50 text-purple-700" : "bg-slate-50 text-slate-500"}`}>{a.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-border">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="font-bold text-foreground">Agent Leaderboard</h3>
              </div>
              <div className="divide-y divide-border max-h-[350px] overflow-y-auto scrollbar-thin">
                {AGENT_PERFORMANCE.map((a, i) => (
                  <div key={i} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-100 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                      <div>
                        <div className="font-medium text-sm">{a.agent}</div>
                        <div className="text-xs text-muted-foreground">{a.calls} calls • CSAT {a.csat} • {a.avgTalkTime}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{a.slaCompliance}% SLA</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground">Recent Calls</h3>
                <Link to="/crm/history" className="text-sm text-blue-600 hover:underline">View All →</Link>
              </div>
              <div className="divide-y divide-border max-h-[350px] overflow-y-auto scrollbar-thin">
                {CALL_TRACKER.slice(0, 6).map((c, i) => (
                  <div key={i} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs"><CallId id={c.id} /></div>
                      <div className="text-sm">{c.agent} - {c.duration}</div>
                    </div>
                    <Badge variant="outline" className={`text-xs ${c.status === "Missed" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{c.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PortalLayout>
    );
  }

  // ── CCE Agent personal scorecard ──
  const sc = CCE_SCORECARD[scorecardPeriod];
  const myCalls = CALL_TRACKER.filter(c => c.agent === agentName);
  const myTickets = CALL_TRACKER.filter(c => c.agent === agentName && c.complaintId);

  return (
    <PortalLayout role="crm">
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">My Scorecard</h1>
              <p className="text-white/80 text-sm">{agentName} • CCE Agent • Morning Shift (06:00–14:00) • Agent ID: cce-001</p>
            </div>
            <div className="flex gap-2">
              <Link to="/crm/incoming-call">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white"><Phone className="w-4 h-4 mr-1" /> Incoming Call</Button>
              </Link>
              <Link to="/crm/raise">
                <Button className="bg-white text-primary hover:bg-white/90"><Headphones className="w-4 h-4 mr-1" /> Raise Complaint</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-1 bg-white border border-border rounded-lg p-0.5 w-fit">
          {Object.entries(CCE_SCORECARD).map(([key, val]) => (
            <button key={key} onClick={() => setScorecardPeriod(key)} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${scorecardPeriod === key ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:bg-muted"}`}>
              {val.label}
            </button>
          ))}
        </div>

        {/* Personal stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard icon={Phone} label={`Calls (${sc.label})`} value={sc.calls} color="blue" trend="up" trendValue={`+8% (${sc.sub})`} />
          <StatCard icon={CheckCircle2} label="Answered" value={sc.answered} color="green" trend="up" trendValue={`+5% (${sc.sub})`} />
          <StatCard icon={PhoneMissed} label="Missed" value={sc.missed} color="red" />
          <StatCard icon={Ticket} label="Tickets Raised" value={sc.ticketsRaised} color="purple" trend="up" trendValue={`+3% (${sc.sub})`} />
          <StatCard icon={Clock} label="Avg Talk Time" value={sc.avgTalk} color="amber" />
          <StatCard icon={Star} label="CSAT" value={`${sc.csat}/5`} color="green" sublabel={`SLA: ${sc.sla}%`} />
        </div>

        {/* Performance summary card */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">Performance Summary ({sc.label})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{sc.calls}</div>
              <div className="text-xs text-muted-foreground">Total Calls</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{sc.ticketsRaised}</div>
              <div className="text-xs text-muted-foreground">Tickets Raised</div>
            </div>
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{sc.resolved}</div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{sc.csat}/5</div>
              <div className="text-xs text-muted-foreground">CSAT Rating</div>
            </div>
          </div>
        </div>

        {/* My recent calls */}
        <div className="bg-white rounded-xl border border-border">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-foreground">My Recent Calls</h3>
            <Link to="/crm/history" className="text-sm text-blue-600 hover:underline">View All →</Link>
          </div>
          {myCalls.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">No recent calls found.</div>
          ) : (
            <div className="divide-y divide-border max-h-[400px] overflow-y-auto scrollbar-thin">
              {myCalls.map((c, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs"><CallId id={c.id} /></div>
                    <div className="text-sm">{c.time} • {c.duration} • {c.disposition}</div>
                    {c.complaintId && <div className="text-xs mt-0.5">Ticket: <ComplaintId id={c.complaintId} /></div>}
                  </div>
                  <Badge variant="outline" className={`text-xs ${c.status === "Missed" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{c.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Read-only notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <Activity className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <div className="font-medium text-sm text-primary">Agent View — Read Only</div>
            <p className="text-xs text-muted-foreground">You are viewing your personal scorecard. Shift management and agent administration are available to supervisors only.</p>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}