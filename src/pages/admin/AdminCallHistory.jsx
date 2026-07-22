import React, { useState } from "react";
import {
  Phone,
  Clock,
  CheckCircle2,
  PhoneCall,
  PhoneMissed,
  Search,
  ShieldCheck,
  Download,
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

const callHistoryLog = CALL_TRACKER.map((c, i) => ({
  ...c,
  callType: i % 3 === 0 ? "Outbound" : "Inbound",
  citizenMobile: `+91 9835${String(100000 + i * 137).slice(0, 6)}`,
  recordingDuration: c.duration,
  evidenceTagged: i % 4 === 0,
}));

const exportColumns = [
  { key: "id", label: "Call ID" },
  { key: "callType", label: "Type" },
  { key: "time", label: "Date/Time" },
  { key: "citizenMobile", label: "Citizen Mobile" },
  { key: "agent", label: "Agent" },
  { key: "duration", label: "Duration" },
  { key: "complaintId", label: "Complaint ID" },
  { key: "disposition", label: "Disposition" },
  { key: "status", label: "Status" },
];

export default function AdminCallHistory() {
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
              Call History Log
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete call centre call archive with recording metadata and
              export for audit.
            </p>
          </div>
          <ExportButton
            data={filtered}
            columns={exportColumns}
            filename="admin_call_history"
            label="Export"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={PhoneCall}
            label="Total Calls Logged"
            value={callHistoryLog.length}
            color="blue"
          />
          <StatCard
            icon={ShieldCheck}
            label="Evidence Tagged"
            value={callHistoryLog.filter((c) => c.evidenceTagged).length}
            color="purple"
          />
          <StatCard
            icon={PhoneMissed}
            label="Missed / Dropped"
            value={callHistoryLog.filter((c) => c.status === "Missed").length}
            color="red"
          />
          <StatCard
            icon={Clock}
            label="Avg Duration"
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
              placeholder="Search by call ID, complaint, or mobile..."
              className="pl-8 max-w-xs"
            />
          </div>
          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              <SelectItem value="priya">Priya Sharma</SelectItem>
              <SelectItem value="amit">Amit Verma</SelectItem>
              <SelectItem value="neha">Neha Singh</SelectItem>
              <SelectItem value="rohit">Rohit Kumar</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white dark:bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-3 py-3 font-medium">Call ID</th>
                  <th className="px-3 py-3 font-medium">Type</th>
                  <th className="px-3 py-3 font-medium">Date / Time</th>
                  <th className="px-3 py-3 font-medium">Citizen Mobile</th>
                  <th className="px-3 py-3 font-medium">Agent</th>
                  <th className="px-3 py-3 font-medium">Duration</th>
                  <th className="px-3 py-3 font-medium">Complaint</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Evidence</th>
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
              No calls match your filters.
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
