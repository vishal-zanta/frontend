import React from "react";
import { PhoneForwarded, Building2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { getAgentStatusBadgeClass } from "../constants";

export default function ReroutePanel({
  departments = [],
  availableAgents = [],
  rerouteTarget,
  setRerouteTarget,
  onConfirm,
  onCancel,
}) {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-xl border-2 border-primary p-5">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <PhoneForwarded className="w-5 h-5 text-primary" />{" "}
        {t("Reroute Call", "कॉल पुनः निर्देशित करें")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reroute to department */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">
            {t("Transfer to Department", "विभाग को ट्रांसफर करें")}
          </h4>
          <div className="space-y-2">
            {departments.map((dept) => {
              const isSelected = rerouteTarget?.id === dept.id;
              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() =>
                    setRerouteTarget({
                      type: "dept",
                      id: dept.id,
                      name: dept.name,
                    })
                  }
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left bg-white ${
                    isSelected
                      ? "border-primary bg-blue-50"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{dept.name}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reroute to agent */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">
            {t("Transfer to Agent", "एजेंट को ट्रांसफर करें")}
          </h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
            {availableAgents.map((agent) => {
              const isSelected = rerouteTarget?.id === agent.id;
              const initials = agent.name
                .split(" ")
                .map((n) => n[0])
                .join("");

              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() =>
                    setRerouteTarget({
                      type: "agent",
                      id: agent.id,
                      name: agent.name,
                    })
                  }
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left bg-white ${
                    isSelected
                      ? "border-primary bg-blue-50"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {agent.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {agent.role} - {agent.shift.split("(")[0]}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${getAgentStatusBadgeClass(agent.status)}`}
                  >
                    {agent.status}
                  </Badge>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {rerouteTarget && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel || (() => setRerouteTarget(null))}
          >
            {t("Cancel", "रद्द करें")}
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={onConfirm}
          >
            <PhoneForwarded className="w-4 h-4 mr-1" />{" "}
            {t("Transfer to", "ट्रांसफर करें")} {rerouteTarget.name}
          </Button>
        </div>
      )}
    </div>
  );
}
