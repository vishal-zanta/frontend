import React from "react";
import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CRM_AGENTS } from "@/lib/biharData";

export default function MyShiftDetails() {
  const myAgent =
    CRM_AGENTS.find((a) => a.name === "Priya Sharma") || CRM_AGENTS[0];
    

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
        <Lock className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <div>
          <div className="font-medium text-sm text-primary">Read-Only View</div>
          <p className="text-xs text-muted-foreground">
            You can view shift details but cannot modify them. Contact your
            supervisor for shift changes.
          </p>
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
            <Badge
              variant="outline"
              className={`text-xs ${
                myAgent.status === "Available"
                  ? "bg-emerald-50 text-emerald-700"
                  : myAgent.status === "On Call"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-slate-50 text-slate-500"
              }`}
            >
              {myAgent.status}
            </Badge>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Calls Today</div>
            <div className="font-medium">{myAgent.callsToday}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Resolved Today</div>
            <div className="font-medium text-emerald-600">
              {myAgent.resolvedToday}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
