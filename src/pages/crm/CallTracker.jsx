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
import { CallId } from "@/components/ComplaintDetailDialog";
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

export default function CallTracker() {
  const { t } = useLanguage();
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

  return (
    <PortalLayout role="crm">
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("Call Tracker", "कॉल ट्रैकर")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(
                "Real-time call tracking with disposition details and agent status.",
                "कॉल स्थिति और एजेंट स्थिति विवरण के साथ वास्तविक समय कॉल ट्रैकिंग।",
              )}
            </p>
          </div>
          <ExportButton
            data={filtered}
            columns={exportColumns}
            filename="call_tracker_report"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="bg-white rounded-xl border border-border p-4 flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(
                "Search by call ID or complaint...",
                "कॉल आईडी या शिकायत द्वारा खोजें...",
              )}
              className="pl-8 max-w-xs"
            />
          </div>
          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="w-40 bg-white">
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
            <SelectTrigger className="w-40 bg-white">
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
          <div className="ml-auto text-sm text-muted-foreground self-center">
            {t("Showing", "दिखा रहा है")} {filtered.length} {t("of", "का")}{" "}
            {CALL_TRACKER.length} {t("calls", "कॉल")}
          </div>
        </div>

        {/* Call table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F4F7FA]">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">
                    {t("Call ID", "कॉल आईडी")}
                  </th>
                  <th className="px-4 py-3 font-medium">{t("Time", "समय")}</th>
                  <th className="px-4 py-3 font-medium">
                    {t("Agent", "एजेंट")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("Duration", "अवधि")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("Complaint ID", "शिकायत आईडी")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("Disposition", "निपटान")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("Status", "स्थिति")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <CallId id={c.id} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.time}
                    </td>
                    <td className="px-4 py-3">{c.agent}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.duration}
                    </td>
                    <td className="px-4 py-3">{c.complaintId}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.disposition}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          c.status === "Resolved"
                            ? "bg-emerald-50 text-emerald-700"
                            : c.status === "Missed"
                              ? "bg-red-50 text-red-700"
                              : c.status === "Escalated"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-50 text-slate-600"
                        }`}
                      >
                        {c.status === "Resolved"
                          ? t("Resolved", "हल की गई")
                          : c.status === "Missed"
                            ? t("Missed", "छूटी हुई")
                            : c.status === "Escalated"
                              ? t("Escalated", "बढ़ाया गया")
                              : c.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
