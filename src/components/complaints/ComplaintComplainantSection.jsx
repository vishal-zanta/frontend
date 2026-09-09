import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ComplaintComplainantSection({
  citizenName,
  mobileNumber,
  alternateMobile,
  emailAddress,
}) {
  const { t } = useLanguage();
  return (
    <div className="bg-muted/30 rounded-lg p-2.5 lg:p-3 border border-border">
      <h4 className="text-[10px] lg:text-xs font-bold text-foreground uppercase tracking-wider mb-2">
        {t("Complainant Details", "शिकायतकर्ता का विवरण")}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3 text-[10px] lg:text-xs">
        <div>
          <span className="text-muted-foreground block font-medium">
            {t("Full Name", "पूरा नाम")}
          </span>
          <span className="font-semibold text-foreground">
            {citizenName || "N/A"}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground block font-medium">
            {t("Mobile Number", "मोबाइल नंबर")}
          </span>
          {mobileNumber && mobileNumber !== "N/A" && mobileNumber !== "-" ? (
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
          <span className="text-muted-foreground block font-medium">
            {t("Alternate Mobile", "वैकल्पिक मोबाइल")}
          </span>
          {alternateMobile &&
          alternateMobile !== "N/A" &&
          alternateMobile !== "-" ? (
            <a
              href={`tel:${alternateMobile}`}
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              {alternateMobile}
            </a>
          ) : (
            <span className="font-semibold text-foreground">N/A</span>
          )}
        </div>
        <div>
          <span className="text-muted-foreground block font-medium">
            {t("Email Address", "ईमेल पता")}
          </span>
          {emailAddress && emailAddress !== "N/A" ? (
            <a
              href={`mailto:${emailAddress}`}
              className="font-semibold text-blue-600 hover:underline block truncate cursor-pointer"
            >
              {emailAddress}
            </a>
          ) : (
            <span className="font-semibold text-foreground">N/A</span>
          )}
        </div>
      </div>
    </div>
  );
}
