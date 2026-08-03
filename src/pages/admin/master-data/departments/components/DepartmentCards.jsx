import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function DepartmentCards({ departments = [], setDialog }) {
  const { t } = useLanguage();

  if (!departments || departments.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No departments found.", "कोई विभाग नहीं मिला।")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {departments.map((d) => (
        <Card key={d._id || d.title} item={d} setDialog={setDialog} t={t} />
      ))}
    </div>
  );
}

function Card({ item, setDialog, t }) {
  return (
    <div className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-3 xs:p-3.5 sm:p-4 border-b border-border/60 flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-sm text-foreground">
            {item.title || "N/A"}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {item.titleHindi || "N/A"}
          </div>
        </div>
      </div>

      <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDialog({ type: "edit", item })}
          className="h-8 text-xs px-2.5"
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
    </div>
  );
}
