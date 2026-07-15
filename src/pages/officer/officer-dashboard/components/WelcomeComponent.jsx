import React from "react";
import { useGetDashboardData } from "../query";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import {useAuth} from "@/context/AuthContext"

export default function WelcomeComponent({ officer, profileId, profileLabel }) {
  // Call the useGetDashboardData hook
  const {profile} = useAuth();
  // console.log({profile});
  // const { data: analyticsData, isLoading, error } = useGetDashboardData({ role: profileId });

  // const apiData = analyticsData?.data?.data || {};
  // const current = apiData.currentPeriod || {};

  const isStateLevel =
    profileId === "suda" || profileId === "division" || profileId === "zone";

  const displayName = profile?.name || "-";
  const displayRole = profile?.role?.designationEnglish || "-";

  const subtitle = isStateLevel ? (
    `${displayRole} • State-level overview • All districts`
  ) : (
    <>
      {displayRole} • Officer ID:{" "}
      <span className="font-mono text-white">{officer.id}</span> •{" "}
      {officer.wards?.join(", ") || "All wards"}
    </>
  );

  // const activeCount = isStateLevel
  //   ? (current.active ?? apiData.active ?? 0)
  //   : officer.pending;

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome, {displayName}</h1>
          <p className="text-white/80 text-sm">{subtitle}</p>
        </div>
        <div className="text-right min-w-[120px]">
          {/* <LoaderErrWrapper isLoading={isLoading} error={error?.message}> */}
            <div className="text-3xl font-bold">
              {(0).toLocaleString("en-IN")}
            </div>
            <div className="text-sm text-white/80">Active Complaints</div>
          {/* </LoaderErrWrapper> */}
        </div>
      </div>
    </div>
  );
}
