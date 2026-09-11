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
    { id: "services", label: t("Services", "सेवाएं"), className: "min-w-60" },
    { id: "divisions", label: t("Divisions", "प्रमंडल"), className: "min-w-44" },
    { id: "subdivisions", label: t("Subdivisions", "अनुमंडल"), className: "min-w-48" },
    { id: "actions", label: t("Actions", "कार्रवाई"), className: "text-center" },
  ];

  const tableBody = tagging.map((o) => {
    const divisionsList = Array.isArray(o.divisions)
      ? o.divisions
      : o.division
        ? [o.division]
        : [];

    const subdivisionsList = o.subdivisions || o.subDivisions || o.wards || [];

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
      divisions: {
        render: () => (
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
            {divisionsList.length > 0 ? (
              divisionsList.map((d, di) => {
                const divLabel =
                  typeof d === "object" && d
                    ? t(d.name_en || d.name, d.name_local || d.nameHindi)
                    : d;
                return (
                  <Badge
                    key={di}
                    variant="outline"
                    className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                  >
                    {divLabel}
                  </Badge>
                );
              })
            ) : (
              <span className="text-muted-foreground text-xs">N/A</span>
            )}
          </div>
        ),
      },
      subdivisions: {
        render: () => (
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
            {subdivisionsList.length > 0 ? (
              subdivisionsList.map((sub, wi) => {
                const subLabel =
                  typeof sub === "object" && sub
                    ? t(sub.name_en || sub.name, sub.name_local || sub.nameHindi)
                    : sub;
                return (
                  <Badge
                    key={wi}
                    variant="outline"
                    className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  >
                    {subLabel}
                  </Badge>
                );
              })
            ) : (
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
                  setDialog({
                    officer: o.officer?.name || "",
                    designation: o.officer?.role?.designationEnglish || "",
                    services: (o.services || []).map((s) => s.title || s.name || s),
                    divisions: divisionsList.map((d) => d._id || d),
                    subdivisions: (o.subdivisions || o.subDivisions || o.wards || []),
                    activeComplaints: 0,
                    slaCompliant: true,
                  });
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
