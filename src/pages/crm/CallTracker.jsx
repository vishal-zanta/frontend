import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  PhoneCall,
  PhoneMissed,
  Search,
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
import { SectionTitle } from "@/components/ChartCard";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import CallTrackerCards from "./components/CallTrackerCards";

export default function CallTracker() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [agentFilter, setAgentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const exportColumns = [
    { key: "id", label: t("Call ID", "कॉल आईडी") },
    { key: "time", label: t("Time", "समय") },
    { key: "agent", label: t("Agent", "एजेंट") },
    { key: "duration", label: t("Duration", "अवधि") },
    { key: "complaintId", label: t("Complaint ID", "शिकायत आईडी") },
    { key: "disposition", label: t("Disposition", "निपटान") },
    { key: "status", label: t("Status", "स्थिति") },
  ];

  const filtered = CALL_TRACKER.filter((c) => {
    if (
      search &&
      !c.id.toLowerCase().includes(search.toLowerCase()) &&
      !(c.complaintId || "").toLowerCase().includes(search.toLowerCase())
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
    { id: "time", label: t("Time", "समय") },
    { id: "agent", label: t("Agent", "एजेंट") },
    { id: "duration", label: t("Duration", "अवधि") },
    { id: "complaint", label: t("Complaint ID", "शिकायत आईडी") },
    { id: "disposition", label: t("Disposition", "निपटान") },
    { id: "status", label: t("Status", "स्थिति") },
  ];

  const tableBody = filtered.map((c) => ({
    id: {
      render: () => <CallId id={c.id} />,
    },
    time: {
      value: c.time || "N/A",
      className: "text-muted-foreground",
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
    disposition: {
      value: c.disposition || "N/A",
      className: "text-muted-foreground",
    },
    status: {
      render: () => (
        <Badge
          variant="outline"
          className={`text-xs ${
            c.status === "Resolved"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : c.status === "Missed"
                ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                : c.status === "Escalated"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  : "bg-muted/50 text-muted-foreground border-border"
          }`}
        >
          {c.status === "Resolved"
            ? t("Resolved", "हल की गई")
            : c.status === "Missed"
              ? t("Missed", "छूटी हुई")
              : c.status === "Escalated"
                ? t("Escalated", "बढ़ाया गया")
                : c.status || "N/A"}
        </Badge>
      ),
    },
  }));

  return (
    <PortalLayout role="crm">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <SectionTitle
          title={t("Call Tracker", "कॉल ट्रैकर")}
          subtitle={t(
            "Real-time call tracking with disposition details and agent status.",
            "कॉल स्थिति और एजेंट स्थिति विवरण के साथ वास्तविक समय कॉल ट्रैकिंग।"
          )}
        >
          <ExportButton
            data={filtered}
            columns={exportColumns}
            filename="call_tracker_report"
          />
        </SectionTitle>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={PhoneCall}
            label={t("Total Calls Today", "आज की कुल कॉल")}
            value="3,420"
            color="blue"
            trend="up"
            trendValue="+8% vs yesterday"
          />
          <StatCard
            icon={CheckCircle2}
            label={t("Answered", "उत्तरित")}
            value="3,198"
            color="green"
            trend="up"
            trendValue="+5% vs yesterday"
          />
          <StatCard
            icon={PhoneMissed}
            label={t("Missed", "छूटी हुई")}
            value="222"
            color="red"
            trend="down"
            trendValue="-3% vs yesterday"
          />
          <StatCard
            icon={Clock}
            label={t("Avg Talk Time", "औसत बात करने का समय")}
            value="4m 32s"
            color="amber"
          />
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-3 xs:p-4 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-2.5 sm:gap-3">
          <div className="relative w-full xs:w-auto flex-1 max-w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(
                "Search by call ID or complaint...",
                "कॉल आईडी या शिकायत द्वारा खोजें..."
              )}
              className="pl-8 w-full"
            />
          </div>
          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="w-full xs:w-36 sm:w-40 bg-background">
              <SelectValue placeholder={t("Agent", "एजेंट")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("All Agents", "सभी एजेंट")}
              </SelectItem>
              <SelectItem value="priya">Priya Sharma</SelectItem>
              <SelectItem value="amit">Amit Verma</SelectItem>
              <SelectItem value="neha">Neha Singh</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full xs:w-32 sm:w-36 bg-background">
              <SelectValue placeholder={t("Status", "स्थिति")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("All Status", "सभी स्थिति")}
              </SelectItem>
              <SelectItem value="resolved">
                {t("Resolved", "हल की गई")}
              </SelectItem>
              <SelectItem value="missed">{t("Missed", "छूटी हुई")}</SelectItem>
              <SelectItem value="escalated">
                {t("Escalated", "बढ़ाया गया")}
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="xs:ml-auto text-xs xs:text-sm text-muted-foreground self-center">
            {t("Showing", "दिखा रहा है")} {filtered.length} {t("of", "का")}{" "}
            {CALL_TRACKER.length} {t("calls", "कॉल")}
          </div>
        </div>

        {/* Call table / cards */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isMobile ? (
            <CallTrackerCards calls={filtered} />
          ) : (
            <MyTable
              tableHeaders={tableHeaders}
              tableBody={tableBody}
              emptyText={t(
                "No calls match your filters.",
                "आपके फ़िल्टर से कोई कॉल मेल नहीं खाती।"
              )}
            />
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
