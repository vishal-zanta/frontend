import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EditButton from "@/components/EditButton";
import { Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SubServicesCards({ subservices = [], setDialog }) {
  const { t } = useLanguage();

  if (!subservices || subservices.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border">
        {t(
          "No sub-services configured for this service yet.",
          "इस सेवा के लिए अभी तक कोई उप-सेवा कॉन्फ़िगर नहीं की गई है।"
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {subservices.map((ss) => (
        <Card key={ss._id} item={ss} setDialog={setDialog} t={t} />
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
        <Badge
          variant="outline"
          className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border-amber-500/30 shrink-0"
        >
          {item?.slaType === "days" ? item.sla / 24 : item.sla}
          {item?.slaType === "days" ? "d" : "h"}
        </Badge>
      </div>

      <div className="p-3 xs:p-3.5 sm:p-4">
        <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-medium">
              {t("Geo-Tagged", "भू-टैग किया गया")}
            </span>
            <span className="font-medium text-foreground truncate block">
              {item.geoTagged ? "✅ Yes" : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-medium">
              {t("Field Visit", "क्षेत्र का दौरा")}
            </span>
            <span className="font-medium text-foreground truncate block">
              {item.fieldVisit ? "✅ Yes" : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-end gap-1.5">
        <EditButton onClick={() => setDialog({ type: "edit", item })} />
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
