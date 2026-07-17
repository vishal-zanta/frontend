import React from "react";
import MyShiftDetails from "./MyShiftDetails";
import AgentStatusBoard from "./AgentStatusBoard";

export default function AgentViewShift() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Shift</h1>
        <p className="text-sm text-muted-foreground">
          View your assigned shift schedule. Shift management is available to
          supervisors only.
        </p>
      </div>

      <MyShiftDetails />

      <AgentStatusBoard isSupervisor={false} />
    </div>
  );
}
