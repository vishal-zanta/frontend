import React, { useState } from "react";
import {
  Clock,
  PhoneCall,
  PhoneMissed,
  Search,
  ShieldCheck,
} from "lucide-react";
import { CALL_TRACKER } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import StatCard from "@/components/StatCard";
import { CallId, ComplaintId } from "@/components/ComplaintDetailDialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExportButton from "@/components/ExportButton";
import { useLanguage } from "@/context/LanguageContext";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import { SectionTitle } from "@/components/ChartCard";

const callHistoryLog = CALL_TRACKER.map((c, i) => ({
  ...c,
  callType: i % 3 === 0 ? "Outbound" : "Inbound",
  citizenMobile: `+91 9835${String(100000 + i * 137).slice(0, 6)}`,
  recordingDuration: c.duration,
  evidenceTagged: i % 4 === 0,
}));

const getExportColumns = (t) => [
  { key: "id", label: t("Call ID", "कॉल आईडी") },
  { key: "callType", label: t("Type", "प्रकार") },
  { key: "time", label: t("Date/Time", "तिथि/समय") },
  { key: "citizenMobile", label: t("Citizen Mobile", "नागरिक मोबाइल") },
  { key: "agent", label: t("Agent", "एजेंट") },
  { key: "duration", label: t("Duration", "अवधि") },
  { key: "complaintId", label: t("Complaint ID", "शिकायत आईडी") },
  { key: "disposition", label: t("Disposition", "निस्तारण") },
  { key: "status", label: t("Status", "स्थिति") },
];

export default function AdminCallHistory() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [agentFilter, setAgentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = callHistoryLog.filter((c) => {
    if (
      search &&
      !c.id.toLowerCase().includes(search.toLowerCase()) &&
      !(c.complaintId || "").toLowerCase().includes(search.toLowerCase()) &&
      !c.citizenMobile.includes(search)
    )
      return false;
    if (agentFilter !== "all" && !c.agent.toLowerCase().includes(agentFilter))
      return false;
    if (statusFilter !== "all" && c.status.toLowerCase() !== statusFilter)
      return false;
    return true;
  });

  const tableHeaders = [
    { id: "id", label: t("Call ID", "कॉल आईडी") },
    { id: "type", label: t("Type", "प्रकार") },
    { id: "time", label: t("Date / Time", "तिथि / समय") },
    { id: "mobile", label: t("Citizen Mobile", "नागरिक मोबाइल") },
    { id: "agent", label: t("Agent", "एजेंट") },
    { id: "duration", label: t("Duration", "अवधि") },
    { id: "complaint", label: t("Complaint", "शिकायत") },
    { id: "status", label: t("Status", "स्थिति") },
    { id: "evidence", label: t("Evidence", "साक्ष्य") },
  ];

  const tableBody = filtered.map((c) => ({
    id: {
      render: () => <CallId id={c.id} />,
    },
    type: {
      render: () => (
        <Badge
          variant="outline"
          className={`text-[10px] ${
            c.callType === "Outbound"
              ? "bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400"
              : "bg-blue-50 text-primary dark:bg-blue-950/30 dark:text-blue-400"
          }`}
        >
          {c.callType}
        </Badge>
      ),
    },
    time: {
      value: c.time || "N/A",
      className: "text-muted-foreground",
    },
    mobile: {
      value: c.citizenMobile || "N/A",
      className: "font-mono text-xs",
    },
    agent: {
      value: c.agent || "N/A",
    },
    duration: {
      value: c.duration || "N/A",
      className: "text-muted-foreground",
    },
    complaint: {
      render: () =>
        c.complaintId ? <ComplaintId id={c.complaintId} /> : "N/A",
    },
    status: {
      render: () => (
        <Badge
          variant="outline"
          className={`text-xs ${
            c.status === "Resolved"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
              : c.status === "Missed"
                ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                : c.status === "Escalated"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                  : "bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400"
          }`}
        >
          {c.status}
        </Badge>
      ),
    },
    evidence: {
      render: () =>
        c.evidenceTagged ? (
          <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        ) : (
          "N/A"
        ),
    },
  }));

  return (
    <PortalLayout role="superadmin">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-start justify-between">
          <SectionTitle
          title={t("Call History Log", "कॉल इतिहास लॉग")}
          subtitle={t(
                "Complete call centre call archive with recording metadata and export for audit.",
                "रिकॉर्डिंग मेटाडेटा और ऑडिट के लिए निर्यात के साथ पूरा कॉल सेंटर कॉल संग्रह।",
              )}
          />
         
          <ExportButton
            data={filtered}
            columns={getExportColumns(t)}
            filename="admin_call_history"
            label={t("Export", "निर्यात")}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={PhoneCall}
            label={t("Total Calls Logged", "कुल दर्ज की गई कॉलें")}
            value={callHistoryLog.length}
            color="blue"
          />
          <StatCard
            icon={ShieldCheck}
            label={t("Evidence Tagged", "साक्ष्य टैग किए गए")}
            value={callHistoryLog.filter((c) => c.evidenceTagged).length}
            color="purple"
          />
          <StatCard
            icon={PhoneMissed}
            label={t("Missed / Dropped", "छूटी हुई / कटी कॉलें")}
            value={callHistoryLog.filter((c) => c.status === "Missed").length}
            color="red"
          />
          <StatCard
            icon={Clock}
            label={t("Avg Duration", "औसत अवधि")}
            value="4m 32s"
            color="amber"
          />
        </div>

        <div className="bg-white dark:bg-card rounded-xl border border-border p-4 flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(
                "Search by call ID, complaint, or mobile...",
                "कॉल आईडी, शिकायत या मोबाइल द्वारा खोजें...",
              )}
              className="pl-8 max-w-xs"
            />
          </div>
          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("Agent", "एजेंट")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("All Agents", "सभी एजेंट")}
              </SelectItem>
              <SelectItem value="priya">Priya Sharma</SelectItem>
              <SelectItem value="amit">Amit Verma</SelectItem>
              <SelectItem value="neha">Neha Singh</SelectItem>
              <SelectItem value="rohit">Rohit Kumar</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t("Status", "स्थिति")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("All Status", "सभी स्थितियां")}
              </SelectItem>
              <SelectItem value="resolved">
                {t("Resolved", "निराकृत")}
              </SelectItem>
              <SelectItem value="missed">{t("Missed", "छूटी हुई")}</SelectItem>
              <SelectItem value="escalated">
                {t("Escalated", "बढ़ाई गई")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white dark:bg-card rounded-xl border border-border overflow-hidden">
          {isMobile ? (
            <CallCards calls={filtered} t={t} />
          ) : (
            <MyTable
              tableHeaders={tableHeaders}
              tableBody={tableBody}
              emptyText={t(
                "No calls match your filters.",
                "आपके फ़िल्टर से कोई कॉल मेल नहीं खाती।",
              )}
            />
          )}
        </div>
      </div>
    </PortalLayout>
  );
}

