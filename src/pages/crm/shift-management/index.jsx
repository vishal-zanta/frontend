import React from "react";
import PortalLayout from "@/components/PortalLayout";
import { usePortalProfile } from "@/hooks/usePortalProfile";
import AgentViewShift from "./components/AgentViewShift";
import SupervisorViewShift from "./components/SupervisorViewShift";
import { useAuth } from "@/context/AuthContext";

export default function ShiftManagement() {
  const {profile} = useAuth();
  console.log({profile});
  const isSupervisor = profile?.role?.designationEnglish !== "Call Centre Executive";

  return (
    <PortalLayout role="crm">
      {isSupervisor ? <SupervisorViewShift /> : <AgentViewShift />}
    </PortalLayout>
  );
}
