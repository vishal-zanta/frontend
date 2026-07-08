import React, { useState } from "react";
import { Building2, Plus, Search, Tag, MapPin, Users, Globe, X, Check, Trash2, Pencil } from "lucide-react";
import { DESIGNATIONS, SERVICES, COMPLAINT_SOURCES, DISTRICTS, ULBS } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const tabs = [
  { id: "designation", label: "Designations", icon: Tag },
  { id: "service", label: "Services & Sub-services", icon: Building2 },
  { id: "source", label: "Complaint Sources", icon: Globe },
  { id: "demography", label: "Demography & ULBs", icon: MapPin },
];

function EditDialog({ title, onClose, children, onSave }) {
  const [saving, setSaving] = useState(false);
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave(); }, 600);
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
        <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Check className="w-4 h-4 mr-1" /> Save
          </Button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ name, onConfirm, onCancel }) {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => { setDeleting(false); onConfirm(); }, 600);
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
          <Trash2 className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-foreground mb-1">Delete "{name}"?</h3>
        <p className="text-sm text-muted-foreground mb-5">This action cannot be undone. The record will be permanently removed.</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
          <Button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700">
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function MasterData() {
  const [tab, setTab] = useState("designation");
  const [designations, setDesignations] = useState(DESIGNATIONS);
  const [sources, setSources] = useState(COMPLAINT_SOURCES);
  const [districts, setDistricts] = useState(DISTRICTS);
  const [ulbs, setUlbs] = useState(ULBS);
  const [dialog, setDialog] = useState(null); // { type: "add"|"edit"|"delete", tab, item? }
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handleSave = () => {
    // In a real app, this would persist to backend; here we update local state
    if (dialog.type === "delete") {
      if (dialog.tab === "designation") setDesignations(prev => prev.filter(d => d.name_en !== dialog.item.name_en));
      if (dialog.tab === "source") setSources(prev => prev.filter(s => s.name !== dialog.item.name));
      if (dialog.tab === "demography") { setDistricts(prev => prev.filter(d => d.name !== dialog.item.name)); setUlbs(prev => prev.filter(u => u.district !== dialog.item?.id)); }
      showToast(`"${dialog.item.name || dialog.item.name_en}" deleted successfully`);
    } else {
      const action = dialog.type === "add" ? "added" : "updated";
      showToast(`Record ${action} successfully`);
    }
    setDialog(null);
  };

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <SectionTitle title="Master Data Management" subtitle="Manage designations, services, sub-services, complaint sources & demography" />

        <div className="flex flex-wrap gap-2">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${tab === t.id ? "bg-primary text-white shadow-md" : "bg-white border border-border text-muted-foreground hover:bg-muted"}`}>
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Designations */}
        {tab === "designation" && (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Designations</h3>
              <Button size="sm" onClick={() => setDialog({ type: "add", tab: "designation" })} className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-1" /> Add Designation</Button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/50"><tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Designation (English)</th><th className="px-4 py-2 font-medium">पदनाम (Hindi)</th><th className="px-4 py-2 font-medium">Level</th><th className="px-4 py-2 font-medium">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {designations.map((d, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-2.5 font-medium">{d.name_en}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{d.name_hi}</td>
                    <td className="px-4 py-2.5"><Badge variant="outline" className="text-xs">{d.level}</Badge></td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setDialog({ type: "edit", tab: "designation", item: d })}><Pencil className="w-3.5 h-3.5 mr-1" /> Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => setDialog({ type: "delete", tab: "designation", item: d })}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Services */}
        {tab === "service" && (
          <div className="space-y-4">
            {SERVICES.map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground">{s.name}</h4>
                      <span className="text-sm text-muted-foreground">({s.name_hi})</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">Department: {s.dept}</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setDialog({ type: "add", tab: "service", item: s })}><Plus className="w-4 h-4 mr-1" /> Add Sub-service</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50"><tr className="text-left text-xs text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Sub-Service</th><th className="px-3 py-2 font-medium">SLA (hrs)</th><th className="px-3 py-2 font-medium text-center">Geo-Tagged</th><th className="px-3 py-2 font-medium text-center">Field Visit</th><th className="px-3 py-2 font-medium">Actions</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border">
                      {s.subservices.map((ss, j) => (
                        <tr key={j} className="hover:bg-muted/30">
                          <td className="px-3 py-2 font-medium">{ss.name}</td>
                          <td className="px-3 py-2"><Badge variant="outline" className="text-xs bg-amber-50 text-amber-700">{ss.slaHours}h</Badge></td>
                          <td className="px-3 py-2 text-center">{ss.geoTagged ? "✅" : "—"}</td>
                          <td className="px-3 py-2 text-center">{ss.fieldVisit ? "✅" : "—"}</td>
                          <td className="px-3 py-2">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => setDialog({ type: "edit", tab: "service", item: ss, parent: s })}><Pencil className="w-3.5 h-3.5 mr-1" /> Edit</Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => setDialog({ type: "delete", tab: "service", item: ss })}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sources */}
        {tab === "source" && (
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">Complaint Sources</h3>
              <Button size="sm" onClick={() => setDialog({ type: "add", tab: "source" })} className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-1" /> Add Source</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sources.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 group">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium flex-1">{s.name}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setDialog({ type: "edit", tab: "source", item: s })} className="p-1 hover:bg-muted rounded"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button onClick={() => setDialog({ type: "delete", tab: "source", item: s })} className="p-1 hover:bg-muted rounded"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demography */}
        {tab === "demography" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground">Districts & Demography</h3>
                <Button size="sm" onClick={() => setDialog({ type: "add", tab: "demography" })} className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-1" /> Add District</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50"><tr className="text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">District</th><th className="px-4 py-2 font-medium">Hindi</th><th className="px-4 py-2 font-medium">Division</th><th className="px-4 py-2 font-medium">Zone</th><th className="px-4 py-2 font-medium text-right">Population</th><th className="px-4 py-2 font-medium text-center">Urban</th><th className="px-4 py-2 font-medium text-center">ULB Rank</th><th className="px-4 py-2 font-medium">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {districts.map((d, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{d.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{d.name_hi}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{d.division}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{d.zone}</td>
                        <td className="px-4 py-2.5 text-right font-semibold">{d.population.toLocaleString("en-IN")}</td>
                        <td className="px-4 py-2.5 text-center">{d.urban ? "✅" : "—"}</td>
                        <td className="px-4 py-2.5 text-center"><Badge variant="outline" className="text-xs">#{d.ulbRank}</Badge></td>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setDialog({ type: "edit", tab: "demography", item: d })}><Pencil className="w-3.5 h-3.5 mr-1" /> Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => setDialog({ type: "delete", tab: "demography", item: d })}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="font-bold text-foreground">Urban Local Bodies (ULBs)</h3>
                <p className="text-xs text-muted-foreground mt-0.5">ULB population rank is calculated by the system according to population</p>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-muted/50"><tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">ULB Name</th><th className="px-4 py-2 font-medium">District</th><th className="px-4 py-2 font-medium text-right">Wards</th><th className="px-4 py-2 font-medium text-right">Population</th><th className="px-4 py-2 font-medium text-center">Rank</th>
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {ulbs.map((u, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-medium">{u.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground capitalize">{districts.find(d => d.id === u.district)?.name}</td>
                      <td className="px-4 py-2.5 text-right">{u.wards}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{u.population.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-2.5 text-center"><Badge variant="outline" className="text-xs bg-blue-50 text-primary">#{u.rank}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-foreground text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" /> {toast}
          </div>
        )}

        {/* Dialogs */}
        {dialog && dialog.type === "delete" && (
          <DeleteConfirm name={dialog.item.name || dialog.item.name_en} onConfirm={handleSave} onCancel={() => setDialog(null)} />
        )}
        {dialog && dialog.type !== "delete" && (
          <EditDialog
            title={dialog.type === "add" ? `Add ${dialog.tab === "designation" ? "Designation" : dialog.tab === "source" ? "Source" : dialog.tab === "demography" ? "District" : "Sub-service"}` : `Edit ${dialog.item?.name_en || dialog.item?.name || dialog.item?.name || "Record"}`}
            onClose={() => setDialog(null)}
            onSave={handleSave}
          >
            {dialog.tab === "designation" && (
              <>
                <div><Label className="mb-1.5 block">Designation (English) *</Label><Input defaultValue={dialog.item?.name_en || ""} placeholder="e.g., Municipal Commissioner" /></div>
                <div><Label className="mb-1.5 block">पदनाम (Hindi) *</Label><Input defaultValue={dialog.item?.name_hi || ""} placeholder="उदा. नगर आयुक्त" /></div>
                <div>
                  <Label className="mb-1.5 block">Level *</Label>
                  <Select defaultValue={dialog.item?.level || "L1"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["L1", "L2", "Zone", "ULB", "Division", "SUDA"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {dialog.tab === "source" && (
              <div><Label className="mb-1.5 block">Source Name *</Label><Input defaultValue={dialog.item?.name || ""} placeholder="e.g., Mobile App" /></div>
            )}
            {dialog.tab === "demography" && (
              <>
                <div><Label className="mb-1.5 block">District Name (English) *</Label><Input defaultValue={dialog.item?.name || ""} placeholder="e.g., Siwan" /></div>
                <div><Label className="mb-1.5 block">जिला (Hindi) *</Label><Input defaultValue={dialog.item?.name_hi || ""} placeholder="उदा. सिवान" /></div>
                <div><Label className="mb-1.5 block">Division *</Label><Input defaultValue={dialog.item?.division || ""} placeholder="e.g., Saran" /></div>
                <div><Label className="mb-1.5 block">Zone *</Label><Select defaultValue={dialog.item?.zone || "South Bihar"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="South Bihar">South Bihar</SelectItem><SelectItem value="North Bihar">North Bihar</SelectItem></SelectContent>
                </Select></div>
                <div><Label className="mb-1.5 block">Population *</Label><Input type="number" defaultValue={dialog.item?.population || ""} placeholder="e.g., 2000000" /></div>
              </>
            )}
            {dialog.tab === "service" && (
              <>
                <div><Label className="mb-1.5 block">Sub-Service Name *</Label><Input defaultValue={dialog.item?.name || ""} placeholder="e.g., Drain overflow" /></div>
                <div><Label className="mb-1.5 block">SLA Hours *</Label><Input type="number" defaultValue={dialog.item?.slaHours || ""} placeholder="e.g., 12" /></div>
                <div><Label className="mb-1.5 block">Parent Service</Label><Input disabled value={dialog.parent?.name || ""} className="bg-muted/50" /></div>
              </>
            )}
          </EditDialog>
        )}
      </div>
    </PortalLayout>
  );
}