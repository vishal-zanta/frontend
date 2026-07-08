import React, { useState } from "react";
import { UserCog, Plus, Search, MapPin, CheckCircle2, AlertTriangle, Save, X, Check, Pencil, Trash2 } from "lucide-react";
import { OFFICER_TAGGING, OFFICERS, SERVICES } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OfficerTagging() {
  const [tagging, setTagging] = useState(OFFICER_TAGGING);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [dialog, setDialog] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const filtered = tagging.filter(t => !search || t.officer.toLowerCase().includes(search.toLowerCase()));

  const handleSaveTagging = () => {
    showToast("Officer tagging saved successfully");
  };

  const handleSaveItem = () => {
    showToast(`Tagging ${editItem ? "updated" : "added"} successfully`);
    setDialog(null);
    setEditItem(null);
  };

  const handleDelete = (item) => {
    setTagging(prev => prev.filter(t => t.officer !== item.officer));
    showToast(`"${item.officer}" tagging removed`);
  };

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <SectionTitle title="Officer Tagging" subtitle="Tag officers to multiple services and multiple wards — manually assigned due to location restriction" />

        {toast && (
          <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" /> {toast}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-blue-600">{OFFICERS.filter(o => o.designation === "l1-officer").length}</div>
            <div className="text-sm text-muted-foreground">L1 Officers</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-purple-600">{OFFICERS.filter(o => o.designation === "l2-officer").length}</div>
            <div className="text-sm text-muted-foreground">L2 Officers</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-emerald-600">{tagging.filter(o => o.slaCompliant).length}</div>
            <div className="text-sm text-muted-foreground">SLA Compliant</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-red-600">{tagging.filter(o => !o.slaCompliant).length}</div>
            <div className="text-sm text-muted-foreground">SLA Breach Risk</div>
          </div>
        </div>

        {/* Search + Add */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search officer by name..." className="pl-9" />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setEditItem(null); setDialog({ officer: "", designation: "L1 Field Officer", services: [], wards: [], activeComplaints: 0, slaCompliant: true }); }}>
            <Plus className="w-4 h-4 mr-1" /> Tag New Officer
          </Button>
        </div>

        {/* Tagging table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Officer</th>
                  <th className="px-4 py-3 font-medium">Designation</th>
                  <th className="px-4 py-3 font-medium">Services</th>
                  <th className="px-4 py-3 font-medium">Wards</th>
                  <th className="px-4 py-3 font-medium text-center">Active</th>
                  <th className="px-4 py-3 font-medium text-center">SLA</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((o, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{o.officer}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.designation}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {o.services.map((s, si) => (
                          <Badge key={si} variant="outline" className="text-[10px] bg-blue-50 text-blue-700">{s}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {o.wards.map((w, wi) => (
                          <Badge key={wi} variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700">{w}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">{o.activeComplaints}</td>
                    <td className="px-4 py-3 text-center">
                      {o.slaCompliant ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <AlertTriangle className="w-4 h-4 text-red-500 mx-auto" />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditItem(o); setDialog({ ...o, services: [...o.services], wards: [...o.wards] }); }}>
                          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(o)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add tagging form */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><UserCog className="w-5 h-5 text-blue-500" /> Quick Tag Officer</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Select Officer *</label>
              <select className="w-full border border-input rounded-md p-2 text-sm">
                {OFFICERS.map(o => <option key={o.id} value={o.id}>{o.name} ({o.designationLabel})</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Services (Multi-select) *</label>
              <select multiple className="w-full border border-input rounded-md p-2 text-sm h-24">
                {SERVICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Wards (Comma-separated) *</label>
              <Input placeholder="e.g., Patna Ward-12, Patna Ward-13" />
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Manual entry due to location restriction</div>
            </div>
          </div>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleSaveTagging}>
            <Save className="w-4 h-4 mr-1" /> Save Tagging
          </Button>
        </div>

        {/* Add/Edit Dialog */}
        {dialog && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDialog(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h3 className="font-bold text-foreground">{editItem ? "Edit Tagging" : "Tag New Officer"}</h3>
                <button onClick={() => setDialog(null)} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <Label className="mb-1.5 block">Officer Name *</Label>
                  <Input value={dialog.officer || ""} onChange={e => setDialog({ ...dialog, officer: e.target.value })} placeholder="e.g., Rajesh Kumar Singh" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Designation</Label>
                  <Input value={dialog.designation || ""} onChange={e => setDialog({ ...dialog, designation: e.target.value })} placeholder="e.g., L1 Field Officer" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Services (comma-separated)</Label>
                  <Input value={(dialog.services || []).join(", ")} onChange={e => setDialog({ ...dialog, services: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} placeholder="e.g., Street Lighting, Drainage" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Wards (comma-separated)</Label>
                  <Input value={(dialog.wards || []).join(", ")} onChange={e => setDialog({ ...dialog, wards: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} placeholder="e.g., Patna Ward-12, Patna Ward-13" />
                </div>
              </div>
              <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveItem}>
                  <Check className="w-4 h-4 mr-1" /> Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Rules */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h4 className="font-bold text-amber-800 mb-2 text-sm">⚠ Officer Tagging Rules</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• A single officer can be tagged to multiple services and multiple wards</li>
            <li>• Every SLA must have at least 1 officer — or the ticket will not be visible</li>
            <li>• Officers can only be added manually due to location restriction</li>
            <li>• If a ticket remains unassigned, it can be reassigned later</li>
          </ul>
        </div>
      </div>
    </PortalLayout>
  );
}