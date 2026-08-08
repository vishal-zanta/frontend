import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

// Imported modular components from officer complaints
import StatsCards from "./components/StatsCards";
import ComplaintList from "@/components/complaints/ComplaintList";
import ComplaintDetailView from "@/components/complaints/ComplaintDetailView";
import {
  useGetComplaintsForCCEandAdminInfinite,
  useGetComplaintAnalyticsSummary,
} from "@/hooks/query/useGetComplaints";
import useIsMobile from "@/hooks/useIsMobile";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useSelectExternalDepartment from "@/hooks/useSelectExternalDepartment";
import ExternalComplaintView from "@/components/complaints/department-view";

export default function TrackCCMComplaint() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState(null);
  const isMobile = useIsMobile();
  const externalDeptProps = useSelectExternalDepartment();

  const [stats, setStats] = useState({
    totalAssigned: 0,
    pendingAction: 0,
    resolved: 0,
    slaBreachRisk: 0,
  });

  const { data: analyticsData } = useGetComplaintAnalyticsSummary();
  const analytics = analyticsData?.data || {};
  // console.log({selected});

  return (
    <PortalLayout role="crm" isHideOverflow={true}>
      <div className="p-3 lg:p-6 space-y-4 lg:space-y-6 relative">
        {/* Stats — desktop only */}
       {(isMobile ? !selected : true) && <div className="block">
          <StatsCards
            totalAssigned={analytics.totalAssigned ?? 0}
            pendingAction={analytics.pendingCount ?? 0}
            resolved={analytics.resolvedCount ?? 0}
            slaBreachRisk={analytics.escalatedCount ?? 0}
          />
        </div>}

        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0 items-start">
          <ComplaintList
            selected={selected}
            onSelect={setSelected}
            setStatusUpdate={setStatusUpdate}
            onStatsChange={setStats}
            useGetComplaintsOfOfiicer={useGetComplaintsForCCEandAdminInfinite}
            autoSelect={!isMobile}
            isCCE={true}
            externalDeptProps={externalDeptProps}
          />

          {/* Detail panel */}
          {externalDeptProps.isExternalDepartment ? (
            <ExternalComplaintView
              selected={selected}
              externalDeptProps={externalDeptProps}
            />
          ) : (
            <ComplaintDetailView
              selected={selected}
              statusUpdate={statusUpdate}
              setStatusUpdate={setStatusUpdate}
              isCCE={true}
            />
          )}
        </div>

        {/* Mobile layout */}
        <div className="md:hidden">
          {selected ? (
            <div className="space-y-2">
              <div
                onClick={() => setSelected(null)}
                className="text-primary font-medium hover:underline cursor-pointer text-xs"
              >
                <ArrowLeft className="w-3 h-3 inline mr-1" />
                {t("Back to Complaints", "शिकायतों पर वापस जाएं")}
              </div>
              {externalDeptProps.isExternalDepartment ? (
                <ExternalComplaintView
                  selected={selected}
                  externalDeptProps={externalDeptProps}
                />
              ) : (
                <ComplaintDetailView
                  selected={selected}
                  statusUpdate={statusUpdate}
                  setStatusUpdate={setStatusUpdate}
                  isCCE={true}
                />
              )}
            </div>
          ) : (
            <ComplaintList
              selected={selected}
              onSelect={setSelected}
              setStatusUpdate={setStatusUpdate}
              onStatsChange={setStats}
              useGetComplaintsOfOfiicer={useGetComplaintsForCCEandAdminInfinite}
              autoSelect={false}
              isCCE={true}
              externalDeptProps={externalDeptProps}
            />
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
