import React, { useState } from "react";
import { SlidersHorizontal, Save, Plus, AlertTriangle, CheckCircle2, Search, X, Check, Pencil, Trash2 } from "lucide-react";
import { SLA_CONFIG } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SLAConfig() {
  const [config, setConfig] = useState(SLA_CONFIG);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [dialog, setDialog] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const filtered = config.filter(c => !search || c.subservice.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    showToast("All SLA changes saved successfully");
  };

  const handleSaveItem = () => {
    showToast(`SLA config ${editItem ? "updated" : "added"} successfully`);
    setDialog(null);
    setEditItem(null);
  };

  const handleDelete = (item) => {
    setConfig(prev => prev.filter(c => c.subservice !== item.subservice));
    showToast(`"${item.subservice}" deleted`);
  };

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <SectionTitle title="SLA Configuration" subtitle="Define SLA timeline per level for each sub-service — breach triggers auto-escalation" />

        {toast && (
          <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" /> {toast}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-blue-600">{config.length}</div>
            <div className="text-sm text-muted-foreground">Sub-services Configured</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-emerald-600">{config.filter(s => s.officerAssigned).length}</div>
            <div className="text-sm text-muted-foreground">With Officer Assigned</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-amber-600">{config.filter(s => !s.officerAssigned).length}</div>
            <div className="text-sm text-muted-foreground">Missing Officer</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-purple-600">7</div>
            <div className="text-sm text-muted-foreground">Escalation Levels</div>
          </div>
        </div>

        {/* Search + Add */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sub-service..." className="pl-9" />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setEditItem(null); setDialog({ subservice: "", l1: "24h", l2: "48h", zone: "72h", ulb: "96h", division: "120h", suda: "168h", officerAssigned: true }); }}>
            <Plus className="w-4 h-4 mr-1" /> Add SLA Config
          </Button>
        </div>

        {/* SLA table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-3 py-3 font-medium">Sub-Service</th>
                  <th className="px-3 py-3 font-medium text-center">L1</th>
                  <th className="px-3 py-3 font-medium text-center">L2</th>
                  <th className="px-3 py-3 font-medium text-center">Zone</th>
                  <th className="px-3 py-3 font-medium text-center">ULB</th>
                  <th className="px-3 py-3 font-medium text-center">Division</th>
                  <th className="px-3 py-3 font-medium text-center">SUDA</th>
                  <th className="px-3 py-3 font-medium text-center">Officer</th>
                  <th className="px-3 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-3 py-2.5 font-medium">{s.subservice}</td>
                    <td className="px-3 py-2.5 text-center"><Badge variant="outline" className="text-xs">{s.l1}</Badge></td>
                    <td className="px-3 py-2.5 text-center"><Badge variant="outline" className="text-xs">{s.l2}</Badge></td>
                    <td className="px-3 py-2.5 text-center"><Badge variant="outline" className="text-xs">{s.zone}</Badge></td>
                    <td className="px-3 py-2.5 text-center"><Badge variant="outline" className="text-xs">{s.ulb}</Badge></td>
                    <td className="px-3 py-2.5 text-center"><Badge variant="outline" className="text-xs">{s.division}</Badge></td>
                    <td className="px-3 py-2.5 text-center"><Badge variant="outline" className="text-xs">{s.suda}</Badge></td>
                    <td className="px-3 py-2.5 text-center">
                      {s.officerAssigned ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <AlertTriangle className="w-4 h-4 text-red-500 mx-auto" />}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditItem(s); setDialog({ ...s }); }}>
                          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(s)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-border flex items-center justify-between">
            <div className="text-xs text-amber-600 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Sub-services without an assigned officer will not be visible to citizens</div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" /> Save All Changes
            </Button>
          </div>
        </div>

        {/* Add/Edit Dialog */}
        {dialog && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDialog(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h3 className="font-bold text-foreground">{editItem ? "Edit SLA Config" : "Add SLA Config"}</h3>
                <button onClick={() => setDialog(null)} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <Label className="mb-1.5 block">Sub-Service Name *</Label>
                  <Input value={dialog.subservice || ""} onChange={e => setDialog({ ...dialog, subservice: e.target.value })} placeholder="e.g., Street light not working" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label className="mb-1.5 block">L1</Label><Input value={dialog.l1 || ""} onChange={e => setDialog({ ...dialog, l1: e.target.value })} /></div>
                  <div><Label className="mb-1.5 block">L2</Label><Input value={dialog.l2 || ""} onChange={e => setDialog({ ...dialog, l2: e.target.value })} /></div>
                  <div><Label className="mb-1.5 block">Zone</Label><Input value={dialog.zone || ""} onChange={e => setDialog({ ...dialog, zone: e.target.value })} /></div>
                  <div><Label className="mb-1.5 block">ULB</Label><Input value={dialog.ulb || ""} onChange={e => setDialog({ ...dialog, ulb: e.target.value })} /></div>
                  <div><Label className="mb-1.5 block">Division</Label><Input value={dialog.division || ""} onChange={e => setDialog({ ...dialog, division: e.target.value })} /></div>
                  <div><Label className="mb-1.5 block">SUDA</Label><Input value={dialog.suda || ""} onChange={e => setDialog({ ...dialog, suda: e.target.value })} /></div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={dialog.officerAssigned || false} onChange={e => setDialog({ ...dialog, officerAssigned: e.target.checked })} className="rounded" />
                  <Label>Officer Assigned</Label>
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
      </div>
    </PortalLayout>
  );
}