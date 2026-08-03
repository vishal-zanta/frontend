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
import { useLanguage } from "@/context/LanguageContext";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { data, error, isLoading } = useGetDashboardData();
  const dashboardData = data?.data?.data;
  // console.log({ dashboardData });

  return (
    <PortalLayout role="superadmin">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-blue-600 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 xs:gap-5 sm:gap-6">
            <div className="space-y-1">
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                {t("State Dashboard - Bihar", "राज्य डैशबोर्ड - बिहार")}
              </h1>
              <p className="text-xs xs:text-sm md:text-base text-white/80">
                {t(
                  "Real-time grievance overview • 12 districts • 6 ULBs • 6 months of data",
                  "वास्तविक समय शिकायत अवलोकन • 12 जिले • 6 ULB • 6 महीने का डेटा",
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none text-center bg-white/10 rounded-lg px-2.5 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2">
                <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold">
                  {DASHBOARD_KPIS.todayNew}
                </div>
                <div className="text-[10px] xs:text-[11px] sm:text-xs text-white/70 whitespace-nowrap">
                  {t("New Today", "आज नई दर्ज")}
                </div>
              </div>
              <div className="flex-1 sm:flex-none text-center bg-white/10 rounded-lg px-2.5 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2">
                <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold">
                  {DASHBOARD_KPIS.todayResolved}
                </div>
                <div className="text-[10px] xs:text-[11px] sm:text-xs text-white/70 whitespace-nowrap">
                  {t("Resolved Today", "आज निराकृत")}
                </div>
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
          <MapAndDistrictSection
            districtData={dashboardData?.charts?.byDistrict}
          />

          {/* Channel Modes & Social Complaints */}
          <ModesAndSocialSection modeData={dashboardData?.charts?.bySource} />
        </LoaderErrWrapper>

        {/* Recent Complaints Table */}
        <RecentComplaintsSection />

        {/* Quick Links Menu */}
        <QuickLinksSection />
      </div>
    </PortalLayout>
  );
}
