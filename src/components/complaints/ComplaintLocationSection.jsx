import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Building2, Navigation } from "lucide-react";
import { getEntityLabel } from "@/utils/helpers";
import { Badge } from "@/components/ui/badge";

export default function ComplaintLocationSection({
  permAddr = {},
  corrAddr = {},
  loc = {},
  isCrpEqualPerAdd = false,
}) {
  const { t } = useLanguage();

  const hasPermAddr = Boolean(
    permAddr?.addressLine ||
      permAddr?.district ||
      permAddr?.block ||
      permAddr?.subdivision ||
      permAddr?.panchayat ||
      permAddr?.village ||
      permAddr?.thana ||
      permAddr?.urbanPanchayat ||
      permAddr?.ward ||
      permAddr?.landmark ||
      permAddr?.pincode,
  );

  // const isSameAddress = Boolean(
  //   isCrpEqualPerAdd ||
  //     (!corrAddr?.addressLine &&
  //       !corrAddr?.district &&
  //       !corrAddr?.pincode &&
  //       hasPermAddr),
  // );

  const effectiveCorrAddr = corrAddr;

  const hasCorrAddr = Boolean(
    effectiveCorrAddr?.addressLine ||
      effectiveCorrAddr?.addressLine2 ||
      effectiveCorrAddr?.state ||
      effectiveCorrAddr?.city ||
      effectiveCorrAddr?.district ||
      effectiveCorrAddr?.block ||
      effectiveCorrAddr?.subdivision ||
      effectiveCorrAddr?.panchayat ||
      effectiveCorrAddr?.village ||
      effectiveCorrAddr?.thana ||
      effectiveCorrAddr?.urbanPanchayat ||
      effectiveCorrAddr?.ward ||
      effectiveCorrAddr?.villageOrWard ||
      effectiveCorrAddr?.landmark ||
      effectiveCorrAddr?.pincode ||
      effectiveCorrAddr?.pinCode,
  );

  const hasLoc = Boolean(
    loc?.addressLine ||
      loc?.district ||
      loc?.block ||
      loc?.subdivision ||
      loc?.panchayat ||
      loc?.village ||
      loc?.thana ||
      loc?.urbanPanchayat ||
      loc?.ward ||
      loc?.landmark ||
      loc?.pincode ||
      loc?.pinCode ||
      loc?.division,
  );

  return (
    <div className="space-y-3">
      {/* Permanent Address */}
      {hasPermAddr && (
        <div className="bg-muted/30 rounded-lg p-2.5 lg:p-3 border border-border">
          <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
            <h4 className="text-[10px] lg:text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              {t("Permanent Address", "स्थायी पता")}
            </h4>
            {typeof permAddr.isUrban === "boolean" && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                {permAddr.isUrban
                  ? t("Urban", "शहरी")
                  : t("Rural", "ग्रामीण")}
              </Badge>
            )}
          </div>
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
                  {getEntityLabel(permAddr.district, t)}
                </span>
              </div>
            )}

            {(permAddr.block || permAddr.subdivision) && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Block / Subdivision", "प्रखंड / अनुमंडल")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(permAddr.block || permAddr.subdivision, t)}
                </span>
              </div>
            )}

            {permAddr.isUrban ? (
              <>
                {permAddr.urbanPanchayat && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      {t("Municipal Body", "नगर निकाय")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {getEntityLabel(permAddr.urbanPanchayat, t)}
                    </span>
                  </div>
                )}
                {permAddr.ward && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      {t("Ward", "वार्ड")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {getEntityLabel(permAddr.ward, t)}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                {permAddr.panchayat && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      {t("Panchayat", "पंचायत")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {getEntityLabel(permAddr.panchayat, t)}
                    </span>
                  </div>
                )}
                {permAddr.village && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      {t("Village", "गाँव")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {getEntityLabel(permAddr.village, t)}
                    </span>
                  </div>
                )}
              </>
            )}

            {permAddr.thana && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Thana", "थाना")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(permAddr.thana, t)}
                </span>
              </div>
            )}

            {permAddr.landmark && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Landmark", "लैंडमार्क")}
                </span>
                <span className="font-semibold text-foreground">
                  {permAddr.landmark}
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
            {effectiveCorrAddr.state === "Bihar" &&
              typeof effectiveCorrAddr.isUrban === "boolean" && (
                <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                  {effectiveCorrAddr.isUrban
                    ? t("Urban", "शहरी")
                    : t("Rural", "ग्रामीण")}
                </Badge>
              )}
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
            {effectiveCorrAddr.addressLine2 && (
              <div className="col-span-2 md:col-span-3">
                <span className="text-muted-foreground block font-medium">
                  {t("Address Line 2", "पता विवरण 2")}
                </span>
                <span className="font-semibold text-foreground">
                  {effectiveCorrAddr.addressLine2}
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
                  {getEntityLabel(effectiveCorrAddr.district, t)}
                </span>
              </div>
            )}

            {(effectiveCorrAddr.block || effectiveCorrAddr.subdivision) && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Block / Subdivision", "प्रखंड / अनुमंडल")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(
                    effectiveCorrAddr.block || effectiveCorrAddr.subdivision,
                    t,
                  )}
                </span>
              </div>
            )}

            {effectiveCorrAddr.isUrban ? (
              <>
                {effectiveCorrAddr.urbanPanchayat && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      {t("Municipal Body", "नगर निकाय")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {getEntityLabel(effectiveCorrAddr.urbanPanchayat, t)}
                    </span>
                  </div>
                )}
                {effectiveCorrAddr.ward && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      {t("Ward", "वार्ड")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {getEntityLabel(effectiveCorrAddr.ward, t)}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                {effectiveCorrAddr.panchayat && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      {t("Panchayat", "पंचायत")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {getEntityLabel(effectiveCorrAddr.panchayat, t)}
                    </span>
                  </div>
                )}
                {effectiveCorrAddr.village && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      {t("Village", "गाँव")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {getEntityLabel(effectiveCorrAddr.village, t)}
                    </span>
                  </div>
                )}
                {effectiveCorrAddr.villageOrWard && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      {t("Village / Ward", "गाँव / वार्ड")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {getEntityLabel(effectiveCorrAddr.villageOrWard, t)}
                    </span>
                  </div>
                )}
              </>
            )}

            {effectiveCorrAddr.thana && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Thana", "थाना")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(effectiveCorrAddr.thana, t)}
                </span>
              </div>
            )}

            {effectiveCorrAddr.landmark && !effectiveCorrAddr.addressLine2 && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Landmark", "लैंडमार्क")}
                </span>
                <span className="font-semibold text-foreground">
                  {effectiveCorrAddr.landmark}
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
          <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
            <h4 className="text-[10px] lg:text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-primary shrink-0" />
              {t(
                "Location Details / Place of Occurrence",
                "स्थान का विवरण / घटना का स्थान",
              )}
            </h4>
            {typeof loc.isUrban === "boolean" && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                {loc.isUrban ? t("Urban", "शहरी") : t("Rural", "ग्रामीण")}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3 text-[10px] lg:text-xs">
            {loc.addressLine && (
              <div className="col-span-2 md:col-span-3">
                <span className="text-muted-foreground block font-medium">
                  {t("Address Line", "पता विवरण")}
                </span>
                <span className="font-semibold text-foreground">
                  {loc.addressLine}
                </span>
              </div>
            )}
            {loc.division && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Division", "प्रमंडल")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(loc.division, t)}
                </span>
              </div>
            )}
            {loc.district && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("District", "ज़िला")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(loc.district, t)}
                </span>
              </div>
            )}

            {(loc.block || loc.subdivision) && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Block / Subdivision", "प्रखंड / अनुमंडल")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(loc.block || loc.subdivision, t)}
                </span>
              </div>
            )}

            {loc.isUrban ? (
              <>
                {loc.urbanPanchayat && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      {t("Municipal Body", "नगर निकाय")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {getEntityLabel(loc.urbanPanchayat, t)}
                    </span>
                  </div>
                )}
                {loc.ward && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      {t("Ward", "वार्ड")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {getEntityLabel(loc.ward, t)}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                {loc.panchayat && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      {t("Panchayat", "पंचायत")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {getEntityLabel(loc.panchayat, t)}
                    </span>
                  </div>
                )}
                {loc.village && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      {t("Village", "गाँव")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {getEntityLabel(loc.village, t)}
                    </span>
                  </div>
                )}
              </>
            )}

            {loc.thana && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Thana", "थाना")}
                </span>
                <span className="font-semibold text-foreground">
                  {getEntityLabel(loc.thana, t)}
                </span>
              </div>
            )}

            {loc.landmark && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Landmark", "लैंडमार्क")}
                </span>
                <span className="font-semibold text-foreground">
                  {loc.landmark}
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
