import React from "react";
import PortalLayout from "@/components/PortalLayout";
import { DASHBOARD_KPIS } from "@/lib/biharData";
import StatsBoxes from "./components/StatsBoxes.jsx";
import VolumeAndCategorySection from "./components/VolumeAndCategorySection";
import MapAndDistrictSection from "./components/MapAndDistrictSection";
import ModesAndSocialSection from "./components/ModesAndSocialSection";
import RecentComplaintsSection from "./components/RecentComplaintsSection";
import QuickLinksSection from "./components/QuickLinksSection";
import { useGetDashboardData } from "./query";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";

export default function AdminDashboard() {
  const { data, error, isLoading } = useGetDashboardData();
  const dashboardData = data?.data?.data;
  // console.log({ dashboardData });

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                State Dashboard - Bihar
              </h1>
              <p className="text-white/80 text-sm">
                Real-time grievance overview • 12 districts • 6 ULBs • 6 months
                of data
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center bg-white/10 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">
                  {DASHBOARD_KPIS.todayNew}
                </div>
                <div className="text-[11px] text-white/70">New Today</div>
              </div>
              <div className="text-center bg-white/10 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">
                  {DASHBOARD_KPIS.todayResolved}
                </div>
                <div className="text-[11px] text-white/70">Resolved Today</div>
              </div>
            </div>
          </div>
        </div>

        {/* StatsBoxes Summary Cards */}
        <LoaderErrWrapper isLoading={isLoading} error={error}>
          <StatsBoxes metrics={dashboardData?.metrics} />

        {/* Volume & Category Charts */}
        <VolumeAndCategorySection
          complaintVolume={dashboardData?.charts?.trend}
          categoryData={dashboardData?.charts?.bySubservice}
          />

        {/* Hotspot Map & District Table */}
        <MapAndDistrictSection districtData = {dashboardData?.charts?.byDistrict}/>

        {/* Channel Modes & Social Complaints */}
        <ModesAndSocialSection modeData = {dashboardData?.charts?.bySource} />
          </LoaderErrWrapper>

        {/* Recent Complaints Table */}
        <RecentComplaintsSection />

        {/* Quick Links Menu */}
        <QuickLinksSection />
      </div>
    </PortalLayout>
  );
}
