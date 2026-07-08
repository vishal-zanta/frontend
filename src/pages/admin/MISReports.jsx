import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FileBarChart, Download, FileText, Sparkles, Filter, Calendar, FileSpreadsheet, FileCheck, Loader2 } from "lucide-react";
import { DASHBOARD_KPIS, DISTRICT_WISE, SLA_PERFORMANCE, OFFICER_RANKING, ULB_INTELLIGENCE, IVR_STATS, AGENT_PERFORMANCE } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ExportButton from "@/components/ExportButton";
import { jsPDF } from "jspdf";

const reports = [
  { id: "summary", name: "Complaint Summary Report", desc: "Total complaints, bifurcation by status, district-wise breakdown", icon: FileBarChart },
  { id: "officer", name: "Officer Ranking Report", desc: "Ranking based on complaints resolved in given time period", icon: FileText },
  { id: "service", name: "Service Performance Report", desc: "SLA compliance, breach rate, resolution time by service", icon: FileBarChart },
  { id: "urban", name: "Urban Performance Report", desc: "ULB-wise performance, population rank, per-capita analysis", icon: FileText },
  { id: "rural", name: "Rural Performance Report", desc: "Block-level grievance status & resolution metrics", icon: FileText },
  { id: "ulb", name: "ULB Leadership Board", desc: "Ranked ULB performance with trend indicators", icon: FileBarChart },
  { id: "ivr", name: "IVR Report", desc: "Call success rate, agent attendance, IVR metrics", icon: FileText },
  { id: "agent", name: "Agent Performance Report", desc: "Individual agent stats - calls, resolution, CSAT, SLA", icon: FileText },
];

const periodLabels = { cy: "Calendar Year 2026", fy: "FY 2025-26", custom: "Custom Range" };

const aiSummary = [
  "This report covers the period from 01 January 2026 to 06 July 2026 (6 months). During this period, the Bihar e-Grievance Portal received a total of 48,732 complaints across 12 districts and 6 ULBs.",
  "",
  "Key Highlights:",
  "- Overall SLA compliance stands at 95.1%, with 38,290 complaints resolved within SLA and 1,953 beyond SLA.",
  "- Drainage & Sewerage remains the highest volume category (12,834 complaints), with a 6.6% escalation rate.",
  "- Road & Infrastructure has the worst SLA compliance at 86.8% and highest escalation rate of 13.2% - recommending additional L1 officers in Gaya division.",
  "- Patna district accounts for 25.6% of total complaints (12,480), with 89.1% resolution rate.",
  "- The top-performing officer is Prakash Jha (L2 Supervisory Officer, Patna) with 210 resolved complaints and 98.5% SLA compliance.",
  "- IVR success rate is 93.5% with an average talk time of 4m 32s. Peak call volume occurs between 10:00-11:00 AM.",
  "- AI predicts a 18% surge in drainage complaints next week due to monsoon onset - pre-positioning of field teams recommended.",
  "",
  "Recommendations:",
  "1. Deploy 2 additional L1 officers in Gaya for Road & Infrastructure service.",
  "2. Schedule preventive maintenance for street lights on Wednesdays (observed weekly pattern).",
  "3. Shift CCE coverage 1 hour earlier for Animal Rescue complaints (peak 6-8 AM).",
  "4. Monitor Kankarbagh Ward-12 (Patna) as highest-severity hotspot (342 complaints).",
  "5. Review pipe replacement work in Patna wards 7-8 as positive trend in Water Supply.",
].join("\n");

