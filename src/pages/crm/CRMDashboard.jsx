import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Clock,
  CheckCircle2,
  Users,
  TrendingUp,
  Headphones,
  BarChart3,
  Star,
  Activity,
  Ticket,
  PhoneMissed,
} from "lucide-react";
import {
  IVR_STATS,
  CALL_TRACKER,
  AGENT_PERFORMANCE,
  HOURLY_DISPOSITION,
  CRM_AGENTS,
} from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { usePortalProfile } from "@/hooks/usePortalProfile";
import StatCard from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard, PieChartCard } from "@/components/Charts";
import { ComplaintId, CallId } from "@/components/ComplaintDetailDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const CCE_SCORECARD = {
  daily: {
    calls: 42,
    answered: 40,
    missed: 2,
    ticketsRaised: 38,
    resolved: 38,
    avgTalk: "4m 12s",
    csat: 4.5,
    sla: 96.2,
    label: "Today",
    labelHindi: "आज",
    sub: "vs yesterday",
  },
  weekly: {
    calls: 298,
    answered: 282,
    missed: 16,
    ticketsRaised: 265,
    resolved: 260,
    avgTalk: "4m 18s",
    csat: 4.4,
    sla: 95.8,
    label: "This Week",
    labelHindi: "इस सप्ताह",
    sub: "vs last week",
  },
  monthly: {
    calls: 1240,
    answered: 1180,
    missed: 60,
    ticketsRaised: 1120,
    resolved: 1090,
    avgTalk: "4m 22s",
    csat: 4.5,
    sla: 96.0,
    label: "This Month",
    labelHindi: "इस महीने",
    sub: "vs last month",
  },
};

const agentName = "Priya Sharma";

