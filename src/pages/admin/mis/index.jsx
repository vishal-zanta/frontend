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
import { useGetDemographics } from "../master-data/hooks";
import { MAX_LIMIT } from "@/utils/constants";
import { useLanguage } from "@/context/LanguageContext";
import DistrictSummaryTable from "./components/DistrictSummaryTable";
import OfficerRankingTable from "./components/OfficerRankingTable";
import ServicePerformanceTable from "./components/ServicePerformanceTable";
import UlbPerformanceTable from "./components/UlbPerformanceTable";
import BlockPerformanceTable from "./components/BlockPerformanceTable";
import AgentPerformanceTable from "./components/AgentPerformanceTable";
import IvrReportTable from "./components/IvrReportTable";
import { Input } from "@/components/ui/input";

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

function getReportColumns(reportId, t) {
  switch (reportId) {
    case "officer":
      return [
        { key: "rank", label: t("Rank", "रैंक") },
        { key: "name", label: t("Officer", "अधिकारी") },
        { key: "district", label: t("District", "जिला") },
        { key: "resolved", label: t("Resolved", "निराकृत") },
        { key: "slaCompliance", label: t("SLA %", "SLA %") },
      ];
    case "service":
      return [
        { key: "service", label: t("Service", "सेवा") },
        { key: "withinSLA", label: t("Within SLA", "SLA के भीतर") },
        { key: "beyondSLA", label: t("Beyond SLA", "SLA से बाहर") },
        { key: "compliance", label: t("Compliance %", "अनुपालन %") },
      ];
    case "ulb":
    case "urban":
      return [
        { key: "ulb", label: t("ULB", "ULB") },
        { key: "complaints", label: t("Complaints", "शिकायतें") },
        { key: "slaCompliance", label: t("SLA %", "SLA %") },
        { key: "rating", label: t("Rating", "रेटिंग") },
      ];
    case "rural":
      return [
        { key: "block", label: t("Block", "प्रखंड") },
        { key: "district", label: t("District", "जिला") },
        { key: "total", label: t("Total", "कुल") },
        { key: "resolved", label: t("Resolved", "निराकृत") },
        { key: "pending", label: t("Pending", "लंबित") },
        { key: "escalated", label: t("Escalated", "बढ़ाई गई") },
      ];
    case "agent":
      return [
        { key: "agent", label: t("Agent", "एजेंट") },
        { key: "calls", label: t("Calls", "कॉल") },
        { key: "resolved", label: t("Resolved", "निराकृत") },
        { key: "csat", label: t("CSAT", "CSAT") },
        { key: "slaCompliance", label: t("SLA %", "SLA %") },
      ];
    case "ivr":
      return [
        { key: "label", label: t("Metric", "मीट्रिक") },
        { key: "value", label: t("Value", "मान") },
      ];
    default:
      return [
        { key: "district", label: t("District", "जिला") },
        { key: "total", label: t("Total", "कुल") },
        { key: "resolved", label: t("Resolved", "निराकृत") },
        { key: "pending", label: t("Pending", "लंबित") },
        { key: "escalated", label: t("Escalated", "बढ़ाई गई") },
      ];
  }
}

