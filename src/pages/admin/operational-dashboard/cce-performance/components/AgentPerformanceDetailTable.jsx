import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import ExportButton from "@/components/ExportButton";
import EditDialog from "@/components/EditDialog";
import SearchDebounced from "@/components/debounced/SearchDebounced";
import AgentCallingMetricsDialogBody from "./AgentCallingMetricsDialogBody";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [search, setSearch] = useState("");

  const filteredData = data.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const agentName = a.agent || a.name || "";
    const status = a.status || "";
    return (
      agentName.toLowerCase().includes(q) ||
      status.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-foreground shrink-0">
            {t("Agent Performance Detail", "एजेंट प्रदर्शन विवरण")}
          </h3>
          <div className="flex items-center gap-2">
            <SearchDebounced
              handleDebouncedChange={setSearch}
              initialValue={search}
              placeholder={t("Search agent...", "एजेंट खोजें...")}
              className="w-full sm:w-60"
              inputClassName="h-9 text-xs"
              delay={300}
            />
            <ExportButton
              data={filteredData}
              columns={agentExportColumns}
              filename="agent_performance"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">{t("Agent", "एजेंट")}</th>
                <th className="px-4 py-2 font-medium">{t("Calls", "कॉल")}</th>
                <th className="px-4 py-2 font-medium">{t("Resolved", "निराकृत")}</th>
                <th className="px-4 py-2 font-medium">{t("Avg Talk", "औसत बात")}</th>
                <th className="px-4 py-2 font-medium">{t("CSAT", "CSAT")}</th>
                <th className="px-4 py-2 font-medium">{t("SLA %", "SLA %")}</th>
                <th className="px-4 py-2 font-medium">{t("Rating", "रेटिंग")}</th>
                <th className="px-4 py-2 font-medium">{t("Status", "स्थिति")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((a, i) => (
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
              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-6 text-sm text-muted-foreground"
                  >
                    {t("No agent records found.", "कोई एजेंट रिकॉर्ड नहीं मिला।")}
                  </td>
                </tr>
              )}
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

