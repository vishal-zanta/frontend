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
  const divisionsList = Array.isArray(item.divisions)
    ? item.divisions
    : item.division
      ? [item.division]
      : [];
  const subdivisionsList = item.subdivisions || item.subDivisions || item.wards || [];

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

      {/* Body: Services & Subdivisions */}
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
              {t("Divisions:", "प्रमंडल:")}
            </span>
            {divisionsList.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {divisionsList.map((d, di) => {
                  const divLabel =
                    typeof d === "object" && d
                      ? t(d.name_en || d.name, d.name_local || d.nameHindi)
                      : d;
                  return (
                    <Badge
                      key={di}
                      variant="outline"
                      className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium text-nowrap"
                    >
                      {divLabel}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <span className="text-muted-foreground text-xs">N/A</span>
            )}
          </div>

          <div className="pt-1.5 border-t border-border/40">
            <span className="text-muted-foreground block text-[10px] uppercase font-medium mb-1">
              {t("Subdivisions:", "अनुमंडल:")}
            </span>
            {subdivisionsList.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {subdivisionsList.map((w, wi) => {
                  const subLabel =
                    typeof w === "object" && w
                      ? t(w.name_en || w.name, w.name_local || w.nameHindi)
                      : w;
                  return (
                    <Badge
                      key={wi}
                      variant="outline"
                      className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-nowrap"
                    >
                      {subLabel}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <span className="text-muted-foreground text-xs">N/A</span>
            )}
          </div>
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
              setDialog({
                officer: item.officer?.name || "",
                designation: item.officer?.role?.designationEnglish || "",
                services: (item.services || []).map((s) => s.title || s.name || s),
                divisions: divisionsList.map((d) => d._id || d),
                subdivisions: (item.subdivisions || item.subDivisions || item.wards || []),
                activeComplaints: 0,
                slaCompliant: true,
              });
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
