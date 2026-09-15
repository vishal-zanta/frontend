import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import OfficerTagCards from "./OfficerTagCards";

export default function OfficerTagTable({
  tagging = [],
  setEditItem,
  setDialog,
  handleDelete,
}) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <OfficerTagCards
        tagging={tagging}
        setEditItem={setEditItem}
        setDialog={setDialog}
        handleDelete={handleDelete}
      />
    );
  }

  const tableHeaders = [
    { id: "officer", label: t("Officer", "अधिकारी") },
    { id: "designation", label: t("Designation", "पदनाम") },
    { id: "services", label: t("Services", "सेवाएं"), className: "min-w-52" },
    { id: "districts", label: t("Districts", "ज़िला"), className: "min-w-40" },
    { id: "areaType", label: t("Area Type", "क्षेत्र"), className: "min-w-32" },
    { id: "locations", label: t("Locations", "स्थान"), className: "min-w-64" },
    { id: "actions", label: t("Actions", "कार्रवाई"), className: "text-center" },
  ];

  const tableBody = tagging.map((o) => {
    const districtsList = Array.isArray(o.districts)
      ? o.districts
      : o.district
        ? [o.district]
        : [];

    const areaTypeList = Array.isArray(o.areaType)
      ? o.areaType
      : o.areaType
        ? [o.areaType]
        : [];

    const blocksList = Array.isArray(o.blocks)
      ? o.blocks
      : o.block
        ? [o.block]
        : [];

    const panchayatsList = Array.isArray(o.panchayats)
      ? o.panchayats
      : o.panchayat
        ? [o.panchayat]
        : [];

    const urbanPanchayatsList = Array.isArray(o.urbanPanchayats)
      ? o.urbanPanchayats
      : Array.isArray(o.ulbs)
        ? o.ulbs
        : o.urbanPanchayat
          ? [o.urbanPanchayat]
          : o.ulb
            ? [o.ulb]
            : [];

    const wardsList = Array.isArray(o.wards)
      ? o.wards
      : o.ward
        ? [o.ward]
        : [];

    return {
      officer: {
        value: o.officer?.name || "N/A",
        className: "font-medium",
      },
      designation: {
        value:
          Array.isArray(o.officer?.roles) && o.officer?.roles.length > 0
            ? o.officer.roles
                .map((r) =>
                  typeof r === "object" ? r.designationEnglish || r.name : r,
                )
                .filter(Boolean)
                .join(", ")
            : o.officer?.role?.designationEnglish || "N/A",
        className: "text-muted-foreground",
      },
      services: {
        render: () => (
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
            {(o.services || []).length > 0 ? (
              (o.services || []).map((s, si) => (
                <Badge
                  key={si}
                  variant="outline"
                  className="text-[10px] bg-primary/10 text-primary"
                >
                  {typeof s === "object" ? s.title || s.name || "N/A" : s}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-xs">N/A</span>
            )}
          </div>
        ),
      },
      districts: {
        render: () => (
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
            {districtsList.length > 0 ? (
              districtsList.map((d, di) => {
                const distLabel =
                  typeof d === "object" && d
                    ? t(d.name_en || d.name, d.name_local || d.nameHindi)
                    : d;
                return (
                  <Badge
                    key={di}
                    variant="outline"
                    className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                  >
                    {distLabel}
                  </Badge>
                );
              })
            ) : (
              <span className="text-muted-foreground text-xs">N/A</span>
            )}
          </div>
        ),
      },
      areaType: {
        render: () => (
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
            {areaTypeList.length > 0 ? (
              areaTypeList.map((at, ati) => (
                <Badge
                  key={ati}
                  variant="outline"
                  className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 capitalize"
                >
                  {at === "rural"
                    ? t("Rural", "ग्रामीण")
                    : at === "urban"
                      ? t("Urban", "शहरी")
                      : at}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-xs">N/A</span>
            )}
          </div>
        ),
      },
      locations: {
        render: () => (
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
            {blocksList.map((b, bi) => (
              <Badge
                key={`b-${bi}`}
                variant="outline"
                className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
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
                className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400"
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
                className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400"
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
                className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
              >
                {typeof w === "object" && w
                  ? t(w.name_en || w.name, w.name_local || w.nameHindi)
                  : w}
              </Badge>
            ))}
            {blocksList.length === 0 &&
              panchayatsList.length === 0 &&
              urbanPanchayatsList.length === 0 &&
              wardsList.length === 0 && (
                <span className="text-muted-foreground text-xs">N/A</span>
              )}
          </div>
        ),
      },
      actions: {
        className: "text-center",
        render: () => (
          <div className="flex gap-1 justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditItem(o);
                if (setDialog) {
                  setDialog(o);
                }
              }}
            >
              <Pencil className="w-3.5 h-3.5 mr-1" /> {t("Edit", "संपादित करें")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-destructive/10"
              onClick={() => handleDelete && handleDelete(o)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ),
      },
    };
  });

  return <MyTable tableHeaders={tableHeaders} tableBody={tableBody} />;
}
