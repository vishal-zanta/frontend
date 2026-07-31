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

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("Call History Log", "कॉल इतिहास लॉग")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("Complete call centre call archive with recording metadata and export for audit.", "रिकॉर्डिंग मेटाडेटा और ऑडिट के लिए निर्यात के साथ पूरा कॉल सेंटर कॉल संग्रह।")}
            </p>
          </div>
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
              placeholder={t("Search by call ID, complaint, or mobile...", "कॉल आईडी, शिकायत या मोबाइल द्वारा खोजें...")}
              className="pl-8 max-w-xs"
            />
          </div>
          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("Agent", "एजेंट")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Agents", "सभी एजेंट")}</SelectItem>
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
              <SelectItem value="all">{t("All Status", "सभी स्थितियां")}</SelectItem>
              <SelectItem value="resolved">{t("Resolved", "निराकृत")}</SelectItem>
              <SelectItem value="missed">{t("Missed", "छूटी हुई")}</SelectItem>
              <SelectItem value="escalated">{t("Escalated", "बढ़ाई गई")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white dark:bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-3 py-3 font-medium">{t("Call ID", "कॉल आईडी")}</th>
                  <th className="px-3 py-3 font-medium">{t("Type", "प्रकार")}</th>
                  <th className="px-3 py-3 font-medium">{t("Date / Time", "तिथि / समय")}</th>
                  <th className="px-3 py-3 font-medium">{t("Citizen Mobile", "नागरिक मोबाइल")}</th>
                  <th className="px-3 py-3 font-medium">{t("Agent", "एजेंट")}</th>
                  <th className="px-3 py-3 font-medium">{t("Duration", "अवधि")}</th>
                  <th className="px-3 py-3 font-medium">{t("Complaint", "शिकायत")}</th>
                  <th className="px-3 py-3 font-medium">{t("Status", "स्थिति")}</th>
                  <th className="px-3 py-3 font-medium">{t("Evidence", "साक्ष्य")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-3 py-3">
                      <CallId id={c.id} />
                    </td>
                    <td className="px-3 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${c.callType === "Outbound" ? "bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400" : "bg-blue-50 text-primary dark:bg-blue-950/30 dark:text-blue-400"}`}
                      >
                        {c.callType}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {c.time}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs">
                      {c.citizenMobile}
                    </td>
                    <td className="px-3 py-3">{c.agent}</td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {c.duration}
                    </td>
                    <td className="px-3 py-3">
                      {c.complaintId ? <ComplaintId id={c.complaintId} /> : "-"}
                    </td>
                    <td className="px-3 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${c.status === "Resolved" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : c.status === "Missed" ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400" : c.status === "Escalated" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" : "bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400"}`}
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      {c.evidenceTagged ? (
                        <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {t("No calls match your filters.", "आपके फ़िल्टर से कोई कॉल मेल नहीं खाती।")}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
