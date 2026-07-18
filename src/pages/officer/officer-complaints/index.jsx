import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

// Imported modular components
import StatsCards from "../officer-dashboard/components/StatsCards";
import ComplaintList from "@/components/complaints/ComplaintList";
import ComplaintDetailView from "@/components/complaints/ComplaintDetailView";
import { useGetComplaintsOfOfiicer } from "@/hooks/query/useGetComplaints";

export default function OfficerComplaints() {
  const [selected, setSelected] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState(null);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    pendingAction: 0,
    resolved: 0,
    slaBreachRisk: 0,
  });

  return (
    <PortalLayout role="officer" isHideOverflow={true}>
      <div className="p-6 space-y-6 relative">
        {/* Stats */}
        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 items-start">
          {/* Complaint list */}
          <ComplaintList
            selected={selected}
            onSelect={setSelected}
            setStatusUpdate={setStatusUpdate}
            onStatsChange={setStats}
            useGetComplaintsOfOfiicer={useGetComplaintsOfOfiicer}
          />

          {/* Detail panel */}
          <ComplaintDetailView
            selected={selected}
            statusUpdate={statusUpdate}
            setStatusUpdate={setStatusUpdate}
          />
        </div>
      </div>
    </PortalLayout>
  );
}