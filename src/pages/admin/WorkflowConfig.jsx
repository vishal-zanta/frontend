import React, { useState } from "react";
import { Workflow, Save, Plus, ArrowRight, GitBranch, X, Check, Pencil, Trash2 } from "lucide-react";
import { WORKFLOW_LEVELS } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WorkflowConfig() {
  const [levels, setLevels] = useState(WORKFLOW_LEVELS);
  const [slaValues, setSlaValues] = useState(WORKFLOW_LEVELS.reduce((acc, l, i) => ({ ...acc, [i]: l.sla }), {}));
  const [toast, setToast] = useState("");
  const [dialog, setDialog] = useState(null);
  const [editLevel, setEditLevel] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleSaveConfig = () => {
    setLevels(prev => prev.map((l, i) => ({ ...l, sla: slaValues[i] || l.sla })));
    showToast("Workflow configuration saved successfully");
  };

  const handleSaveLevel = () => {
    if (dialog) {
      showToast(`Level ${editLevel ? "updated" : "added"} successfully`);
      setDialog(null);
      setEditLevel(null);
    }
  };

  const handleDelete = (level) => {
    setLevels(prev => prev.filter(l => l.level !== level.level));
    showToast(`"${level.level}" deleted`);
  };

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <SectionTitle title="Workflow Configuration" subtitle="Define escalation hierarchy: Complaint Initiator → L1 → L2 → Zone → ULB → Division → SUDA" />

        {toast && (
          <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" /> {toast}
          </div>
        )}

        {/* Visual workflow */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><GitBranch className="w-5 h-5 text-blue-500" /> Escalation Flow</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {levels.map((level, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center min-w-[120px]">
                  <div className="px-4 py-3 rounded-xl text-center text-sm font-medium text-white w-full" style={{ backgroundColor: i === 0 ? "#059669" : i === levels.length - 1 ? "#dc2626" : `hsl(${217 - i * 12}, 80%, ${45 - i * 3}%)` }}>
                    <div className="text-xs opacity-80">Level {i === 0 ? "0" : i}</div>
                    <div className="text-xs font-bold leading-tight">{level.level}</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1 text-center">SLA: {slaValues[i] || level.sla}</div>
                </div>
                {i < levels.length - 1 && <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Config table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-foreground">Workflow Levels & SLA</h3>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => { setEditLevel(null); setDialog({ level: "", role: "", sla: "", description: "" }); }}>
              <Plus className="w-4 h-4 mr-1" /> Add Level
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Level</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">SLA Timeline</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {levels.map((level, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">{i === 0 ? "Initiator" : `Level ${i}`}</Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">{level.level}</td>
                    <td className="px-4 py-3">
                      <Input value={slaValues[i] ?? level.sla} onChange={e => setSlaValues(prev => ({ ...prev, [i]: e.target.value }))} className="w-20 h-8 text-xs" />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{level.description}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditLevel(level); setDialog({ ...level }); }}>
                          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(level)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-border flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveConfig}>
              <Save className="w-4 h-4 mr-1" /> Save Configuration
            </Button>
          </div>
        </div>

        {/* Rules */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h4 className="font-bold text-amber-800 mb-2 text-sm">⚠ Workflow Rules</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• If action not taken within SLA time, ticket auto-escalates to next level with SMS notification</li>
            <li>• Every SLA level must have at least 1 officer assigned — or the ticket will not be visible</li>
            <li>• Officers can only be added manually due to location restriction</li>
            <li>• If a ticket remains unassigned, it can be reassigned later by the admin</li>
            <li>• Complaints can be transferred department-to-department</li>
          </ul>
        </div>

        {/* Add/Edit Dialog */}
        {dialog && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDialog(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h3 className="font-bold text-foreground">{editLevel ? "Edit Level" : "Add Workflow Level"}</h3>
                <button onClick={() => setDialog(null)} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <Label className="mb-1.5 block">Level Name *</Label>
                  <Input value={dialog.level || ""} onChange={e => setDialog({ ...dialog, level: e.target.value })} placeholder="e.g., Zone Administrator" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Role</Label>
                  <Input value={dialog.role || ""} onChange={e => setDialog({ ...dialog, role: e.target.value })} placeholder="e.g., Zone Admin" />
                </div>
                <div>
                  <Label className="mb-1.5 block">SLA Timeline</Label>
                  <Input value={dialog.sla || ""} onChange={e => setDialog({ ...dialog, sla: e.target.value })} placeholder="e.g., 72 hrs" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Description</Label>
                  <Input value={dialog.description || ""} onChange={e => setDialog({ ...dialog, description: e.target.value })} placeholder="Description..." />
                </div>
              </div>
              <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveLevel}>
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