function CallCards({ calls = [], t }) {
  if (!calls || calls.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No calls match your filters.", "आपके फ़िल्टर से कोई कॉल मेल नहीं खाती।")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {calls.map((c, i) => (
        <div
          key={c.id || i}
          className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden"
        >
          {/* Header */}
          <div className="p-3 xs:p-3.5 border-b border-border/60 flex items-center justify-between gap-2">
            <CallId id={c.id} />
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  c.callType === "Outbound"
                    ? "bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400"
                    : "bg-blue-50 text-primary dark:bg-blue-950/30 dark:text-blue-400"
                }`}
              >
                {c.callType}
              </Badge>
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  c.status === "Resolved"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : c.status === "Missed"
                      ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                      : c.status === "Escalated"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                        : "bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400"
                }`}
              >
                {c.status}
              </Badge>
            </div>
          </div>

          {/* Body */}
          <div className="p-3 xs:p-3.5 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("Citizen Mobile", "नागरिक मोबाइल")}
                </span>
                <span className="font-mono text-xs text-foreground block truncate">
                  {c.citizenMobile || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("Agent", "एजेंट")}
                </span>
                <span className="font-medium text-foreground text-xs block truncate">
                  {c.agent || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("Duration", "अवधि")}
                </span>
                <span className="font-medium text-foreground text-xs block truncate">
                  {c.duration || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                  {t("Complaint", "शिकायत")}
                </span>
                {c.complaintId ? (
                  <ComplaintId id={c.complaintId} />
                ) : (
                  <span className="text-muted-foreground text-xs font-medium">N/A</span>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-between text-xs">
            <span className="text-muted-foreground text-[11px]">
              {c.time || "N/A"}
            </span>
            {c.evidenceTagged ? (
              <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>{t("Evidence Tagged", "साक्ष्य टैग किया गया")}</span>
              </div>
            ) : (
              <span className="text-muted-foreground text-[11px]">N/A</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
