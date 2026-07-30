import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import ExportButton from "@/components/ExportButton";
import { OfficerId } from "@/components/ComplaintDetailDialog";
import EditDialog from "@/components/EditDialog";
import AgentCallingMetricsDialogBody from "./AgentCallingMetricsDialogBody";

export const HELPDESK_AGENTS = [
  {
    name: "Priya Sharma",
    id: "cce-001",
    status: "On Call",
    calls: 42,
    resolved: 38,
    avgTalk: "4m 12s",
    csat: 4.5,
    shift: "Morning",
  },
  {
    name: "Amit Verma",
    id: "cce-002",
    status: "Available",
    calls: 38,
    resolved: 35,
    avgTalk: "3m 55s",
    csat: 4.3,
    shift: "Morning",
  },
  {
    name: "Neha Singh",
    id: "cce-003",
    status: "On Call",
    calls: 35,
    resolved: 32,
    avgTalk: "4m 28s",
    csat: 4.4,
    shift: "Morning",
  },
  {
    name: "Rohit Kumar",
    id: "cce-004",
    status: "Break",
    calls: 28,
    resolved: 25,
    avgTalk: "5m 02s",
    csat: 4.1,
    shift: "Afternoon",
  },
  {
    name: "Sneha Gupta",
    id: "cce-005",
    status: "Available",
    calls: 12,
    resolved: 10,
    avgTalk: "4m 15s",
    csat: 4.6,
    shift: "Full Day",
  },
  {
    name: "Manish Tiwari",
    id: "cce-006",
    status: "Offline",
    calls: 0,
    resolved: 0,
    avgTalk: "-",
    csat: 4.2,
    shift: "Night",
  },
  {
    name: "Kavita Kumari",
    id: "cce-007",
    status: "On Call",
    calls: 31,
    resolved: 28,
    avgTalk: "3m 45s",
    csat: 4.5,
    shift: "Morning",
  },
  {
    name: "Deepak Yadav",
    id: "cce-008",
    status: "Available",
    calls: 26,
    resolved: 24,
    avgTalk: "4m 30s",
    csat: 4.2,
    shift: "Afternoon",
  },
  {
    name: "Anita Singh",
    id: "cce-009",
    status: "On Call",
    calls: 29,
    resolved: 26,
    avgTalk: "4m 10s",
    csat: 4.4,
    shift: "Afternoon",
  },
  {
    name: "Vikash Prasad",
    id: "cce-010",
    status: "Available",
    calls: 22,
    resolved: 20,
    avgTalk: "3m 50s",
    csat: 4.3,
    shift: "Night",
  },
];

export default function HelpdeskAgentStatusBoard({ agents = HELPDESK_AGENTS }) {
  const [selectedAgent, setSelectedAgent] = useState(null);

  return (
    <>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground">
            Helpdesk Agent Status Board
          </h3>
          <ExportButton
            data={agents}
            columns={[
              { key: "name", label: "Agent" },
              { key: "status", label: "Status" },
              { key: "calls", label: "Calls" },
              { key: "resolved", label: "Resolved" },
              { key: "avgTalk", label: "Avg Talk" },
              { key: "csat", label: "CSAT" },
              { key: "shift", label: "Shift" },
            ]}
            filename="helpdesk_agent_status"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Agent</th>
                <th className="px-4 py-2 font-medium">ID</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Calls</th>
                <th className="px-4 py-2 font-medium">Resolved</th>
                <th className="px-4 py-2 font-medium">Avg Talk</th>
                <th className="px-4 py-2 font-medium">Rating</th>
                <th className="px-4 py-2 font-medium">Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {agents.map((a, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td
                    className="px-4 py-2.5 font-medium text-primary hover:underline cursor-pointer"
                    onClick={() => setSelectedAgent(a)}
                  >
                    {a.name}
                  </td>
                  <td className="px-4 py-2.5">
                    <OfficerId id={a.id} />
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        a.status === "Available"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : a.status === "On Call"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : a.status === "Break"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                              : "bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      {a.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5">{a.calls}</td>
                  <td className="px-4 py-2.5 text-emerald-600">{a.resolved}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {a.avgTalk}
                  </td>
                  <td className="px-4 py-2.5 text-amber-600 font-medium">
                    ★ {a.csat}/5
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {a.shift}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAgent && (
        <EditDialog
          title={`Agent Calling Performance - ${selectedAgent.name}`}
          onClose={() => setSelectedAgent(null)}
          isHideFooter={true}
        >
          <AgentCallingMetricsDialogBody agent={selectedAgent} />
        </EditDialog>
      )}
    </>
  );
}
