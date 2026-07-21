import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ComplaintLocationSection({
  addressVillageOrWard,
  addressSubdivision,
  addressDistrict,
  addressState,
  addressLandmark,
  addressPinCode,
}) {
  const { t } = useLanguage();

  return (
    <div className="bg-muted/30 rounded-lg p-2.5 lg:p-3 border border-border bg-white">
      <h4 className="text-[10px] lg:text-xs font-bold text-foreground uppercase tracking-wider mb-2">{t("Location & Address", "स्थान और पता")}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3 text-[10px] lg:text-xs">
        <div>
          <span className="text-muted-foreground block">{t("Village / Ward", "ग्राम / वार्ड")}</span>
          <span className="font-semibold text-foreground">{addressVillageOrWard}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">{t("Subdivision", "अनुमंडल")}</span>
          <span className="font-semibold text-foreground">{addressSubdivision}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">{t("District", "जिला")}</span>
          <span className="font-semibold text-foreground">{addressDistrict}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">{t("State", "राज्य")}</span>
          <span className="font-semibold text-foreground">{addressState}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">{t("Landmark", "सीमाचिह्न")}</span>
          <span className="font-semibold text-foreground">{addressLandmark}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">{t("Pin Code", "पिन कोड")}</span>
          <span className="font-semibold text-foreground">{addressPinCode}</span>
        </div>
      </div>
    </div>
  );
}
