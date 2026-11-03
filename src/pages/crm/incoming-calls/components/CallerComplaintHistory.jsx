import React from "react";
import { FileText, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { useLanguage } from "@/context/LanguageContext";

export default function CallerComplaintHistory({ complaints = [] }) {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <FileText className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-bold text-foreground">
          {t("Caller's Complaint History", "कॉलर का शिकायत इतिहास")}
        </h3>
        <Badge variant="outline" className="text-[10px] ml-auto">
          {complaints.length} {t("complaints", "शिकायतें")}
        </Badge>
      </div>
      <div className="divide-y divide-border">
        {complaints.map((c, i) => (
          <div key={c.id || i} className="p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <ComplaintId id={c.id} className="text-xs font-semibold" />
              <StatusBadge status={c.status} />
              <PriorityBadge priority={c.priority} />
              <span className="text-xs text-muted-foreground ml-auto">
                {c.filedDate}
              </span>
            </div>
            <div className="text-sm font-medium text-foreground">
              {c.service} → {c.subservice}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Building2 className="w-3 h-3" /> {c.ward}
            </div>
            <div className="mt-2 bg-muted/50 rounded-lg p-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {t("Notes:", "टिप्पणी:")}{" "}
              </span>
              {c.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
