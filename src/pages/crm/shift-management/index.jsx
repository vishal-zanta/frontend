import React from "react";
import PortalLayout from "@/components/PortalLayout";
import AgentViewShift from "./components/AgentViewShift";
import SupervisorViewShift from "./components/SupervisorViewShift";
import { useAuth } from "@/context/AuthContext";

export default function ShiftManagement() {
  const { profile } = useAuth();
  const hasOnlyCCE = profile?.role?.designationEnglish === "Call Centre Executive";
  const isSupervisor = !hasOnlyCCE;

  return (
    <PortalLayout role="crm">
      {isSupervisor ? <SupervisorViewShift /> : <AgentViewShift />}
    </PortalLayout>
  );
}
