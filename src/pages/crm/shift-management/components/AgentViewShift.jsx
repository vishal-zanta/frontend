import React, { useState } from "react";
import MyShiftDetails from "./MyShiftDetails";
import AgentStatusBoard from "./AgentStatusBoard";

export default function AgentViewShift() {
  const [agentViewShift, setAgentView] = useState(null);
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Shift</h1>
        <p className="text-sm text-muted-foreground">
          View your assigned shift schedule. Shift management is available to
          supervisors only.
        </p>
      </div>

      <MyShiftDetails agentViewShift={agentViewShift} />

      <AgentStatusBoard isSupervisor={false} setAgentView={setAgentView} />
    </div>
  );
}
