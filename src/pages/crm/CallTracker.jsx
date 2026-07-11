import React, { useState } from "react";
import {
  Phone,
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

const exportColumns = [
  { key: "id", label: "Call ID" },
  { key: "time", label: "Time" },
  { key: "agent", label: "Agent" },
  { key: "duration", label: "Duration" },
  { key: "complaintId", label: "Complaint ID" },
  { key: "disposition", label: "Disposition" },
  { key: "status", label: "Status" },
];

export default function CallTracker() {
  const [search, setSearch] = useState("");
  const [agentFilter, setAgentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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
            <h1 className="text-2xl font-bold text-foreground">Call Tracker</h1>
            <p className="text-sm text-muted-foreground">
              Real-time call tracking with disposition details and agent status.
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
            label="Total Calls Today"
            value="3,420"
            color="blue"
            trend="up"
            trendValue="+8% vs yesterday"
          />
          <StatCard
            icon={CheckCircle2}
            label="Answered"
            value="3,198"
            color="green"
            trend="up"
            trendValue="+5% vs yesterday"
          />
          <StatCard
            icon={PhoneMissed}
            label="Missed"
            value="222"
            color="red"
            trend="down"
            trendValue="-3% vs yesterday"
          />
          <StatCard
            icon={Clock}
            label="Avg Talk Time"
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
              placeholder="Search by call ID or complaint..."
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
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto text-sm text-muted-foreground">
            Showing {filtered.length} of {CALL_TRACKER.length} calls
          </div>
        </div>

        {/* Call table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Call ID</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Agent</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Complaint ID</th>
                  <th className="px-4 py-3 font-medium">Disposition</th>
                  <th className="px-4 py-3 font-medium">Status</th>
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
                    <td className="px-4 py-3">
                      {c.complaintId ? <ComplaintId id={c.complaintId} /> : "-"}
                    </td>
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
                        {c.status}
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