export default function CRMDashboard() {
  const { t } = useLanguage();
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
                <h1 className="text-2xl font-bold mb-1">
                  {t("Supervisor Dashboard", "पर्यवेक्षक डैशबोर्ड")}
                </h1>
                <p className="text-white/80 text-sm">
                  {t(
                    "Call centre performance overview • Shift: Full Day (08:00-20:00) • Supervisor: Sneha Gupta",
                    "कॉल सेंटर प्रदर्शन अवलोकन • शिफ्ट: पूरा दिन (08:00-20:00) • पर्यवेक्षक: स्नेहा गुप्ता",
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/admin/performance">
                  <Button className="bg-card text-primary hover:bg-white/90">
                    <BarChart3 className="w-4 h-4 mr-1" />{" "}
                    {t("Performance Dashboard", "प्रदर्शन डैशबोर्ड")}
                  </Button>
                </Link>
                <Link to="/crm/shift">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                    <Users className="w-4 h-4 mr-1" />{" "}
                    {t("Manage Agents", "एजेंटों का प्रबंधन करें")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Phone}
              label={t("Calls Today", "आज की कॉल")}
              value={IVR_STATS.totalCallsToday}
              color="blue"
              trend="up"
              trendValue="+8% vs yesterday"
            />
            <StatCard
              icon={CheckCircle2}
              label={t("Calls Answered", "उत्तरित कॉल")}
              value={IVR_STATS.callsAnswered}
              color="green"
              trend="up"
              trendValue="+5% vs yesterday"
            />
            <StatCard
              icon={Users}
              label={t("Active Agents", "सक्रिय एजेंट")}
              value={`${IVR_STATS.activeAgents}/${IVR_STATS.totalAgents}`}
              color="purple"
            />
            <StatCard
              icon={TrendingUp}
              label={t("SLA Compliance", "एसएलए अनुपालन")}
              value="95.1%"
              color="green"
              trend="up"
              trendValue="+0.5% vs yesterday"
              sublabel={t("Target: 95%", "लक्ष्य: 95%")}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title={t("Hourly Call Disposition", "प्रति घंटा कॉल निपटान")}
              subtitle={t(
                "Calls received vs answered (today)",
                "प्राप्त बनाम उत्तरित कॉल (आज)",
              )}
            >
              <BarChartCard
                data={HOURLY_DISPOSITION}
                xKey="hour"
                bars={[
                  {
                    key: "calls",
                    label: t("Calls Received", "प्राप्त कॉल"),
                    color: "#f59e0b",
                  },
                  {
                    key: "answered",
                    label: t("Calls Answered", "उत्तरित कॉल"),
                    color: "#22c55e",
                  },
                ]}
              />
            </ChartCard>
            <ChartCard
              title={t("IVR Success Rate", "आईवीआर सफलता दर")}
              subtitle={`${t("Overall", "कुल")}: ${IVR_STATS.successRate}%`}
            >
              <PieChartCard
                data={[
                  {
                    name: t("Answered", "उत्तरित"),
                    value: IVR_STATS.callsAnswered,
                    color: "#22c55e",
                  },
                  {
                    name: t("Missed", "छूटी हुई"),
                    value: IVR_STATS.callsMissed,
                    color: "#ef4444",
                  },
                ]}
                height={280}
              />
            </ChartCard>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">
                {t("Agent Performance Overview", "एजेंट प्रदर्शन अवलोकन")}
              </h3>
              <Link
                to="/admin/agents"
                className="text-sm text-blue-600 hover:underline"
              >
                {t("Manage All Agents →", "सभी एजेंटों का प्रबंधन करें →")}
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">
                      {t("Agent", "एजेंट")}
                    </th>
                    <th className="px-4 py-2 font-medium">
                      {t("Role", "भूमिका")}
                    </th>
                    <th className="px-4 py-2 font-medium">
                      {t("Shift", "शिफ्ट")}
                    </th>
                    <th className="px-4 py-2 font-medium text-center">
                      {t("Calls Today", "आज की कॉल")}
                    </th>
                    <th className="px-4 py-2 font-medium text-center">
                      {t("Resolved", "हल की गई")}
                    </th>
                    <th className="px-4 py-2 font-medium">
                      {t("Avg Talk", "औसत बात")}
                    </th>
                    <th className="px-4 py-2 font-medium text-center">
                      {t("CSAT", "सीएसएटी")}
                    </th>
                    <th className="px-4 py-2 font-medium">
                      {t("Status", "स्थिति")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {CRM_AGENTS.map((a, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-medium">{a.name}</td>
                      <td className="px-4 py-2.5">
                        <Badge
                          variant="outline"
                          className={`text-xs ${a.role === "Supervisor" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}
                        >
                          {a.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">
                        {a.shift}
                      </td>
                      <td className="px-4 py-2.5 text-center font-semibold">
                        {a.callsToday}
                      </td>
                      <td className="px-4 py-2.5 text-center text-emerald-600">
                        {a.resolvedToday}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs">
                        {a.avgTalkTime}
                      </td>
                      <td className="px-4 py-2.5 text-center text-amber-600 font-medium">
                        ★ {a.csat}/5
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge
                          variant="outline"
                          className={`text-xs ${a.status === "Available" ? "bg-emerald-50 text-emerald-700" : a.status === "On Call" ? "bg-amber-50 text-amber-700" : a.status === "Break" ? "bg-purple-50 text-purple-700" : "bg-slate-50 text-slate-500"}`}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl border border-border">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="font-bold text-foreground">
                  {t("Agent Leaderboard", "एजेंट लीडरबोर्ड")}
                </h3>
              </div>
              <div className="divide-y divide-border max-h-[350px] overflow-y-auto scrollbar-thin">
                {AGENT_PERFORMANCE.map((a, i) => (
                  <div
                    key={i}
                    className="px-5 py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-100 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"}`}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{a.agent}</div>
                        <div className="text-xs text-muted-foreground">
                          {a.calls} {t("calls", "कॉल")} • CSAT {a.csat} •{" "}
                          {a.avgTalkTime}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {a.slaCompliance}% SLA
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground">
                  {t("Recent Calls", "हाल की कॉल")}
                </h3>
                <Link
                  to="/crm/history"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {t("View All →", "सभी देखें →")}
                </Link>
              </div>
              <div className="divide-y divide-border max-h-[350px] overflow-y-auto scrollbar-thin">
                {CALL_TRACKER.slice(0, 6).map((c, i) => (
                  <div
                    key={i}
                    className="px-5 py-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs">
                        <CallId id={c.id} />
                      </div>
                      <div className="text-sm">
                        {c.agent} - {c.duration}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${c.status === "Missed" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
                    >
                      {c.status}
                    </Badge>
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
  const myCalls = CALL_TRACKER.filter((c) => c.agent === agentName);

  return (
    <PortalLayout role="crm">
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {t("My Scorecard", "मेरा स्कोरकार्ड")}
              </h1>
              <p className="text-white/80 text-sm">
                {agentName} • CCE Agent • Morning Shift (06:00–14:00) • Agent
                ID: cce-001
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/crm/incoming-call">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Phone className="w-4 h-4 mr-1" />{" "}
                  {t("Incoming Call", "आगमन कॉल")}
                </Button>
              </Link>
              <Link to="/crm/raise">
                <Button className="bg-card text-primary hover:bg-white/90">
                  <Headphones className="w-4 h-4 mr-1" />{" "}
                  {t("Raise Complaint", "शिकायत दर्ज करें")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5 w-fit">
          {Object.entries(CCE_SCORECARD).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setScorecardPeriod(key)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${scorecardPeriod === key ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:bg-muted"}`}
            >
              {t(val.label, val.labelHindi)}
            </button>
          ))}
        </div>

        {/* Personal stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            icon={Phone}
            label={`${t("Calls", "कॉल")} (${t(sc.label, sc.labelHindi)})`}
            value={sc.calls}
            color="blue"
            trend="up"
            trendValue={`+8% (${sc.sub})`}
          />
          <StatCard
            icon={CheckCircle2}
            label={t("Answered", "उत्तरित")}
            value={sc.answered}
            color="green"
            trend="up"
            trendValue={`+5% (${sc.sub})`}
          />
          <StatCard
            icon={PhoneMissed}
            label={t("Missed", "छूटी हुई")}
            value={sc.missed}
            color="red"
          />
          <StatCard
            icon={Ticket}
            label={t("Tickets Raised", "टिकट उठाए गए")}
            value={sc.ticketsRaised}
            color="purple"
            trend="up"
            trendValue={`+3% (${sc.sub})`}
          />
          <StatCard
            icon={Clock}
            label={t("Avg Talk Time", "औसत बात करने का समय")}
            value={sc.avgTalk}
            color="amber"
          />
          <StatCard
            icon={Star}
            label={t("CSAT", "सीएसएटी")}
            value={`${sc.csat}/5`}
            color="green"
            sublabel={`SLA: ${sc.sla}%`}
          />
        </div>

        {/* Performance summary card */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">
            {t("Performance Summary", "प्रदर्शन सारांश")} (
            {t(sc.label, sc.labelHindi)})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sc.calls}</div>
              <div className="text-xs text-muted-foreground">
                {t("Total Calls", "कुल कॉल")}
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {sc.ticketsRaised}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("Tickets Raised", "टिकट उठाए गए")}
              </div>
            </div>
            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {sc.resolved}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("Resolved", "हल की गई")}
              </div>
            </div>
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {sc.csat}/5
              </div>
              <div className="text-xs text-muted-foreground">
                {t("CSAT Rating", "सीएसएटी रेटिंग")}
              </div>
            </div>
          </div>
        </div>

        {/* My recent calls */}
        <div className="bg-card rounded-xl border border-border">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-foreground">
              {t("My Recent Calls", "मेरी हाल की कॉल")}
            </h3>
            {/* <Link
              to="/crm/history"
              className="text-sm text-blue-600 hover:underline"
            >
              {t("View All →", "सभी देखें →")}
            </Link> */}
          </div>
          {myCalls.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              {t("No recent calls found.", "कोई हाल की कॉल नहीं मिली।")}
            </div>
          ) : (
            <div className="divide-y divide-border max-h-[400px] overflow-y-auto scrollbar-thin">
              {myCalls.map((c, i) => (
                <div
                  key={i}
                  className="px-5 py-3 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs">
                      <CallId id={c.id} />
                    </div>
                    <div className="text-sm">
                      {c.time} • {c.duration} • {c.disposition}
                    </div>
                    {c.complaintId && (
                      <div className="text-xs mt-0.5">
                        Ticket: <ComplaintId id={c.complaintId} />
                      </div>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${c.status === "Missed" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
                  >
                    {c.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Read-only notice */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4 flex items-center gap-3">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <div className="font-medium text-sm text-blue-900 dark:text-blue-100">
              {t("Agent View - Read Only", "एजेंट दृश्य - केवल पठन")}
            </div>
            <p className="text-xs text-muted-foreground">
              {t(
                "You are viewing your personal scorecard. Shift management and agent administration are available to supervisors only.",
                "आप अपना व्यक्तिगत स्कोरकार्ड देख रहे हैं। शिफ्ट प्रबंधन और एजेंट प्रशासन केवल पर्यवेक्षकों के लिए उपलब्ध हैं।",
              )}
            </p>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
