import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { DASHBOARD_KPIS } from "@/lib/biharData";
import StatsBoxes from "./components/StatsBoxes.jsx";
import VolumeAndCategorySection from "./components/VolumeAndCategorySection";
import MapAndDistrictSection from "./components/MapAndDistrictSection";
import ModesAndSocialSection from "./components/ModesAndSocialSection";
import NatureAndLocationSection from "./components/NatureAndLocationSection";
import RecentComplaintsSection from "./components/RecentComplaintsSection";
import QuickLinksSection from "./components/QuickLinksSection";
import { useGetDashboardData } from "./query";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { useLanguage } from "@/context/LanguageContext";
import TimeRangeFilter from "@/components/TimeRangeFilter";
import { MAX_LIMIT } from "@/utils/constants";
import useGetRoles from "@/hooks/query/useGetRoles";
import { useGetUsers } from "@/pages/admin/user-management/hooks";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState("daily");
  const [dateRange, setDateRange] = useState({});
  const [filters, setFilters] = useState({});

  // const { data: rolesApiData } = useGetRoles([], { page: 1, limit: MAX_LIMIT });
  // const roleOptions = (rolesApiData?.data?.docs || [])
  //   .filter(
  //     (r) =>
  //       r.designationEnglish.startsWith("L1") ||
  //       r.designationEnglish.startsWith("L2"),
  //   )
  //   .map((r) => ({
  //     label: r.designationEnglish,
  //     value: r._id,
  //   }));
  // const roleIds = roleOptions.map((r) => r.value).join(",");
  // const { data: usersApiData } = useGetUsers(
  //   ["all-users-dashboard", roleIds],
  //   {
  //     page: 1,
  //     limit: MAX_LIMIT,
  //     role: roleIds,
  //   },
  //   !!roleIds,
  // );

  // const usersList =
  //   usersApiData?.data?.data?.docs ||
  //   usersApiData?.data?.docs ||
  //   usersApiData?.docs ||
  //   [];

  // const filterOptions = [
  //   {
  //     filterKey: "role",
  //     label: t("By Designation", "पदनाम के अनुसार"),
  //     options: roleOptions,
  //   },
  //   {
  //     filterKey: "user",
  //     label: t("By User", "उपयोगकर्ता के अनुसार"),
  //     options: usersList.map((u) => ({
  //       label: u.name,
  //       value: u._id,
  //     })),
  //   },
  // ];

  const params = {
    period: period !== "custom" ? period : undefined,
    ...(dateRange?.from && { fromDate: dateRange.from }),
    ...(dateRange?.to && { toDate: dateRange.to }),
    ...filters,
  };

  const { data, error, isLoading } = useGetDashboardData(params);
  const dashboardData = data?.data?.data;
  // console.log({ dashboardData });

  return (
    <PortalLayout role="superadmin">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
           {/* Filter on top */}
        <div className="flex items-center justify-end">
          <TimeRangeFilter
            period={period}
            setPeriod={setPeriod}
            dateRange={dateRange}
            setDateRange={setDateRange}
            // filters={filters}
            // setFilters={setFilters}
            // filterOptions={filterOptions}
            boxClassName={"flex-wrap sm:flex-nowrap"}
          />
        </div>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-blue-600 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 xs:gap-5 sm:gap-6">
            <div className="space-y-1">
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                {t("State Dashboard - Bihar", "राज्य डैशबोर्ड - बिहार")}
              </h1>
            </div>
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none text-center bg-white/10 rounded-lg px-2.5 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2">
                <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold">
                  {DASHBOARD_KPIS.todayNew}
                </div>
                <div className="text-[10px] xs:text-[11px] sm:text-xs text-white/70 whitespace-nowrap">
                  {t("Raised Today", "आज दर्ज")}
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

          {/* Grievance Nature & Location Distribution Section */}
          <NatureAndLocationSection />
        </LoaderErrWrapper>

        {/* Recent Complaints Table */}
        <RecentComplaintsSection />

        {/* Quick Links Menu */}
        <QuickLinksSection />
      </div>
    </PortalLayout>
  );
}
