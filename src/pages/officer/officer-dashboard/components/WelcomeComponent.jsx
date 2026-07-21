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
    <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl p-4 lg:p-6 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg lg:text-2xl font-bold mb-0.5 truncate">
            {t("Welcome,", "स्वागत है,")} {displayName}
          </h1>
          <p className="text-white/80 text-xs lg:text-sm line-clamp-2">{subtitle}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl lg:text-3xl font-bold">
            {(0).toLocaleString("en-IN")}
          </div>
          <div className="text-xs lg:text-sm text-white/80 whitespace-nowrap">{t("Active Complaints", "सक्रिय शिकायतें")}</div>
        </div>
      </div>
    </div>
  );
}
