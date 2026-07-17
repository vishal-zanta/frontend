import React from "react";
import SetShiftTiming from "./SetShiftTiming";
import AgentStatusBoard from "./AgentStatusBoard";

export default function SupervisorViewShift() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Shift Management</h1>
        <p className="text-sm text-muted-foreground">
          Set agent shift timings, view live status, and manage call centre operations.
        </p>
      </div>

      <SetShiftTiming />

      <AgentStatusBoard isSupervisor={true} />
    </div>
  );
}
