import React from "react";
import { Pencil, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

export default function GrievenceCards({ rawItems = [], setDialog }) {
  const { t } = useLanguage();

  if (!rawItems || rawItems.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No grievance natures found.", "कोई शिकायत प्रकृति नहीं मिली।")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {rawItems.map((item) => (
        <Card key={item._id || item.title} item={item} setDialog={setDialog} t={t} />
      ))}
    </div>
  );
}

function Card({ item, setDialog, t }) {
  return (
    <div className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-3 xs:p-3.5 sm:p-4 border-b border-border/60 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <AlertCircle className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-foreground truncate">
              {item.title || "N/A"}
            </div>
            {/* <div className="text-[11px] text-muted-foreground mt-0.5">
              {t("Grievance Nature", "शिकायत प्रकृति")}
            </div> */}
          </div>
        </div>

        {/* <Badge variant="outline" className="text-[11px] bg-muted/50 text-foreground shrink-0 border-border">
          {item.type || "N/A"}
        </Badge> */}
      </div>

      <div className="p-3 xs:p-3.5 sm:p-4">
        <div className="bg-muted/40 p-2.5 rounded-lg border border-border/50 flex items-center justify-between text-xs">
          <span className="text-muted-foreground text-[10px] uppercase font-medium">
            {t("Category / Type", "श्रेणी / प्रकार")}
          </span>
          <span className="font-medium text-foreground">{item.type || "N/A"}</span>
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
