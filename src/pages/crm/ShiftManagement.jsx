import React from "react";
import { Clock, Save, Calendar, Lock } from "lucide-react";
import { CRM_AGENTS } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { usePortalProfile } from "@/hooks/usePortalProfile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ShiftManagement() {
  const [profile] = usePortalProfile("crm");
  const isSupervisor = profile === "supervisor";

  // Agent view — read-only, own shift only
  if (!isSupervisor) {
    const myAgent = CRM_AGENTS.find(a => a.name === "Priya Sharma") || CRM_AGENTS[0];
    return (
      <PortalLayout role="crm">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Shift</h1>
            <p className="text-sm text-muted-foreground">View your assigned shift schedule. Shift management is available to supervisors only.</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm text-primary">Read-Only View</div>
              <p className="text-xs text-muted-foreground">You can view shift details but cannot modify them. Contact your supervisor for shift changes.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 max-w-2xl">
            <h3 className="font-bold text-foreground mb-4">My Shift Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Agent Name</div>
                <div className="font-medium">{myAgent.name}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Agent ID</div>
                <div className="font-mono text-sm font-medium">{myAgent.id}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Shift</div>
                <div className="font-medium">{myAgent.shift}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Current Status</div>
                <Badge variant="outline" className={`text-xs ${myAgent.status === "Available" ? "bg-emerald-50 text-emerald-700" : myAgent.status === "On Call" ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-500"}`}>{myAgent.status}</Badge>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Calls Today</div>
                <div className="font-medium">{myAgent.callsToday}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Resolved Today</div>
                <div className="font-medium text-emerald-600">{myAgent.resolvedToday}</div>
              </div>
            </div>
          </div>

          {/* Read-only agent board */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <h3 className="font-bold text-foreground">Agent Status Board (Read-Only)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Agent</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Shift</th>
                    <th className="px-4 py-3 font-medium">Calls Today</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {CRM_AGENTS.map((a, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                          {a.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        {a.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{a.role}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.shift}</td>
                      <td className="px-4 py-3">{a.callsToday}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-xs ${
                          a.status === "On Call" ? "bg-amber-50 text-amber-700" :
                          a.status === "Available" ? "bg-emerald-50 text-emerald-700" :
                          a.status === "Break" ? "bg-purple-50 text-purple-700" :
                          "bg-slate-50 text-slate-500"
                        }`}>{a.status}</Badge>
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

  // Supervisor view — full management
  return (
    <PortalLayout role="crm">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shift Management</h1>
          <p className="text-sm text-muted-foreground">Set agent shift timings, view live status, and manage call centre operations.</p>
        </div>

        {/* Set shift form */}
        <div className="bg-white rounded-xl border border-border p-5 max-w-2xl">
          <h3 className="font-bold text-foreground mb-4">Set Shift Timing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="mb-1.5 block">Agent Name</Label>
              <Select defaultValue="cce-001">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CRM_AGENTS.map(a => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Shift</Label>
              <Select defaultValue="morning">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (06:00–14:00)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (14:00–22:00)</SelectItem>
                  <SelectItem value="night">Night (22:00–06:00)</SelectItem>
                  <SelectItem value="fullday">Full Day (08:00–20:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Date</Label>
              <Input type="date" defaultValue="2026-07-07" />
            </div>
          </div>
          <Button className="mt-4 bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-1" /> Save Shift
          </Button>
        </div>

        {/* Agent list */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="font-bold text-foreground">Agent Status Board</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Agent</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Shift</th>
                  <th className="px-4 py-3 font-medium">Calls Today</th>
                  <th className="px-4 py-3 font-medium">Resolved</th>
                  <th className="px-4 py-3 font-medium">Avg Talk Time</th>
                  <th className="px-4 py-3 font-medium">CSAT</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CRM_AGENTS.map((a, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        {a.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      {a.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.role}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.shift}</td>
                    <td className="px-4 py-3">{a.callsToday}</td>
                    <td className="px-4 py-3">{a.resolvedToday}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.avgTalkTime}</td>
                    <td className="px-4 py-3">
                      <span className="text-amber-600">★ {a.csat}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${
                        a.status === "On Call" ? "bg-amber-50 text-amber-700" :
                        a.status === "Available" ? "bg-emerald-50 text-emerald-700" :
                        a.status === "Break" ? "bg-purple-50 text-purple-700" :
                        "bg-slate-50 text-slate-500"
                      }`}>{a.status}</Badge>
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