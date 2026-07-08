import React, { useState } from "react";
import { Search, Filter, MapPin, Clock, Camera, CheckCircle2, XCircle, Pause, RotateCcw, Lock, Upload, Phone, AlertTriangle } from "lucide-react";
import { COMPLAINTS, OFFICERS } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import StatCard from "@/components/StatCard";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import ComplaintTimeline from "@/components/ComplaintTimeline";
import ComplaintMap from "@/components/ComplaintMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePortalProfile } from "@/hooks/usePortalProfile";

const officerProfileMap = {
  l1: OFFICERS[0],
  l2: OFFICERS[3],
  zone: OFFICERS[6],
  division: OFFICERS[6],
  suda: OFFICERS[8],
};

const statusActions = [
  { label: "Mark Resolved", icon: CheckCircle2, color: "bg-emerald-600 hover:bg-emerald-700", newStatus: "Resolved" },
  { label: "Reject", icon: XCircle, color: "bg-red-600 hover:bg-red-700", newStatus: "Rejected" },
  { label: "On Hold", icon: Pause, color: "bg-amber-600 hover:bg-amber-700", newStatus: "On Hold" },
  { label: "Reopen", icon: RotateCcw, color: "bg-yellow-600 hover:bg-yellow-700", newStatus: "Reopened" },
  { label: "Close", icon: Lock, color: "bg-slate-600 hover:bg-slate-700", newStatus: "Closed" },
];

export default function OfficerComplaints() {
  const [profileId] = usePortalProfile("officer");
  const officer = officerProfileMap[profileId] || OFFICERS[0];
  const myComplaints = COMPLAINTS.filter(c => c.l1Officer === officer.id || c.l2Officer === officer.id);
  const [selected, setSelected] = useState(myComplaints[0]);
  const [statusUpdate, setStatusUpdate] = useState(null);

  return (
    <PortalLayout role="officer">
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Search} label="Total Assigned" value={myComplaints.length} color="blue" />
          <StatCard icon={Clock} label="Pending Action" value={myComplaints.filter(c => !["Resolved", "Closed"].includes(c.status)).length} color="amber" />
          <StatCard icon={CheckCircle2} label="Resolved" value={myComplaints.filter(c => ["Resolved", "Closed"].includes(c.status)).length} color="green" />
          <StatCard icon={AlertTriangle} label="SLA Breach Risk" value={myComplaints.filter(c => c.status === "Escalated").length} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Complaint list */}
          <div className="bg-white rounded-xl border border-border">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground text-sm">My Complaints ({myComplaints.length})</h3>
              <Button variant="ghost" size="sm"><Filter className="w-4 h-4" /></Button>
            </div>
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto scrollbar-thin">
              {myComplaints.map((c, i) => (
                <button
                  key={i}
                  onClick={() => { setSelected(c); setStatusUpdate(null); }}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${selected?.id === c.id ? "bg-blue-50 border-l-4 border-blue-600" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ComplaintId id={c.id} className="text-xs font-semibold" />
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="text-sm text-foreground truncate">{c.subserviceName}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {c.ward}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2 space-y-4">
            {selected && (
              <>
                <div className="bg-white rounded-xl border border-border p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-bold text-primary font-mono">{selected.id}</h2>
                        <StatusBadge status={selected.status} />
                        <PriorityBadge priority={selected.priority} />
                      </div>
                      <p className="text-sm text-foreground">{selected.serviceName} → {selected.subserviceName}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>Filed: {new Date(selected.createdDate).toLocaleDateString("en-IN")}</div>
                      <div>SLA: {selected.slaHours}h</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">Citizen</div>
                      <div className="font-medium">{selected.citizenName}</div>
                      <div className="text-xs text-blue-600 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {selected.mobile}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">Location</div>
                      <div className="font-medium">{selected.ward}</div>
                      <div className="text-xs text-muted-foreground">{selected.districtName}</div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <div className="text-xs text-muted-foreground mb-1">Description</div>
                    <p className="text-sm">{selected.description}</p>
                  </div>

                  {selected.photoUrl && (
                    <div className="mb-4">
                      <div className="text-xs text-muted-foreground mb-1">Citizen Photo</div>
                      <img src={selected.photoUrl} alt="Complaint" className="w-full h-40 object-cover rounded-lg" />
                    </div>
                  )}

                  {/* Status actions */}
                  <div className="border-t border-border pt-4">
                    <div className="text-sm font-medium text-foreground mb-2">Update Status</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {statusActions.map((a, i) => {
                        const Icon = a.icon;
                        return (
                          <button
                            key={i}
                            onClick={() => setStatusUpdate(a.newStatus)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm ${a.color} transition-colors`}
                          >
                            <Icon className="w-4 h-4" /> {a.label}
                          </button>
                        );
                      })}
                    </div>

                    {statusUpdate && (
                      <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                        ✓ Status updated to <strong>{statusUpdate}</strong>. SMS notification sent to citizen. Audit trail entry created.
                      </div>
                    )}
                  </div>

                  {/* Geo-tag upload */}
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="text-sm font-medium text-foreground mb-2">Geo-Tag Photo Upload</div>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <Camera className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to capture/upload field photo with geo-tag</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="font-bold text-foreground mb-4">Complaint Timeline</h3>
                  <ComplaintTimeline events={selected.timeline} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}