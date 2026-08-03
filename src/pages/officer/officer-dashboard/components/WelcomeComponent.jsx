import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function WelcomeComponent({ officer, profileId, profileLabel }) {
  const { t } = useLanguage();
  const { profile } = useAuth();

  const isStateLevel =
    profileId === "suda" || profileId === "division" || profileId === "zone";

  const displayName = profile?.name || "-";
  const displayRole = profile?.role?.designationEnglish || "-";

  const subtitle = isStateLevel ? (
    `${displayRole} • ${t("State-level overview", "राज्य-स्तरीय अवलोकन")} • ${t("All districts", "सभी जिले")}`
  ) : (
    <>
      {displayRole} • {t("Officer ID:", "अधिकारी आईडी:")}{" "}
      <span className="font-mono text-white">{profile?.userCode}</span> •{" "}
      {profile?.district?.name || profile?.district}
    </>
  );

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 xs:gap-4 sm:gap-6">
        <div className="min-w-0 space-y-1">
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold leading-tight truncate">
            {t("Welcome,", "स्वागत है,")} {displayName}
          </h1>
          <p className="text-xs xs:text-sm md:text-base text-white/80 line-clamp-2">{subtitle}</p>
        </div>
        <div className="text-left sm:text-right shrink-0 bg-white/10 rounded-lg px-3 py-1.5 xs:px-4 xs:py-2 w-full sm:w-auto">
          <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold">
            {(0).toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] xs:text-[11px] sm:text-xs text-white/80 whitespace-nowrap">{t("Active Complaints", "सक्रिय शिकायतें")}</div>
        </div>
      </div>
    </div>
  );
}
