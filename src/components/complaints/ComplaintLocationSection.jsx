import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Building2, Navigation } from "lucide-react";

export default function ComplaintLocationSection({
  permAddr = {},
  corrAddr = {},
  loc = {},
  isCrpEqualPerAdd = false,
}) {
  const { t, lang } = useLanguage();

  const getEntityLabel = (item) => {
    if (!item) return "";
    if (typeof item === "object") {
      return (
        t(item.name || item.title, item.nameHindi || item.titleHindi) ||
        (lang === "hi" && (item.nameHindi || item.titleHindi)) ||
        item.name ||
        item.title ||
        ""
      );
    }
    return String(item);
  };

  const hasPermAddr = Boolean(
    permAddr?.addressLine ||
      permAddr?.district ||
      permAddr?.subdivision ||
      permAddr?.panchayat ||
      permAddr?.thana ||
      permAddr?.pincode,
  );

  const isSameAddress = Boolean(
    isCrpEqualPerAdd ||
      (!corrAddr?.addressLine &&
        !corrAddr?.district &&
        !corrAddr?.pincode &&
        hasPermAddr),
  );

  const effectiveCorrAddr = isSameAddress
    ? {
        ...permAddr,
        state: "Bihar",
      }
    : corrAddr || {};

  const hasCorrAddr = Boolean(
    effectiveCorrAddr?.addressLine ||
      effectiveCorrAddr?.state ||
      effectiveCorrAddr?.city ||
      effectiveCorrAddr?.district ||
      effectiveCorrAddr?.subdivision ||
      effectiveCorrAddr?.panchayat ||
      effectiveCorrAddr?.thana ||
      effectiveCorrAddr?.villageOrWard ||
      effectiveCorrAddr?.pincode ||
      effectiveCorrAddr?.pinCode,
  );

  const hasLoc = Boolean(
    loc?.division ||
      loc?.district ||
      loc?.subdivision ||
      loc?.block ||
      loc?.panchayat ||
      loc?.pincode,
  );

  return (
    <div className="space-y-3">
      {/* Permanent Address */}
      {hasPermAddr && (
        <div className="bg-muted/30 rounded-lg p-2.5 lg:p-3 border border-border">
          <h4 className="text-[10px] lg:text-xs font-bold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            {t("Permanent Address", "स्थायी पता")}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3 text-[10px] lg:text-xs">
            {permAddr.addressLine && (
              <div className="col-span-2 md:col-span-3">
                <span className="text-muted-foreground block font-medium">
                  {t("Address Line", "पता विवरण")}
                </span>
                <span className="font-semibold text-foreground">
                  {permAddr.addressLine}
                </span>
              </div>
            )}
            {permAddr.district && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("District", "ज़िला")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(permAddr.district)}
                </span>
              </div>
            )}
            {permAddr.subdivision && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Block / Subdivision", "प्रखंड / अनुमंडल")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(permAddr.subdivision)}
                </span>
              </div>
            )}
            {permAddr.panchayat && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Panchayat", "पंचायत")}
                </span>
                <span className="font-semibold text-foreground">
                  {permAddr.panchayat}
                </span>
              </div>
            )}
            {permAddr.thana && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Thana", "थाना")}
                </span>
                <span className="font-semibold text-foreground">
                  {permAddr.thana}
                </span>
              </div>
            )}
            {permAddr.pincode && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Pin Code", "पिन कोड")}
                </span>
                <span className="font-semibold text-foreground">
                  {permAddr.pincode}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Correspondence Address */}
      {hasCorrAddr && (
        <div className="bg-muted/30 rounded-lg p-2.5 lg:p-3 border border-border">
          <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
            <h4 className="text-[10px] lg:text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
              {t("Correspondence Address", "पत्राचार का पता")}
            </h4>
            {/* {isSameAddress && (
              <span className="text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5">
                {t("Same as Permanent Address", "स्थायी पते के समान")}
              </span>
            )} */}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3 text-[10px] lg:text-xs">
            {(effectiveCorrAddr.addressLine || effectiveCorrAddr.landmark) && (
              <div className="col-span-2 md:col-span-3">
                <span className="text-muted-foreground block font-medium">
                  {t("Address Line", "पता विवरण")}
                </span>
                <span className="font-semibold text-foreground">
                  {effectiveCorrAddr.addressLine || effectiveCorrAddr.landmark}
                </span>
              </div>
            )}
            {effectiveCorrAddr.state && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("State", "राज्य")}
                </span>
                <span className="font-semibold text-foreground">
                  {effectiveCorrAddr.state}
                </span>
              </div>
            )}
            {effectiveCorrAddr.city && effectiveCorrAddr.state !== "Bihar" && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("City", "शहर")}
                </span>
                <span className="font-semibold text-foreground">
                  {effectiveCorrAddr.city}
                </span>
              </div>
            )}
            {effectiveCorrAddr.district && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("District", "ज़िला")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(effectiveCorrAddr.district)}
                </span>
              </div>
            )}
            {effectiveCorrAddr.subdivision && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Block / Subdivision", "प्रखंड / अनुमंडल")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(effectiveCorrAddr.subdivision)}
                </span>
              </div>
            )}
            {effectiveCorrAddr.panchayat && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Panchayat", "पंचायत")}
                </span>
                <span className="font-semibold text-foreground">
                  {effectiveCorrAddr.panchayat}
                </span>
              </div>
            )}
            {effectiveCorrAddr.thana && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Thana", "थाना")}
                </span>
                <span className="font-semibold text-foreground">
                  {effectiveCorrAddr.thana}
                </span>
              </div>
            )}
            {effectiveCorrAddr.villageOrWard && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Village / Ward", "गाँव / वार्ड")}
                </span>
                <span className="font-semibold text-foreground">
                  {effectiveCorrAddr.villageOrWard}
                </span>
              </div>
            )}
            {(effectiveCorrAddr.pincode || effectiveCorrAddr.pinCode) && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Pin Code", "पिन कोड")}
                </span>
                <span className="font-semibold text-foreground">
                  {effectiveCorrAddr.pincode || effectiveCorrAddr.pinCode}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location Details / Place of Occurrence */}
      {hasLoc && (
        <div className="bg-muted/30 rounded-lg p-2.5 lg:p-3 border border-border">
          <h4 className="text-[10px] lg:text-xs font-bold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-primary shrink-0" />
            {t(
              "Location Details / Place of Occurrence",
              "स्थान का विवरण / घटना का स्थान",
            )}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3 text-[10px] lg:text-xs">
            {loc.division && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Division", "प्रमंडल")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(loc.division)}
                </span>
              </div>
            )}
            {loc.district && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("District", "ज़िला")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(loc.district)}
                </span>
              </div>
            )}
            {loc.subdivision && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Subdivision", "अनुमंडल")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(loc.subdivision)}
                </span>
              </div>
            )}
            {loc.block && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Block", "प्रखंड")}
                </span>
                <span className="font-semibold text-foreground">
                  {loc.block}
                </span>
              </div>
            )}
            {loc.panchayat && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Panchayat", "पंचायत")}
                </span>
                <span className="font-semibold text-foreground">
                  {loc.panchayat}
                </span>
              </div>
            )}
            {(loc.pincode || loc.pinCode) && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Pin Code", "पिन कोड")}
                </span>
                <span className="font-semibold text-foreground">
                  {loc.pincode || loc.pinCode}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
