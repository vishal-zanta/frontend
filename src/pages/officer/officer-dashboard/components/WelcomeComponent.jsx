import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function WelcomeComponent({ officer, profileId, profileLabel }) {
  const { profile } = useAuth();

  const isStateLevel =
    profileId === "suda" || profileId === "division" || profileId === "zone";

  const displayName = profile?.name || "-";
  const displayRole = profile?.role?.designationEnglish || "-";

  const subtitle = isStateLevel ? (
    `${displayRole} • State-level overview • All districts`
  ) : (
    <>
      {displayRole} • Officer ID:{" "}
      <span className="font-mono text-white">{profile?.userCode}</span> •{" "}
      {profile?.district?.name || profile?.district}
    </>
  );

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl p-4 lg:p-6 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg lg:text-2xl font-bold mb-0.5 truncate">
            Welcome, {displayName}
          </h1>
          <p className="text-white/80 text-xs lg:text-sm line-clamp-2">{subtitle}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl lg:text-3xl font-bold">
            {(0).toLocaleString("en-IN")}
          </div>
          <div className="text-xs lg:text-sm text-white/80 whitespace-nowrap">Active Complaints</div>
        </div>
      </div>
    </div>
  );
}
