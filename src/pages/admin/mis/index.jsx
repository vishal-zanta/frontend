import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FileBarChart,
  Download,
  FileText,
  Sparkles,
  Filter,
  Calendar,
  FileSpreadsheet,
  FileCheck,
  Loader2,
} from "lucide-react";
import { DISTRICT_WISE } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExportButton from "@/components/ExportButton";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import StatCard from "@/components/StatCard";
import { jsPDF } from "jspdf";
import { useGetMisReports, useGetMisStats } from "./hooks";

const reports = [
  {
    id: "summary",
    name: "Complaint Summary Report",
    desc: "Total complaints, bifurcation by status, district-wise breakdown",
    icon: FileBarChart,
  },
  {
    id: "officer",
    name: "Officer Ranking Report",
    desc: "Ranking based on complaints resolved in given time period",
    icon: FileText,
  },
  {
    id: "service",
    name: "Service Performance Report",
    desc: "SLA compliance, breach rate, resolution time by service",
    icon: FileBarChart,
  },
  {
    id: "urban",
    name: "Urban Performance Report",
    desc: "ULB-wise performance, population rank, per-capita analysis",
    icon: FileText,
  },
  {
    id: "rural",
    name: "Rural Performance Report",
    desc: "Block-level grievance status & resolution metrics",
    icon: FileText,
  },
  {
    id: "ulb",
    name: "ULB Leadership Board",
    desc: "Ranked ULB performance with trend indicators",
    icon: FileBarChart,
  },
  {
    id: "ivr",
    name: "IVR Report",
    desc: "Call success rate, agent attendance, IVR metrics",
    icon: FileText,
  },
  {
    id: "agent",
    name: "Agent Performance Report",
    desc: "Individual agent stats - calls, resolution, CSAT, SLA",
    icon: FileText,
  },
];

const REPORT_DATA_KEYS = {
  summary: "districtWise",
  officer: "officerRanking",
  service: "servicePerformance",
  urban: "ulbWise",
  rural: "blockWise",
  ulb: "ulbWise",
  ivr: "ivrStats",
  agent: "agentPerformance",
};

const periodLabels = {
  cy: "Calendar Year 2026",
  fy: "FY 2025-26",
  custom: "Custom Range",
};

