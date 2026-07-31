import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function OfficerTagTable({
  tagging = [],
  setEditItem,
  setDialog,
  handleDelete,
}) {
  const { t } = useLanguage();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left text-xs text-muted-foreground">
            <th className="px-4 py-3 font-medium">{t("Officer", "अधिकारी")}</th>
            <th className="px-4 py-3 font-medium">{t("Designation", "पदनाम")}</th>
            <th className="px-4 py-3 font-medium min-w-60">{t("Sub-services", "उप-सेवाएं")}</th>
            <th className="px-4 py-3 font-medium min-w-48">{t("Subdivisions", "अनुमंडल")}</th>
            <th className="px-4 py-3 font-medium text-center">{t("Actions", "कार्रवाई")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tagging.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="text-center py-8 text-sm text-muted-foreground"
              >
                {t("No tagging found.", "कोई मैपिंग नहीं मिली।")}
              </td>
            </tr>
          ) : (
            tagging.map((o, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{o.officer?.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {o.officer?.role?.designationEnglish}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                    {(o.services || []).map((s, si) => (
                      <Badge
                        key={si}
                        variant="outline"
                        className="text-[10px] bg-primary/10 text-primary"
                      >
                        {s.title}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                    {(o.wards || []).map((w, wi) => (
                      <Badge
                        key={wi}
                        variant="outline"
                        className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      >
                        {w}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-1 justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditItem(o);
                        setDialog({
                          officer: o.officer?.name || "",
                          designation: o.officer?.role?.designationEnglish || "",
                          services: (o.services || []).map((s) => s.title),
                          wards: o.wards || [],
                          activeComplaints: 0,
                          slaCompliant: true,
                        });
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1" /> {t("Edit", "संपादित करें")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDelete && handleDelete(o)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
