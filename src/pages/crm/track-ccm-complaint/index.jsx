import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

// Imported modular components from officer complaints
import StatsCards from "./components/StatsCards";
import ComplaintList from "@/components/complaints/ComplaintList";
import ComplaintDetailView from "@/components/complaints/ComplaintDetailView";
import { useGetComplaintsForCCEandAdminInfinite } from "@/hooks/query/useGetComplaints";

export default function TrackCCMComplaint() {
  const [selected, setSelected] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState(null);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    pendingAction: 0,
    resolved: 0,
    slaBreachRisk: 0,
  });

  return (
    <PortalLayout role="crm" isHideOverflow={true}>
      <div className="p-6 space-y-6 relative">
        {/* Stats */}
        <StatsCards
          totalAssigned={stats.totalAssigned}
          pendingAction={stats.pendingAction}
          resolved={stats.resolved}
          slaBreachRisk={stats.slaBreachRisk}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 items-start">
          {/* Complaint list */}
          <ComplaintList
            selected={selected}
            onSelect={setSelected}
            setStatusUpdate={setStatusUpdate}
            onStatsChange={setStats}
            useGetComplaintsOfOfiicer={useGetComplaintsForCCEandAdminInfinite}
          />

          {/* Detail panel */}
          <ComplaintDetailView
            selected={selected}
            statusUpdate={statusUpdate}
            setStatusUpdate={setStatusUpdate}
            isCCE={true}
          />
        </div>
      </div>
    </PortalLayout>
  );
}
