import React, { useState } from "react";
import { Search, MapPin, Clock, Camera, Calendar, CheckCircle2 } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { ComplaintId, FieldVisitId, FIELD_VISIT_DATA } from "@/components/ComplaintDetailDialog";
import { PriorityBadge } from "@/components/Badges";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function FieldVisits() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = FIELD_VISIT_DATA.filter(fv => {
    if (search && !fv.complaintId.toLowerCase().includes(search.toLowerCase()) && !fv.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && fv.status !== statusFilter) return false;
    return true;
  });

  return (
    <PortalLayout role="officer">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Field Visits</h1>
          <p className="text-sm text-muted-foreground">Track all scheduled, in-progress, and completed field visits with geo-tagged photo evidence.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-border p-4"><div className="text-2xl font-bold text-blue-600">{FIELD_VISIT_DATA.length}</div><div className="text-sm text-muted-foreground">Total Visits</div></div>
          <div className="bg-white rounded-xl border border-border p-4"><div className="text-2xl font-bold text-amber-600">{FIELD_VISIT_DATA.filter(f => f.status === "Scheduled").length}</div><div className="text-sm text-muted-foreground">Scheduled</div></div>
          <div className="bg-white rounded-xl border border-border p-4"><div className="text-2xl font-bold text-purple-600">{FIELD_VISIT_DATA.filter(f => f.status === "In Progress").length}</div><div className="text-sm text-muted-foreground">In Progress</div></div>
          <div className="bg-white rounded-xl border border-border p-4"><div className="text-2xl font-bold text-emerald-600">{FIELD_VISIT_DATA.filter(f => f.status === "Completed").length}</div><div className="text-sm text-muted-foreground">Completed</div></div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by visit ID or complaint ID..." className="pl-9" />
          </div>
          <select className="border border-input rounded-md px-3 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Visit ID</th>
                  <th className="px-4 py-3 font-medium">Complaint ID</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Scheduled</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Geo-Tag</th>
                  <th className="px-4 py-3 font-medium">Photo</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((fv, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-3"><FieldVisitId id={fv.id} /></td>
                    <td className="px-4 py-3"><ComplaintId id={fv.complaintId} /></td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{fv.service}<div className="text-[10px] text-muted-foreground">{fv.subservice}</div></td>
                    <td className="px-4 py-3 text-xs"><MapPin className="w-3 h-3 inline mr-1" />{fv.ward}, {fv.district}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground"><Calendar className="w-3 h-3 inline mr-1" />{fv.scheduledDate}</td>
                    <td className="px-4 py-3"><PriorityBadge priority={fv.priority} /></td>
                    <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">{fv.geoTag}</td>
                    <td className="px-4 py-3">{fv.photoUploaded ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Camera className="w-4 h-4 text-muted-foreground" />}</td>
                    <td className="px-4 py-3"><Badge variant="outline" className={`text-xs ${fv.status === "Completed" ? "bg-emerald-50 text-emerald-700" : fv.status === "In Progress" ? "bg-purple-50 text-purple-700" : "bg-amber-50 text-amber-700"}`}>{fv.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-8 text-sm text-muted-foreground">No field visits match your filters.</div>}
        </div>
      </div>
    </PortalLayout>
  );
}