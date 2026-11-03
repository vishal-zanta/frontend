import React from "react";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { CRM_AGENTS } from "@/lib/biharData";
import {
  getAgentStatusBadgeClass,
  getAgentCardBorderClass,
} from "../constants";

export default function AgentLiveBoard({ agents = CRM_AGENTS }) {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-bold text-foreground">
          {t("Agent Board - Live Status", "एजेंट बोर्ड - लाइव स्थिति")}
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
        {agents.map((agent) => {
          const initials = agent.name
            .split(" ")
            .map((n) => n[0])
            .join("");

          return (
            <div
              key={agent.id}
              className={`rounded-xl border p-3 ${getAgentCardBorderClass(agent.status)}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {agent.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {agent.role}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={`text-[10px] ${getAgentStatusBadgeClass(agent.status)}`}
                >
                  {agent.status}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {agent.callsToday} {t("calls", "कॉल")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