const aiSummary = [
  "This report covers the period from 01 January 2026 to 06 July 2026 (6 months). During this period, the Bihar Sahayog Helpline Portal received a total of 48,732 complaints across 12 districts and 6 ULBs.",
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

function getReportColumns(reportId) {
  switch (reportId) {
    case "officer":
      return [
        { key: "rank", label: "Rank" },
        { key: "name", label: "Officer" },
        { key: "district", label: "District" },
        { key: "resolved", label: "Resolved" },
        { key: "slaCompliance", label: "SLA %" },
      ];
    case "service":
      return [
        { key: "service", label: "Service" },
        { key: "withinSLA", label: "Within SLA" },
        { key: "beyondSLA", label: "Beyond SLA" },
        { key: "compliance", label: "Compliance %" },
      ];
    case "ulb":
    case "urban":
      return [
        { key: "ulb", label: "ULB" },
        { key: "complaints", label: "Complaints" },
        { key: "slaCompliance", label: "SLA %" },
        { key: "rating", label: "Rating" },
      ];
    case "rural":
      return [
        { key: "block", label: "Block" },
        { key: "district", label: "District" },
        { key: "total", label: "Total" },
        { key: "resolved", label: "Resolved" },
        { key: "pending", label: "Pending" },
        { key: "escalated", label: "Escalated" },
      ];
    case "agent":
      return [
        { key: "agent", label: "Agent" },
        { key: "calls", label: "Calls" },
        { key: "resolved", label: "Resolved" },
        { key: "csat", label: "CSAT" },
        { key: "slaCompliance", label: "SLA %" },
      ];
    case "ivr":
      return [
        { key: "label", label: "Metric" },
        { key: "value", label: "Value" },
      ];
    default:
      return [
        { key: "district", label: "District" },
        { key: "total", label: "Total" },
        { key: "resolved", label: "Resolved" },
        { key: "pending", label: "Pending" },
        { key: "escalated", label: "Escalated" },
      ];
  }
}

function normalizeIvrRows(ivrStats) {
  if (!ivrStats || typeof ivrStats !== "object") return [];
  return [
    {
      label: "Total Calls",
      value: ivrStats.totalCalls ?? ivrStats.totalCallsToday,
    },
    { label: "Calls Answered", value: ivrStats.callsAnswered },
    { label: "Calls Missed", value: ivrStats.callsMissed },
    {
      label: "Success Rate",
      value: ivrStats.successRate != null ? `${ivrStats.successRate}%` : "-",
    },
    { label: "Avg Talk Time", value: ivrStats.avgTalkTime ?? "-" },
    { label: "Avg Wait Time", value: ivrStats.avgWaitTime ?? "-" },
    { label: "Peak Hour", value: ivrStats.peakHour ?? "-" },
    {
      label: "Active Agents",
      value:
        ivrStats.activeAgents != null
          ? `${ivrStats.activeAgents}/${ivrStats.totalAgents ?? "-"}`
          : "-",
    },
    {
      label: "IVR Completion Rate",
      value:
        ivrStats.ivrCompletionRate != null
          ? `${ivrStats.ivrCompletionRate}%`
          : "-",
    },
  ];
}

function formatCell(reportId, key, row) {
  const value = row[key];
  if (value == null) return "-";

  if (
    [
      "total",
      "resolved",
      "pending",
      "escalated",
      "withinSLA",
      "beyondSLA",
      "complaints",
      "calls",
    ].includes(key) &&
    typeof value === "number"
  ) {
    return value.toLocaleString("en-IN");
  }

  if (
    ["slaCompliance", "compliance"].includes(key) &&
    typeof value === "number"
  ) {
    return `${value}%`;
  }

  if (key === "rating" && typeof value === "number") {
    return `${value}/5`;
  }

  if (key === "csat" && typeof value === "number") {
    return `★ ${value}/5`;
  }

  return value;
}

export default function MISReports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSummary, setShowSummary] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [district, setDistrict] = useState("all");
  const [dateRange, setDateRange] = useState("fy");
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState("2026-07-06");
  const selectedReport = searchParams.get("report") || "summary";

  const currentReport =
    reports.find((r) => r.id === selectedReport) || reports[0];

  const params = useMemo(() => {
    const next = {
      report: selectedReport,
      district,
      dateRange,
    };
    if (dateRange === "custom") {
      next.fromDate = fromDate;
      next.toDate = toDate;
    }
    return next;
  }, [selectedReport, district, dateRange, fromDate, toDate]);

  const queryEnabled = dateRange !== "custom" || (!!fromDate && !!toDate);

  const { data, isLoading, error } = useGetMisReports(
    [selectedReport, district, dateRange, fromDate, toDate],
    params,
    queryEnabled,
  );

  const {
    data: statsRes,
    isLoading: statsLoading,
    error: statsError,
  } = useGetMisStats();

  const reportPayload = data?.data?.data || {};
  const dataKey = REPORT_DATA_KEYS[selectedReport] || "districtWise";
  const rawRows = reportPayload[dataKey];

  const reportRows = useMemo(() => {
    if (selectedReport === "ivr") {
      return normalizeIvrRows(rawRows);
    }
    return Array.isArray(rawRows) ? rawRows : [];
  }, [selectedReport, rawRows]);

  const reportColumns = getReportColumns(selectedReport);

  const stats = statsRes?.data?.data || {};
  const statTiles = [
    {
      label: "Total Reports Generated",
      value: stats.totalReportsGenerated ?? 0,
      icon: FileText,
      color: "blue",
    },
    {
      label: "This Month",
      value: stats.thisMonth ?? 0,
      icon: Calendar,
      color: "emerald",
    },
    {
      label: "Statutory Reports",
      value: stats.statutoryReports ?? 0,
      icon: FileCheck,
      color: "purple",
    },
    {
      label: "Pending Reports",
      value: stats.pendingReports ?? 0,
      icon: FileBarChart,
      color: "amber",
    },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowSummary(true);
    }, 2000);
  };

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <SectionTitle
          title="MIS Reports"
          subtitle="Downloadable reports for senior officials & statutory reporting"
        />

        <LoaderErrWrapper
          isLoading={statsLoading}
          error={statsError?.response?.data?.message || statsError?.message}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statTiles.map((s, i) => (
              <StatCard
                key={i}
                icon={s.icon}
                label={s.label}
                value={Number(s.value).toLocaleString("en-IN")}
                color={s.color}
              />
            ))}
          </div>
        </LoaderErrWrapper>

        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Filter className="w-4 h-4" /> Select Report:
            </span>
            <Select
              value={selectedReport}
              onValueChange={(v) => setSearchParams({ report: v })}
            >
              <SelectTrigger className="w-72 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reports.map((r) => (
                  <SelectItem key={r.id} value={r.id} className="text-sm">
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="w-px h-8 bg-border mx-1" />

            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Filter className="w-4 h-4" /> District:
            </span>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="w-44 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-sm">
                  All Districts
                </SelectItem>
                {DISTRICT_WISE.map((d) => (
                  <SelectItem
                    key={d.district}
                    value={d.district}
                    className="text-sm"
                  >
                    {d.district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-44 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cy" className="text-sm">
                  Calendar Year 2026
                </SelectItem>
                <SelectItem value="fy" className="text-sm">
                  FY 2025-26
                </SelectItem>
                <SelectItem value="custom" className="text-sm">
                  Custom Date Range
                </SelectItem>
              </SelectContent>
            </Select>
            {dateRange === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-2 py-1.5 text-sm border border-input rounded-md"
                />
                <span className="text-muted-foreground text-sm">to</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-2 py-1.5 text-sm border border-input rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              {React.createElement(currentReport.icon, {
                className: "w-5 h-5",
              })}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground">
                {currentReport.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentReport.desc}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Period:{" "}
                <span className="font-medium text-foreground">
                  {periodLabels[dateRange]}
                </span>
              </p>
            </div>
            <ExportButton
              data={reportRows}
              columns={reportColumns}
              filename={`MIS_${currentReport.id}_report`}
            />
          </div>

          <LoaderErrWrapper
            isLoading={isLoading}
            error={error?.response?.data?.message || error?.message}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left text-xs text-muted-foreground">
                    {reportColumns.map((col) => (
                      <th
                        key={col.key}
                        className={`px-3 py-2 font-medium ${
                          [
                            "total",
                            "resolved",
                            "pending",
                            "escalated",
                            "withinSLA",
                            "beyondSLA",
                            "compliance",
                            "slaCompliance",
                            "complaints",
                            "calls",
                            "value",
                          ].includes(col.key)
                            ? "text-right"
                            : ""
                        }`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reportRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={reportColumns.length}
                        className="px-3 py-8 text-center text-muted-foreground"
                      >
                        No data found for selected filters
                      </td>
                    </tr>
                  ) : (
                    reportRows.map((row, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        {reportColumns.map((col) => (
                          <td
                            key={col.key}
                            className={`px-3 py-2 ${
                              col.key === "name" ||
                              col.key === "agent" ||
                              col.key === "district" ||
                              col.key === "block" ||
                              col.key === "service" ||
                              col.key === "ulb" ||
                              col.key === "label"
                                ? "font-medium"
                                : ""
                            } ${
                              [
                                "total",
                                "resolved",
                                "pending",
                                "escalated",
                                "withinSLA",
                                "beyondSLA",
                                "compliance",
                                "slaCompliance",
                                "complaints",
                                "calls",
                                "value",
                              ].includes(col.key)
                                ? "text-right"
                                : ""
                            } ${
                              col.key === "resolved" || col.key === "withinSLA"
                                ? "text-emerald-600"
                                : ""
                            } ${
                              col.key === "pending" ? "text-amber-600" : ""
                            } ${
                              col.key === "escalated" || col.key === "beyondSLA"
                                ? "text-red-600"
                                : ""
                            }`}
                          >
                            {formatCell(selectedReport, col.key, row)}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </LoaderErrWrapper>
        </div>

        <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  AI-Generated MIS Cover Note
                </h3>
                <p className="text-white/70 text-sm">
                  Auto-generated summary with key insights & recommendations
                </p>
              </div>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />{" "}
                  Generating...
                </>
              ) : showSummary ? (
                "Regenerate"
              ) : (
                "Generate Summary"
              )}
            </Button>
          </div>
          {showSummary && (
            <div className="bg-white/10 rounded-xl p-4 mt-3">
              <pre className="text-sm text-white/90 whitespace-pre-wrap font-sans leading-relaxed">
                {aiSummary}
              </pre>
              <div className="flex gap-2 mt-4">
                <Button
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => {
                    const doc = new jsPDF();
                    doc.setFontSize(16);
                    doc.text(
                      "Bihar Sahayog Helpline Portal - MIS Cover Note",
                      14,
                      20,
                    );
                    doc.setFontSize(10);
                    doc.setTextColor(100);
                    doc.text(
                      "Period: " +
                        periodLabels[dateRange] +
                        " | Generated: " +
                        new Date().toLocaleString("en-IN"),
                      14,
                      28,
                    );
                    doc.setTextColor(0);
                    const lines = doc.splitTextToSize(aiSummary, 180);
                    doc.text(lines, 14, 40);
                    doc.save("MIS_cover_note.pdf");
                  }}
                >
                  <Download className="w-4 h-4 mr-1" /> Download PDF
                </Button>
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white"
                  onClick={() => {
                    const blob = new Blob([aiSummary], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "MIS_cover_note.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-1" /> Download Excel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