export default function MISReports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSummary, setShowSummary] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [district, setDistrict] = useState("all");
  const [dateRange, setDateRange] = useState("fy");
  const selectedReport = searchParams.get("report") || "summary";

  const currentReport = reports.find(r => r.id === selectedReport) || reports[0];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setShowSummary(true); }, 2000);
  };

  // Build export data + columns based on selected report
  const reportData = selectedReport === "officer" ? OFFICER_RANKING
    : selectedReport === "service" ? SLA_PERFORMANCE
    : selectedReport === "ulb" || selectedReport === "urban" ? ULB_INTELLIGENCE
    : selectedReport === "agent" ? AGENT_PERFORMANCE
    : selectedReport === "ivr" ? [
        { label: "Total Calls Today", calls: IVR_STATS.totalCallsToday, answered: IVR_STATS.callsAnswered, csat: "-", status: `${IVR_STATS.successRate}%` },
        { label: "Avg Talk Time", calls: IVR_STATS.avgTalkTime, answered: "-", csat: "-", status: "-" },
        { label: "Active Agents", calls: `${IVR_STATS.activeAgents}/${IVR_STATS.totalAgents}`, answered: "-", csat: "-", status: "-" },
      ]
    : DISTRICT_WISE;

  const reportColumns = selectedReport === "officer" ? [
      { key: "rank", label: "Rank" }, { key: "name", label: "Officer" }, { key: "district", label: "District" },
      { key: "resolved", label: "Resolved" }, { key: "slaCompliance", label: "SLA %" },
    ] : selectedReport === "service" ? [
      { key: "service", label: "Service" }, { key: "withinSLA", label: "Within SLA" },
      { key: "beyondSLA", label: "Beyond SLA" }, { key: "compliance", label: "Compliance %" },
    ] : selectedReport === "ulb" || selectedReport === "urban" ? [
      { key: "ulb", label: "ULB" }, { key: "complaints", label: "Complaints" },
      { key: "slaCompliance", label: "SLA %" }, { key: "rating", label: "Rating" },
    ] : selectedReport === "agent" ? [
      { key: "agent", label: "Agent" }, { key: "calls", label: "Calls" },
      { key: "resolved", label: "Resolved" }, { key: "csat", label: "CSAT" },
      { key: "slaCompliance", label: "SLA %" },
    ] : selectedReport === "ivr" ? [
      { key: "label", label: "Metric" }, { key: "calls", label: "Value 1" },
      { key: "answered", label: "Value 2" }, { key: "status", label: "Status" },
    ] : [
      { key: "district", label: "District" }, { key: "total", label: "Total" },
      { key: "resolved", label: "Resolved" }, { key: "pending", label: "Pending" },
      { key: "escalated", label: "Escalated" },
    ];

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <SectionTitle title="MIS Reports" subtitle="Downloadable reports for senior officials & statutory reporting" />

        {/* Quick stats - ON TOP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Reports Generated", value: "847", icon: FileText, color: "text-primary bg-blue-50" },
            { label: "This Month", value: "52", icon: Calendar, color: "text-emerald-600 bg-emerald-50" },
            { label: "Statutory Reports", value: "12", icon: FileCheck, color: "text-purple-600 bg-purple-50" },
            { label: "Pending Reports", value: "3", icon: FileBarChart, color: "text-amber-600 bg-amber-50" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div><div className="text-xl font-bold">{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
              </div>
            );
          })}
        </div>

        {/* Report selector dropdown */}
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Filter className="w-4 h-4" /> Select Report:</span>
            <Select value={selectedReport} onValueChange={(v) => setSearchParams({ report: v })}>
              <SelectTrigger className="w-72 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {reports.map(r => <SelectItem key={r.id} value={r.id} className="text-sm">{r.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <div className="w-px h-8 bg-border mx-1" />

            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Filter className="w-4 h-4" /> District:</span>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="w-44 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-sm">All Districts</SelectItem>
                {DISTRICT_WISE.map(d => <SelectItem key={d.district} value={d.district} className="text-sm">{d.district}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-44 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cy" className="text-sm">Calendar Year 2026</SelectItem>
                <SelectItem value="fy" className="text-sm">FY 2025-26</SelectItem>
                <SelectItem value="custom" className="text-sm">Custom Date Range</SelectItem>
              </SelectContent>
            </Select>
            {dateRange === "custom" && (
              <div className="flex items-center gap-2">
                <input type="date" defaultValue="2026-01-01" className="px-2 py-1.5 text-sm border border-input rounded-md" />
                <span className="text-muted-foreground text-sm">to</span>
                <input type="date" defaultValue="2026-07-06" className="px-2 py-1.5 text-sm border border-input rounded-md" />
              </div>
            )}
          </div>
        </div>

        {/* Selected report detail */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-11 h-11 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
              {React.createElement(currentReport.icon, { className: "w-5 h-5" })}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground">{currentReport.name}</h3>
              <p className="text-sm text-muted-foreground">{currentReport.desc}</p>
              <p className="text-xs text-muted-foreground mt-1">Period: <span className="font-medium text-foreground">{periodLabels[dateRange]}</span></p>
            </div>
            <ExportButton
              data={reportData}
              columns={reportColumns}
              filename={`MIS_${currentReport.id}_report`}
            />
          </div>

          {/* Report data preview based on selected report */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  {selectedReport === "officer" ? (
                    <><th className="px-3 py-2 font-medium">Rank</th><th className="px-3 py-2 font-medium">Officer</th><th className="px-3 py-2 font-medium">District</th><th className="px-3 py-2 font-medium text-right">Resolved</th><th className="px-3 py-2 font-medium text-right">SLA %</th></>
                  ) : selectedReport === "service" ? (
                    <><th className="px-3 py-2 font-medium">Service</th><th className="px-3 py-2 font-medium text-right">Within SLA</th><th className="px-3 py-2 font-medium text-right">Beyond SLA</th><th className="px-3 py-2 font-medium text-right">Compliance</th></>
                  ) : selectedReport === "ulb" || selectedReport === "urban" ? (
                    <><th className="px-3 py-2 font-medium">ULB</th><th className="px-3 py-2 font-medium text-right">Complaints</th><th className="px-3 py-2 font-medium text-right">SLA %</th><th className="px-3 py-2 font-medium">Rating</th></>
                  ) : selectedReport === "agent" ? (
                    <><th className="px-3 py-2 font-medium">Agent</th><th className="px-3 py-2 font-medium text-right">Calls</th><th className="px-3 py-2 font-medium text-right">Resolved</th><th className="px-3 py-2 font-medium">Avg Talk</th><th className="px-3 py-2 font-medium">CSAT</th><th className="px-3 py-2 font-medium text-right">SLA %</th><th className="px-3 py-2 font-medium">Rating</th><th className="px-3 py-2 font-medium">Status</th></>
                  ) : selectedReport === "ivr" ? (
                    <><th className="px-3 py-2 font-medium">Metric</th><th className="px-3 py-2 font-medium text-right">Value</th><th className="px-3 py-2 font-medium text-right">Answered</th><th className="px-3 py-2 font-medium">Status</th></>
                  ) : (
                    <><th className="px-3 py-2 font-medium">District</th><th className="px-3 py-2 font-medium text-right">Total</th><th className="px-3 py-2 font-medium text-right">Resolved</th><th className="px-3 py-2 font-medium text-right">Pending</th><th className="px-3 py-2 font-medium text-right">Escalated</th></>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {selectedReport === "officer" ? OFFICER_RANKING.map((o, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-3 py-2 font-bold">{o.rank}</td>
                    <td className="px-3 py-2 font-medium">{o.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{o.district}</td>
                    <td className="px-3 py-2 text-right">{o.resolved}</td>
                    <td className="px-3 py-2 text-right font-semibold">{o.slaCompliance}%</td>
                  </tr>
                )) : selectedReport === "service" ? SLA_PERFORMANCE.map((s, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-3 py-2 font-medium">{s.service}</td>
                    <td className="px-3 py-2 text-right text-emerald-600">{s.withinSLA.toLocaleString("en-IN")}</td>
                    <td className="px-3 py-2 text-right text-red-600">{s.beyondSLA}</td>
                    <td className="px-3 py-2 text-right font-semibold">{s.compliance}%</td>
                  </tr>
                )) : selectedReport === "ulb" || selectedReport === "urban" ? ULB_INTELLIGENCE.map((u, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-3 py-2 font-medium">{u.ulb}</td>
                    <td className="px-3 py-2 text-right">{u.complaints.toLocaleString("en-IN")}</td>
                    <td className="px-3 py-2 text-right">{u.slaCompliance}%</td>
                    <td className="px-3 py-2">{u.rating}/5</td>
                  </tr>
                )) : selectedReport === "agent" ? AGENT_PERFORMANCE.map((a, i) => (
                  <tr key={i} className="hover:bg-muted/30"><td className="px-3 py-2 font-medium">{a.agent}</td><td className="px-3 py-2 text-right">{a.calls}</td><td className="px-3 py-2 text-right text-emerald-600">{a.resolved}</td><td className="px-3 py-2 text-muted-foreground">{a.avgTalkTime}</td><td className="px-3 py-2 text-amber-600">★ {a.csat}/5</td><td className="px-3 py-2 text-right">{a.slaCompliance}%</td><td className="px-3 py-2 text-amber-600">★ {a.csat}/5</td><td className="px-3 py-2">{a.status}</td></tr>
                )) : selectedReport === "ivr" ? (
                  <>
                    <tr className="hover:bg-muted/30"><td className="px-3 py-2 font-medium">Total Calls Today</td><td className="px-3 py-2 text-right">{IVR_STATS.totalCallsToday.toLocaleString("en-IN")}</td><td className="px-3 py-2 text-right">{IVR_STATS.callsAnswered.toLocaleString("en-IN")}</td><td className="px-3 py-2">-</td><td className="px-3 py-2">{IVR_STATS.successRate}%</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-3 py-2 font-medium">Avg Talk Time</td><td className="px-3 py-2 text-right">{IVR_STATS.avgTalkTime}</td><td className="px-3 py-2 text-right">-</td><td className="px-3 py-2">-</td><td className="px-3 py-2">-</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-3 py-2 font-medium">Active Agents</td><td className="px-3 py-2 text-right">{IVR_STATS.activeAgents}/{IVR_STATS.totalAgents}</td><td className="px-3 py-2 text-right">-</td><td className="px-3 py-2">-</td><td className="px-3 py-2">-</td></tr>
                  </>
                ) : DISTRICT_WISE.map((d, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-3 py-2 font-medium">{d.district}</td>
                    <td className="px-3 py-2 text-right font-semibold">{d.total.toLocaleString("en-IN")}</td>
                    <td className="px-3 py-2 text-right text-emerald-600">{d.resolved.toLocaleString("en-IN")}</td>
                    <td className="px-3 py-2 text-right text-amber-600">{d.pending}</td>
                    <td className="px-3 py-2 text-right text-red-600">{d.escalated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI-Generated MIS Cover Note</h3>
                <p className="text-white/70 text-sm">Auto-generated summary with key insights & recommendations</p>
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={generating} className="bg-white/20 hover:bg-white/30 text-white">
              {generating ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Generating...</> : showSummary ? "Regenerate" : "Generate Summary"}
            </Button>
          </div>
          {showSummary && (
            <div className="bg-white/10 rounded-xl p-4 mt-3">
              <pre className="text-sm text-white/90 whitespace-pre-wrap font-sans leading-relaxed">{aiSummary}</pre>
              <div className="flex gap-2 mt-4">
                <Button className="bg-white text-primary hover:bg-white/90" onClick={() => {
                  const doc = new jsPDF();
                  doc.setFontSize(16);
                  doc.text("Bihar e-Grievance Portal — MIS Cover Note", 14, 20);
                  doc.setFontSize(10);
                  doc.setTextColor(100);
                  doc.text("Period: " + periodLabels[dateRange] + " | Generated: " + new Date().toLocaleString("en-IN"), 14, 28);
                  doc.setTextColor(0);
                  const lines = doc.splitTextToSize(aiSummary, 180);
                  doc.text(lines, 14, 40);
                  doc.save("MIS_cover_note.pdf");
                }}><Download className="w-4 h-4 mr-1" /> Download PDF</Button>
                <Button className="bg-white/20 hover:bg-white/30 text-white" onClick={() => {
                  const blob = new Blob([aiSummary], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "MIS_cover_note.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}><FileSpreadsheet className="w-4 h-4 mr-1" /> Download Excel</Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </PortalLayout>
  );
}