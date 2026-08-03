import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiPermissionOptions, USER_ROLES_EXECULDED } from "@/utils/constants";
import { Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function DesignationCards({ designations = [], setDialog }) {
  const { t } = useLanguage();

  if (!designations || designations.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No designations found.", "कोई पदनाम नहीं मिला।")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {designations.map((d, i) => (
        <Card key={d._id || i} item={d} setDialog={setDialog} t={t} />
      ))}
    </div>
  );
}

function Card({ item, setDialog, t }) {
  const nonEditable = USER_ROLES_EXECULDED;
  const isEditable = !nonEditable.includes(item.designationEnglish);

  const permissionsList = (item.permissions || []).map(
    (p) => apiPermissionOptions.find((a) => a.value === p)?.label || p
  );

  return (
    <div className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-3 xs:p-3.5 sm:p-4 border-b border-border/60 flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-sm text-foreground">
            {item.designationEnglish || "N/A"}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {item.designationHindi || "N/A"}
          </div>
        </div>
        <Badge variant="outline" className="text-xs shrink-0">
          {item.level || "N/A"}
        </Badge>
      </div>

      <div className="p-3 xs:p-3.5 sm:p-4 space-y-2">
        <div className="space-y-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-medium">
              {t("Department", "विभाग")}
            </span>
            <span className="font-medium text-foreground truncate block">
              {item.department?.title || item.department || "N/A"}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-medium mr-1.5 mb-1">
              {t("Permissions:", "अनुमतियाँ:")}
            </span>
            {permissionsList.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {permissionsList.map((p, pi) => (
                  <Badge
                    key={pi}
                    variant="outline"
                    className="text-[10px] bg-primary/10 text-primary text-nowrap"
                  >
                    {p}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground text-xs">N/A</span>
            )}
          </div>
        </div>
      </div>

      {isEditable && (
        <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs px-2.5"
            onClick={() => setDialog({ type: "edit", item })}
          >
            <Pencil className="w-3.5 h-3.5 mr-1" />
            {t("Edit", "संपादित करें")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs px-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={() => setDialog({ type: "delete", item })}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            {t("Delete", "हटाएं")}
          </Button>
        </div>
      )}
    </div>
  );
}
