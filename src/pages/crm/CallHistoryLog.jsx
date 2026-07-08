import React, { useState } from "react";
import { Phone, Clock, CheckCircle2, PhoneCall, PhoneMissed, Search, Tag, Download, ShieldCheck, Filter } from "lucide-react";
import { CALL_TRACKER, CRM_AGENTS } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import StatCard from "@/components/StatCard";
import { CallId, ComplaintId } from "@/components/ComplaintDetailDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExportButton from "@/components/ExportButton";

// Extend call tracker with recording metadata and evidence tags
const callHistoryLog = CALL_TRACKER.map((c, i) => ({
  ...c,
  recordingUrl: `rec:// recordings/${c.id}.mp3`,
  recordingDuration: c.duration,
  evidenceTagged: i % 4 === 0, // every 4th call is evidence-tagged
  evidenceReason: i % 4 === 0 ? "Legal escalation — dispute case" : null,
  taggedBy: i % 4 === 0 ? "Supervisor: Amit Verma" : null,
  taggedDate: i % 4 === 0 ? "06 Jul 2026" : null,
  citizenMobile: `+91 9835${String(100000 + i * 137).slice(0, 6)}`,
  callType: i % 3 === 0 ? "Outbound" : "Inbound",
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
  { key: r => r.evidenceTagged ? "YES — " + (r.evidenceReason || "") : "No", label: "Evidence Tagged" },
];

export default function CallHistoryLog() {
  const [search, setSearch] = useState("");
  const [agentFilter, setAgentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [evidenceOnly, setEvidenceOnly] = useState(false);
  const [selected, setSelected] = useState([]);
  const [tagDialog, setTagDialog] = useState(null);

  const filtered = callHistoryLog.filter(c => {
    if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !(c.complaintId || "").toLowerCase().includes(search.toLowerCase()) && !c.citizenMobile.includes(search)) return false;
    if (agentFilter !== "all" && !c.agent.toLowerCase().includes(agentFilter)) return false;
    if (statusFilter !== "all" && c.status.toLowerCase() !== statusFilter) return false;
    if (evidenceOnly && !c.evidenceTagged) return false;
    return true;
  });

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(c => c.id));
  };

  const handleTagEvidence = () => {
    // In a real app, this would persist; here we just close the dialog
    setTagDialog(null);
  };

  const evidenceCount = callHistoryLog.filter(c => c.evidenceTagged).length;

  return (
    <PortalLayout role="crm">
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Call History Log</h1>
            <p className="text-sm text-muted-foreground">Complete call archive with recording metadata, bulk export, and evidence-tagging for legal/audit purposes.</p>
          </div>
          <ExportButton data={filtered} columns={exportColumns} filename="call_history_log" label="Export" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={PhoneCall} label="Total Calls Logged" value={callHistoryLog.length} color="blue" />
          <StatCard icon={ShieldCheck} label="Evidence Tagged" value={evidenceCount} color="purple" />
          <StatCard icon={PhoneMissed} label="Missed / Dropped" value={callHistoryLog.filter(c => c.status === "Missed").length} color="red" />
          <StatCard icon={Clock} label="Avg Duration" value="4m 32s" color="amber" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-4 flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by call ID, complaint, or mobile..." className="pl-8 max-w-xs" />
          </div>
          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Agent" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              <SelectItem value="priya">Priya Sharma</SelectItem>
              <SelectItem value="amit">Amit Verma</SelectItem>
              <SelectItem value="neha">Neha Singh</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={evidenceOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setEvidenceOnly(!evidenceOnly)}
            className="ml-auto"
          >
            <ShieldCheck className="w-4 h-4 mr-1" /> {evidenceOnly ? "Showing Evidence Only" : "Show Evidence Only"}
          </Button>
          {selected.length > 0 && (
            <Button size="sm" onClick={() => setTagDialog({ ids: selected })} className="bg-purple-600 hover:bg-purple-700">
              <Tag className="w-4 h-4 mr-1" /> Tag {selected.length} as Evidence
            </Button>
          )}
        </div>

        {/* Call history table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-3 py-3 font-medium">
                    <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded" />
                  </th>
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
                  <tr key={i} className={`hover:bg-muted/30 ${selected.includes(c.id) ? "bg-purple-50/40" : ""}`}>
                    <td className="px-3 py-3">
                      <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} className="rounded" />
                    </td>
                    <td className="px-3 py-3"><CallId id={c.id} /></td>
                    <td className="px-3 py-3">
                      <Badge variant="outline" className={`text-[10px] ${c.callType === "Outbound" ? "bg-sky-50 text-sky-700" : "bg-blue-50 text-primary"}`}>{c.callType}</Badge>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{c.time}</td>
                    <td className="px-3 py-3 font-mono text-xs">{c.citizenMobile}</td>
                    <td className="px-3 py-3">{c.agent}</td>
                    <td className="px-3 py-3 text-muted-foreground">{c.duration}</td>
                    <td className="px-3 py-3">{c.complaintId ? <ComplaintId id={c.complaintId} /> : "—"}</td>
                    <td className="px-3 py-3">
                      <Badge variant="outline" className={`text-xs ${c.status === "Resolved" ? "bg-emerald-50 text-emerald-700" : c.status === "Missed" ? "bg-red-50 text-red-700" : c.status === "Escalated" ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-600"}`}>{c.status}</Badge>
                    </td>
                    <td className="px-3 py-3">
                      {c.evidenceTagged ? (
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          <span className="text-xs text-purple-600 font-medium">Tagged</span>
                        </div>
                      ) : (
                        <button onClick={() => setTagDialog({ ids: [c.id] })} className="text-xs text-muted-foreground hover:text-primary underline">Tag</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">No calls match your filters.</div>
          )}
        </div>

        {/* Bulk actions bar */}
        <div className="bg-muted/50 rounded-xl border border-border p-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selected.length > 0 ? `${selected.length} call(s) selected` : "Click checkboxes to select calls for bulk actions"}
          </div>
          <div className="flex gap-2">
            <ExportButton data={selected.length > 0 ? filtered.filter(c => selected.includes(c.id)) : filtered} columns={exportColumns} filename={selected.length > 0 ? "call_history_selected" : "call_history_all"} />
          </div>
        </div>
      </div>

      {/* Evidence tag dialog */}
      {tagDialog && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setTagDialog(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-foreground">Tag {tagDialog.ids.length} Call(s) as Evidence</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-700">
                Evidence-tagged calls are preserved with enhanced retention (7 years) and flagged for legal/audit review. Recordings cannot be deleted while tagged.
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Tagging Reason *</label>
                <Input placeholder="e.g., Legal escalation, dispute case, citizen complaint against agent..." />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Case Reference (optional)</label>
                <Input placeholder="e.g., LEGAL-2026-00472" />
              </div>
            </div>
            <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setTagDialog(null)}>Cancel</Button>
              <Button onClick={handleTagEvidence} className="bg-purple-600 hover:bg-purple-700">
                <ShieldCheck className="w-4 h-4 mr-1" /> Confirm Evidence Tag
              </Button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}