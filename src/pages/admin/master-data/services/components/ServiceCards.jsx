import React from "react";
import { Pencil, Trash2, Clock, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

export default function ServiceCards({ services = [], setServiceDialog, setDialog }) {
  const { t } = useLanguage();
  const handleDialog = setServiceDialog || setDialog;

  if (!services || services.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No services found.", "कोई सेवा नहीं मिली।")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {services.map((s) => (
        <Card key={s._id || s.title} item={s} setDialog={handleDialog} t={t} />
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
          <div className="text-xs text-muted-foreground mt-1">
            <span className="font-medium">{t("Department:", "विभाग:")}</span>{" "}
            <span className="text-primary font-semibold">
              {item.department?.title || item.department?.name || item.department || "N/A"}
            </span>
          </div>
        </div>

        {item.sla !== undefined && item.sla !== null && (
          <Badge
            variant="outline"
            className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border-amber-500/30 shrink-0"
          >
            <Clock className="w-3 h-3 mr-1" />
            {item?.slaType === "days" ? item.sla / 24 : item.sla}
            {item?.slaType === "days" ? "d" : "h"}
          </Badge>
        )}
      </div>

      <div className="px-3 py-2 bg-muted/20 flex items-center gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">{t("Geo-Tagged:", "भू-टैग:")}</span>
          <span className="font-medium">{item.geoTagged ? "✅" : "❌"}</span>
        </div>
        <div className="flex items-center gap-1 ml-3">
          <span className="text-muted-foreground">{t("Field Visit:", "क्षेत्र दौरा:")}</span>
          <span className="font-medium">{item.fieldVisit ? "✅" : "❌"}</span>
        </div>
      </div>

      <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDialog && setDialog({ type: "edit", item })}
          className="h-8 text-xs px-2.5"
        >
          <Pencil className="w-3.5 h-3.5 mr-1" />
          {t("Edit", "संपादित करें")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs px-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
          onClick={() => setDialog && setDialog({ type: "delete", item })}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          {t("Delete", "हटाएं")}
        </Button>
      </div>
    </div>
  );
}
