import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ComplaintComplainantSection({
  citizenName,
  mobileNumber,
  emailAddress,
  preferredLanguage,
}) {
  const { t } = useLanguage();
  return (
    <div className="bg-muted/30 rounded-lg p-2.5 lg:p-3 border border-border">
      <h4 className="text-[10px] lg:text-xs font-bold text-foreground uppercase tracking-wider mb-2">
        {t("Complainant Details", "शिकायतकर्ता का विवरण")}
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3 text-[10px] lg:text-xs">
        <div>
          <span className="text-muted-foreground block">{t("Full Name", "पूरा नाम")}</span>
          <span className="font-semibold text-foreground">{citizenName}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">{t("Mobile Number", "मोबाइल नंबर")}</span>
          {mobileNumber !== "-" ? (
            <a
              href={`tel:${mobileNumber}`}
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              {mobileNumber}
            </a>
          ) : (
            <span className="font-semibold text-foreground">-</span>
          )}
        </div>
        <div>
          <span className="text-muted-foreground block">{t("Email Address", "ईमेल पता")}</span>
          {emailAddress !== "-" ? (
            <a
              href={`mailto:${emailAddress}`}
              className="font-semibold text-blue-600 hover:underline block truncate cursor-pointer"
            >
              {emailAddress}
            </a>
          ) : (
            <span className="font-semibold text-foreground">-</span>
          )}
        </div>
        <div>
          <span className="text-muted-foreground block">
            {t("Preferred Language", "पसंदीदा भाषा")}
          </span>
          <span className="font-semibold text-foreground uppercase">
            {preferredLanguage}
          </span>
        </div>
      </div>
    </div>
  );
}