function normalizeIvrRows(ivrStats, t) {
  if (!ivrStats || typeof ivrStats !== "object") return [];
  return [
    {
      label: t("Total Calls", "कुल कॉल"),
      value: ivrStats.totalCalls ?? ivrStats.totalCallsToday,
    },
    {
      label: t("Calls Answered", "उत्तर दी गई कॉल"),
      value: ivrStats.callsAnswered,
    },
    { label: t("Calls Missed", "मिस कॉल"), value: ivrStats.callsMissed },
    {
      label: t("Success Rate", "सफलता दर"),
      value: ivrStats.successRate != null ? `${ivrStats.successRate}%` : "-",
    },
    {
      label: t("Avg Talk Time", "औसत बात का समय"),
      value: ivrStats.avgTalkTime ?? "-",
    },
    {
      label: t("Avg Wait Time", "औसत प्रतीक्षा समय"),
      value: ivrStats.avgWaitTime ?? "-",
    },
    { label: t("Peak Hour", "पीक घंटा"), value: ivrStats.peakHour ?? "-" },
    {
      label: t("Active Agents", "सक्रिय एजेंट"),
      value:
        ivrStats.activeAgents != null
          ? `${ivrStats.activeAgents}/${ivrStats.totalAgents ?? "-"}`
          : "-",
    },
    {
      label: t("IVR Completion Rate", "आईवीआर समाप्ति दर"),
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
  const [district, setDistrict] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [dateRange, setDateRange] = useState("fy");
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState("2026-07-06");
  const selectedReport = searchParams.get("report") || "summary";
  const { t } = useLanguage();

  const reportsList = [
    {
      id: "summary",
      name: t("Complaint Summary Report", "शिकायत सारांश रिपोर्ट"),
      desc: t(
        "Total complaints, bifurcation by status, district-wise breakdown",
        "कुल शिकायतें, स्थिति के अनुसार विभाजन, जिला-वार विवरण",
      ),
      icon: FileBarChart,
    },
    {
      id: "officer",
      name: t("Officer Ranking Report", "अधिकारी रैंकिंग रिपोर्ट"),
      desc: t(
        "Ranking based on complaints resolved in given time period",
        "दिए गए समय में निराकृत शिकायतों के आधार पर रैंकिंग",
      ),
      icon: FileText,
    },
    {
      id: "service",
      name: t("Service Performance Report", "सेवा प्रदर्शन रिपोर्ट"),
      desc: t(
        "SLA compliance, breach rate, resolution time by service",
        "सेवा द्वारा SLA अनुपालन, उल्लंघन दर, निस्तारण समय",
      ),
      icon: FileBarChart,
    },
    {
      id: "urban",
      name: t("Urban Performance Report", "शहरी प्रदर्शन रिपोर्ट"),
      desc: t(
        "ULB-wise performance, population rank, per-capita analysis",
        "ULB-वार प्रदर्शन, जनसंख्या रैंक, प्रति व्यक्ति विश्लेषण",
      ),
      icon: FileText,
    },
    {
      id: "rural",
      name: t("Rural Performance Report", "ग्रामीण प्रदर्शन रिपोर्ट"),
      desc: t(
        "Block-level grievance status & resolution metrics",
        "प्रखंड-स्तरीय शिकायत स्थिति और निस्तारण मीट्रिक",
      ),
      icon: FileText,
    },
    {
      id: "ulb",
      name: t("ULB Leadership Board", "ULB नेतृत्व बोर्ड"),
      desc: t(
        "Ranked ULB performance with trend indicators",
        "रुझान संकेतकों के साथ रैंक किया गया ULB प्रदर्शन",
      ),
      icon: FileBarChart,
    },
    {
      id: "ivr",
      name: t("IVR Report", "आईवीआर रिपोर्ट"),
      desc: t(
        "Call success rate, agent attendance, IVR metrics",
        "कॉल सफलता दर, एजेंट उपस्थिति, आईवीआर मीट्रिक",
      ),
      icon: FileText,
    },
    {
      id: "agent",
      name: t("Agent Performance Report", "एजेंट प्रदर्शन रिपोर्ट"),
      desc: t(
        "Individual agent stats - calls, resolution, CSAT, SLA",
        "व्यक्तिगत एजेंट आंकड़े - कॉल, निस्तारण, CSAT, SLA",
      ),
      icon: FileText,
    },
  ];

  const periodLabels = {
    cy: t("Calendar Year 2026", "कैलेंडर वर्ष 2026"),
    fy: t("FY 2025-26", "वित्तीय वर्ष 2025-26"),
    custom: t("Custom Range", "कस्टम अवधि"),
  };

  const currentReport =
    reportsList.find((r) => r.id === selectedReport) || reportsList[0];

  const params = useMemo(() => {
    const next = {
      report: selectedReport,
      district: !district || district == "all" ? "" : district,
      dateRange,
    };
    if (dateRange === "custom") {
      next.fromDate = fromDate;
      next.toDate = toDate;
    }
    return next;
  }, [selectedReport, district, dateRange, fromDate, toDate]);

  const queryEnabled = dateRange !== "custom" || (!!fromDate && !!toDate);
  const {
    data: demographics,
    isLoading: demographicsLoading,
    error: demographicsError,
  } = useGetDemographics([], { page: 1, limit: MAX_LIMIT });
  const districtOptions = (demographics?.data?.data?.docs || []).map((d) => ({
    label: t(d.name, d.nameHindi),
    value: d._id,
  }));

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
      return normalizeIvrRows(rawRows, t);
    }
    return Array.isArray(rawRows) ? rawRows : [];
  }, [selectedReport, rawRows, t]);

  const reportColumns = getReportColumns(selectedReport, t);

  const stats = statsRes?.data?.data || {};
  const statTiles = [
    {
      label: t("Total Reports Generated", "कुल जनरेट की गई रिपोर्ट"),
      value: stats.totalReportsGenerated ?? 0,
      icon: FileText,
      color: "blue",
    },
    {
      label: t("This Month", "इस महीने"),
      value: stats.thisMonth ?? 0,
      icon: Calendar,
      color: "emerald",
    },
    {
      label: t("Statutory Reports", "वैधानिक रिपोर्ट"),
      value: stats.statutoryReports ?? 0,
      icon: FileCheck,
      color: "purple",
    },
    {
      label: t("Pending Reports", "लंबित रिपोर्ट"),
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
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <SectionTitle
          title={t("MIS Reports", "एमआईएस रिपोर्ट")}
          subtitle={t(
            "Downloadable reports for senior officials & statutory reporting",
            "वरिष्ठ अधिकारियों और वैधानिक रिपोर्टिंग के लिए डाउनलोड करने योग्य रिपोर्ट",
          )}
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
              <Filter className="w-4 h-4" />{" "}
              {t("Select Report:", "रिपोर्ट चुनें:")}
            </span>
            <Select
              value={selectedReport}
              onValueChange={(v) => setSearchParams({ report: v })}
            >
              <SelectTrigger className="w-72 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportsList.map((r) => (
                  <SelectItem key={r.id} value={r.id} className="text-sm">
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="w-px h-8 bg-border mx-1" />

            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Filter className="w-4 h-4" /> {t("District:", "जिला:")}
            </span>
            <LoaderErrWrapper
              isLoading={demographicsLoading}
              error={demographicsError}
            >
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="w-44 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-sm">
                    {t("All Districts", "सभी जिले")}
                  </SelectItem>
                  {districtOptions.map((d) => (
                    <SelectItem
                      key={d.value}
                      value={d.value}
                      className="text-sm"
                    >
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </LoaderErrWrapper>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-44 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cy" className="text-sm">
                  {t("Calendar Year 2026", "कैलेंडर वर्ष 2026")}
                </SelectItem>
                <SelectItem value="fy" className="text-sm">
                  {t("FY 2025-26", "वित्तीय वर्ष 2025-26")}
                </SelectItem>
                <SelectItem value="custom" className="text-sm">
                  {t("Custom Date Range", "कस्टम अवधि")}
                </SelectItem>
              </SelectContent>
            </Select>
            {dateRange === "custom" && (
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-2 py-1.5 text-sm border border-input rounded-md"
                />
                <span className="text-muted-foreground text-sm">
                  {t("to", "तक")}
                </span>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-2 py-1.5 text-sm border border-input rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border">
          <div className="flex items-start gap-4 mb-4  p-4 sm:p-6 pb-0 sm:pb-0">
            <div className="hidden sm:flex w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
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
                {t("Period:", "अवधि:")}{" "}
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
          <div>
            <LoaderErrWrapper
              isLoading={isLoading}
              error={error?.response?.data?.message || error?.message}
            >
              {selectedReport === "officer" && (
                <OfficerRankingTable reportRows={reportRows} />
              )}
              {selectedReport === "service" && (
                <ServicePerformanceTable reportRows={reportRows} />
              )}
              {(selectedReport === "urban" || selectedReport === "ulb") && (
                <UlbPerformanceTable reportRows={reportRows} />
              )}
              {selectedReport === "rural" && (
                <BlockPerformanceTable reportRows={reportRows} />
              )}
              {selectedReport === "agent" && (
                <AgentPerformanceTable reportRows={reportRows} />
              )}
              {selectedReport === "ivr" && (
                <IvrReportTable reportRows={reportRows} />
              )}
              {(selectedReport === "summary" ||
                ![
                  "officer",
                  "service",
                  "urban",
                  "ulb",
                  "rural",
                  "agent",
                  "ivr",
                ].includes(selectedReport)) && (
                <DistrictSummaryTable reportRows={reportRows} />
              )}
            </LoaderErrWrapper>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 xs:gap-4 sm:gap-6 mb-3">
            <div className="flex items-center gap-2.5 xs:gap-3">
              <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base xs:text-lg sm:text-xl">
                  {t(
                    "AI-Generated MIS Cover Note",
                    "AI द्वारा जनरेट किया गया MIS कवर नोट",
                  )}
                </h3>
                <p className="text-white/70 text-xs xs:text-sm">
                  {t(
                    "Auto-generated summary with key insights & recommendations",
                    "मुख्य अंतर्दृष्टि और सिफारिशों के साथ स्वचालित सारांश",
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white text-xs xs:text-sm px-3 py-1.5 xs:px-4 xs:py-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />{" "}
                  {t("Generating...", "जनरेट हो रहा है...")}
                </>
              ) : showSummary ? (
                t("Regenerate", "पुनः जनरेट करें")
              ) : (
                t("Generate Summary", "सारांश जनरेट करें")
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
                  <Download className="w-4 h-4 mr-1" />{" "}
                  {t("Download PDF", "PDF डाउनलोड करें")}
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
                  <FileSpreadsheet className="w-4 h-4 mr-1" />{" "}
                  {t("Download Excel", "एक्सेल डाउनलोड करें")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
