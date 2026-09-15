import React from "react";
import { Pencil, Trash2, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function OfficerTagCards({
  tagging = [],
  setEditItem,
  setDialog,
  handleDelete,
}) {
  const { t } = useLanguage();

  if (!tagging || tagging.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No tagging found.", "कोई मैपिंग नहीं मिली।")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 p-3 xs:p-4">
      {tagging.map((o, i) => (
        <Card
          key={o._id || i}
          item={o}
          setEditItem={setEditItem}
          setDialog={setDialog}
          handleDelete={handleDelete}
          t={t}
        />
      ))}
    </div>
  );
}

function Card({ item, setEditItem, setDialog, handleDelete, t }) {
  const servicesList = item.services || [];
  const districtsList = Array.isArray(item.districts)
    ? item.districts
    : item.district
      ? [item.district]
      : [];

  const areaTypeList = Array.isArray(item.areaType)
    ? item.areaType
    : item.areaType
      ? [item.areaType]
      : [];

  const blocksList = Array.isArray(item.blocks)
    ? item.blocks
    : item.block
      ? [item.block]
      : [];

  const panchayatsList = Array.isArray(item.panchayats)
    ? item.panchayats
    : item.panchayat
      ? [item.panchayat]
      : [];

  const urbanPanchayatsList = Array.isArray(item.urbanPanchayats)
    ? item.urbanPanchayats
    : Array.isArray(item.ulbs)
      ? item.ulbs
      : item.urbanPanchayat
        ? [item.urbanPanchayat]
        : item.ulb
          ? [item.ulb]
          : [];

  const wardsList = Array.isArray(item.wards)
    ? item.wards
    : item.ward
      ? [item.ward]
      : [];

  return (
    <div className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Top Header: Officer Name & Designation */}
      <div className="p-3 xs:p-3.5 sm:p-4 border-b border-border/60 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            <UserCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-foreground truncate">
              {item.officer?.name || "N/A"}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">
              {Array.isArray(item.officer?.roles) && item.officer?.roles.length > 0
                ? item.officer.roles
                    .map((r) =>
                      typeof r === "object" ? r.designationEnglish || r.name : r,
                    )
                    .filter(Boolean)
                    .join(", ")
                : item.officer?.role?.designationEnglish || "N/A"}
            </div>
          </div>
        </div>

        <Badge variant="outline" className="text-[10px] shrink-0">
          {Array.isArray(item.officer?.roles) && item.officer?.roles.length > 0
            ? item.officer.roles
                .map((r) =>
                  typeof r === "object" ? r.designationEnglish || r.name : r,
                )
                .filter(Boolean)
                .join(", ")
            : item.officer?.role?.designationEnglish || "N/A"}
        </Badge>
      </div>

      {/* Body: Services, Districts, Area Type & Locations */}
      <div className="p-3 xs:p-3.5 sm:p-4 space-y-3">
        <div className="space-y-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-medium mb-1">
              {t("Services:", "सेवाएं:")}
            </span>
            {servicesList.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {servicesList.map((s, si) => (
                  <Badge
                    key={si}
                    variant="outline"
                    className="text-[10px] bg-primary/10 text-primary text-nowrap"
                  >
                    {typeof s === "object" ? s.title || s.name || "N/A" : s}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground text-xs">N/A</span>
            )}
          </div>

          <div className="pt-1.5 border-t border-border/40">
            <span className="text-muted-foreground block text-[10px] uppercase font-medium mb-1">
              {t("Districts:", "ज़िला:")}
            </span>
            {districtsList.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {districtsList.map((d, di) => {
                  const distLabel =
                    typeof d === "object" && d
                      ? t(d.name_en || d.name, d.name_local || d.nameHindi)
                      : d;
                  return (
                    <Badge
                      key={di}
                      variant="outline"
                      className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium text-nowrap"
                    >
                      {distLabel}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <span className="text-muted-foreground text-xs">N/A</span>
            )}
          </div>

          {areaTypeList.length > 0 && (
            <div className="pt-1.5 border-t border-border/40">
              <span className="text-muted-foreground block text-[10px] uppercase font-medium mb-1">
                {t("Area Type:", "क्षेत्र का प्रकार:")}
              </span>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {areaTypeList.map((at, ati) => (
                  <Badge
                    key={ati}
                    variant="outline"
                    className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 capitalize text-nowrap"
                  >
                    {at === "rural"
                      ? t("Rural", "ग्रामीण")
                      : at === "urban"
                        ? t("Urban", "शहरी")
                        : at}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(blocksList.length > 0 ||
            panchayatsList.length > 0 ||
            urbanPanchayatsList.length > 0 ||
            wardsList.length > 0) && (
            <div className="pt-1.5 border-t border-border/40">
              <span className="text-muted-foreground block text-[10px] uppercase font-medium mb-1">
                {t("Locations:", "स्थान:")}
              </span>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {blocksList.map((b, bi) => (
                  <Badge
                    key={`b-${bi}`}
                    variant="outline"
                    className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-nowrap"
                  >
                    {typeof b === "object" && b
                      ? t(b.name_en || b.name, b.name_local || b.nameHindi)
                      : b}
                  </Badge>
                ))}
                {panchayatsList.map((p, pi) => (
                  <Badge
                    key={`p-${pi}`}
                    variant="outline"
                    className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 text-nowrap"
                  >
                    {typeof p === "object" && p
                      ? t(p.name_en || p.name, p.name_local || p.nameHindi)
                      : p}
                  </Badge>
                ))}
                {urbanPanchayatsList.map((u, ui) => (
                  <Badge
                    key={`u-${ui}`}
                    variant="outline"
                    className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 text-nowrap"
                  >
                    {typeof u === "object" && u
                      ? t(u.name_en || u.name, u.name_local || u.nameHindi)
                      : u}
                  </Badge>
                ))}
                {wardsList.map((w, wi) => (
                  <Badge
                    key={`w-${wi}`}
                    variant="outline"
                    className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-nowrap"
                  >
                    {typeof w === "object" && w
                      ? t(w.name_en || w.name, w.name_local || w.nameHindi)
                      : w}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditItem(item);
            if (setDialog) {
              setDialog(item);
            }
          }}
          className="h-8 text-xs px-2.5"
        >
          <Pencil className="w-3.5 h-3.5 mr-1" />
          {t("Edit", "संपादित करें")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs px-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
          onClick={() => handleDelete && handleDelete(item)}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          {t("Delete", "हटाएं")}
        </Button>
      </div>
    </div>
  );
}
