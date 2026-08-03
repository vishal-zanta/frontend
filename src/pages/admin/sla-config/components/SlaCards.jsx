import React from "react";
import { Pencil, Trash2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function SlaCards({ docs = [], roles = [], onEdit, onDelete }) {
  const { t } = useLanguage();

  if (!docs || docs.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No SLA configurations found.", "कोई SLA कॉन्फ़िगरेशन नहीं मिला।")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 p-3 xs:p-4">
      {docs.map((s, i) => (
        <Card
          key={s._id || i}
          item={s}
          roles={roles}
          onEdit={onEdit}
          onDelete={onDelete}
          t={t}
        />
      ))}
    </div>
  );
}

function Card({ item, roles, onEdit, onDelete, t }) {
  const subServiceTitle =
    item.subService?.title ||
    item.subService?.name ||
    item.subService ||
    "N/A";

  return (
    <div className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Header */}
      <div className="p-3 xs:p-3.5 sm:p-4 border-b border-border/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-foreground truncate">
              {subServiceTitle}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {t("Sub-Service SLA Escalations", "उप-सेवा SLA एस्केलेशन")}
            </div>
          </div>
        </div>
      </div>

      {/* Body: Roles Escalation Breakdown */}
      <div className="p-3 xs:p-3.5 sm:p-4 space-y-2">
        <div className="text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50 space-y-2">
          <span className="text-muted-foreground block text-[10px] uppercase font-medium">
            {t("Escalation Levels:", "एस्केलेशन स्तर:")}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {roles.map((role) => {
              const esc = (item.escalations || []).find(
                (e) => (e.role?._id || e.role) === role._id
              );
              return (
                <div
                  key={role._id}
                  className="flex items-center justify-between p-2 rounded border border-border/40 bg-background/60 text-xs gap-2"
                >
                  <span className="text-muted-foreground truncate font-medium text-[11px]">
                    {role.designationEnglish}:
                  </span>
                  {esc ? (
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border-amber-500/20 shrink-0"
                    >
                      {esc?.slaType === "days" ? esc.slaHours / 24 : esc.slaHours}
                      {esc?.slaType === "days" ? "d" : "h"}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-[11px] font-medium shrink-0">
                      N/A
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(item)}
          className="h-8 text-xs px-2.5"
        >
          <Pencil className="w-3.5 h-3.5 mr-1" />
          {t("Edit", "संपादित करें")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs px-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          {t("Delete", "हटाएं")}
        </Button>
      </div>
    </div>
  );
}
