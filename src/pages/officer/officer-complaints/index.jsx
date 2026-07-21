import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

// Imported modular components
import StatsCards from "../officer-dashboard/components/StatsCards";
import ComplaintList from "@/components/complaints/ComplaintList";
import ComplaintDetailView from "@/components/complaints/ComplaintDetailView";
import { useGetComplaintsOfOfiicer } from "@/hooks/query/useGetComplaints";
import { useGetDashboardData } from "../officer-dashboard/query";
import { usePortalProfile } from "@/hooks/usePortalProfile";
import { ArrowLeft } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";
import { useLanguage } from "@/context/LanguageContext";



export default function OfficerComplaints() {
  const { t } = useLanguage();
  const [profileId] = usePortalProfile("officer");
  const [selected, setSelected] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState(null);
  const isMobile = useIsMobile();

  const {
    data: analyticsData,
    isLoading: statsLoading,
    error: statsError,
  } = useGetDashboardData({ role: profileId });

  return (
    <PortalLayout role="officer" isHideOverflow={true}>
      <div className="p-3 lg:p-6 space-y-4 lg:space-y-6 relative">
        {/* Stats — desktop only */}
        <div className="hidden md:block">
          <StatsCards
            analyticsData={analyticsData}
            isLoading={statsLoading}
            error={statsError}
          />
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0 items-start">
          <ComplaintList
            selected={selected}
            onSelect={setSelected}
            setStatusUpdate={setStatusUpdate}
            useGetComplaintsOfOfiicer={useGetComplaintsOfOfiicer}
            autoSelect={!isMobile}
          />

          {/* Detail panel */}
          <ComplaintDetailView
            selected={selected}
            statusUpdate={statusUpdate}
            setStatusUpdate={setStatusUpdate}
          />
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
              <ComplaintDetailView
                selected={selected}
                statusUpdate={statusUpdate}
                setStatusUpdate={setStatusUpdate}
              />
            </div>
          ) : (
            <ComplaintList
              selected={selected}
              onSelect={setSelected}
              setStatusUpdate={setStatusUpdate}
              useGetComplaintsOfOfiicer={useGetComplaintsOfOfiicer}
              autoSelect={false}
            />
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
