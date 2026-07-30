import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import ExportButton from "@/components/ExportButton";
import EditDialog from "@/components/EditDialog";
import AgentCallingMetricsDialogBody from "./AgentCallingMetricsDialogBody";

const agentExportColumns = [
  { key: "agent", label: "Agent" },
  { key: "calls", label: "Calls" },
  { key: "resolved", label: "Resolved" },
  { key: "avgTalkTime", label: "Avg Talk Time" },
  { key: "csat", label: "CSAT" },
  { key: "slaCompliance", label: "SLA %" },
  { key: "status", label: "Status" },
];

export default function AgentPerformanceDetailTable({ data = [] }) {
  const [selectedAgent, setSelectedAgent] = useState(null);

  return (
    <>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground">
            Agent Performance Detail
          </h3>
          <ExportButton
            data={data}
            columns={agentExportColumns}
            filename="agent_performance"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Agent</th>
                <th className="px-4 py-2 font-medium">Calls</th>
                <th className="px-4 py-2 font-medium">Resolved</th>
                <th className="px-4 py-2 font-medium">Avg Talk</th>
                <th className="px-4 py-2 font-medium">CSAT</th>
                <th className="px-4 py-2 font-medium">SLA %</th>
                <th className="px-4 py-2 font-medium">Rating</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((a, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td
                    className="px-4 py-2.5 font-medium text-primary hover:underline cursor-pointer"
                    onClick={() => setSelectedAgent(a)}
                  >
                    {a.agent || a.name}
                  </td>
                  <td className="px-4 py-2.5">{a.calls}</td>
                  <td className="px-4 py-2.5 text-emerald-600">{a.resolved}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {a.avgTalkTime || a.avgTalk}
                  </td>
                  <td className="px-4 py-2.5 text-amber-600 font-medium">
                    ★ {a.csat}/5
                  </td>
                  <td className="px-4 py-2.5">{a.slaCompliance}%</td>
                  <td className="px-4 py-2.5 text-amber-600">★ {a.csat}/5</td>
                  <td className="px-4 py-2.5">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        a.status === "Online"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : a.status === "On Break"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      {a.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAgent && (
        <EditDialog
          title={`Agent Calling Performance - ${selectedAgent.agent || selectedAgent.name}`}
          onClose={() => setSelectedAgent(null)}
          isHideFooter={true}
        >
          <AgentCallingMetricsDialogBody agent={selectedAgent} />
        </EditDialog>
      )}
    </>
  );
}
