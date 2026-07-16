import React, { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Check,
  X,
  Headphones,
  Phone,
  Clock,
} from "lucide-react";
import { CRM_AGENTS } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ExportButton from "@/components/ExportButton";

const exportColumns = [
  { key: "id", label: "Agent ID" },
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "shift", label: "Shift" },
  { key: "callsToday", label: "Calls Today" },
  { key: "resolvedToday", label: "Resolved Today" },
  { key: "avgTalkTime", label: "Avg Talk Time" },
  { key: "csat", label: "CSAT" },
  { key: "status", label: "Status" },
];

export default function ManageAgents() {
  const [agents, setAgents] = useState(CRM_AGENTS);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [dialog, setDialog] = useState(null);
  const [editAgent, setEditAgent] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = agents.filter(
    (a) =>
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = () => {
    showToast(`Agent ${editAgent ? "updated" : "added"} successfully`);
    setDialog(null);
    setEditAgent(null);
  };

  const handleDelete = (agent) => {
    setAgents((prev) => prev.filter((a) => a.id !== agent.id));
    showToast(`"${agent.name}" deleted`);
  };

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <SectionTitle
          title="Manage CCE Agents"
          subtitle="CRUD management of all Customer Care Executives and Supervisors"
        />

        {toast && (
          <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" /> {toast}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-blue-600">
              {agents.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Agents</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-emerald-600">
              {
                agents.filter(
                  (a) => a.status === "Available" || a.status === "On Call",
                ).length
              }
            </div>
            <div className="text-sm text-muted-foreground">Active Now</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-purple-600">
              {agents.filter((a) => a.role === "Supervisor").length}
            </div>
            <div className="text-sm text-muted-foreground">Supervisors</div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-amber-600">
              {agents.reduce((sum, a) => sum + a.callsToday, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Calls Today</div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or agent ID..."
              className="pl-9"
            />
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setEditAgent(null);
              setDialog({
                name: "",
                role: "CCE",
                shift: "Morning (06:00–14:00)",
                status: "Available",
                callsToday: 0,
                resolvedToday: 0,
                avgTalkTime: "-",
                csat: 4.0,
              });
            }}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Agent
          </Button>
          <ExportButton
            data={agents}
            columns={exportColumns}
            filename="cce_agents_list"
          />
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Agent ID</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Shift</th>
                  <th className="px-4 py-3 font-medium text-center">
                    Calls Today
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    Resolved
                  </th>
                  <th className="px-4 py-3 font-medium">Avg Talk</th>
                  <th className="px-4 py-3 font-medium text-center">CSAT</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((a, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {a.id}
                    </td>
                    <td className="px-4 py-3 font-medium">{a.name}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${a.role === "Supervisor" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}
                      >
                        {a.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {a.shift}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">
                      {a.callsToday}
                    </td>
                    <td className="px-4 py-3 text-center text-emerald-600">
                      {a.resolvedToday}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {a.avgTalkTime}
                    </td>
                    <td className="px-4 py-3 text-center text-amber-600 font-medium">
                      ★ {a.csat}/5
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${a.status === "Available" ? "bg-emerald-50 text-emerald-700" : a.status === "On Call" ? "bg-amber-50 text-amber-700" : a.status === "Break" ? "bg-purple-50 text-purple-700" : "bg-slate-50 text-slate-500"}`}
                      >
                        {a.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-1 justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditAgent(a);
                            setDialog({ ...a });
                          }}
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDelete(a)}
                        >
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

        {dialog && (
          <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setDialog(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h3 className="font-bold text-foreground">
                  {editAgent ? "Edit Agent" : "Add CCE Agent"}
                </h3>
                <button
                  onClick={() => setDialog(null)}
                  className="p-1.5 hover:bg-muted rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <Label className="mb-1.5 block">Agent Name <span className="text-red-500">*</span></Label>
                  <Input
                    value={dialog.name || ""}
                    onChange={(e) =>
                      setDialog({ ...dialog, name: e.target.value })
                    }
                    placeholder="e.g., Priya Sharma"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Role</Label>
                  <select
                    className="w-full border border-input rounded-md p-2 text-sm"
                    value={dialog.role || "CCE"}
                    onChange={(e) =>
                      setDialog({ ...dialog, role: e.target.value })
                    }
                  >
                    <option value="CCE">CCE Agent</option>
                    <option value="Supervisor">CC Supervisor</option>
                  </select>
                </div>
                <div>
                  <Label className="mb-1.5 block">Shift</Label>
                  <select
                    className="w-full border border-input rounded-md p-2 text-sm"
                    value={dialog.shift || ""}
                    onChange={(e) =>
                      setDialog({ ...dialog, shift: e.target.value })
                    }
                  >
                    <option value="Morning (06:00–14:00)">
                      Morning (06:00–14:00)
                    </option>
                    <option value="Afternoon (14:00–22:00)">
                      Afternoon (14:00–22:00)
                    </option>
                    <option value="Night (22:00–06:00)">
                      Night (22:00–06:00)
                    </option>
                    <option value="Full Day (08:00–20:00)">
                      Full Day (08:00–20:00)
                    </option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-1.5 block">Calls Today</Label>
                    <Input
                      type="number"
                      value={dialog.callsToday || 0}
                      onChange={(e) =>
                        setDialog({
                          ...dialog,
                          callsToday: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Resolved Today</Label>
                    <Input
                      type="number"
                      value={dialog.resolvedToday || 0}
                      onChange={(e) =>
                        setDialog({
                          ...dialog,
                          resolvedToday: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-1.5 block">Avg Talk Time</Label>
                    <Input
                      value={dialog.avgTalkTime || ""}
                      onChange={(e) =>
                        setDialog({ ...dialog, avgTalkTime: e.target.value })
                      }
                      placeholder="e.g., 4m 12s"
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">CSAT (out of 5)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={dialog.csat || 0}
                      onChange={(e) =>
                        setDialog({
                          ...dialog,
                          csat: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label className="mb-1.5 block">Status</Label>
                  <select
                    className="w-full border border-input rounded-md p-2 text-sm"
                    value={dialog.status || "Available"}
                    onChange={(e) =>
                      setDialog({ ...dialog, status: e.target.value })
                    }
                  >
                    <option value="Available">Available</option>
                    <option value="On Call">On Call</option>
                    <option value="Break">Break</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDialog(null)}>
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleSave}
                >
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
