import React from "react";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { useLanguage } from "@/context/LanguageContext";

export default function RecentComplaintsCards({ complaints = [] }) {
  const { t } = useLanguage();

  if (!complaints || complaints.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No complaints found", "कोई शिकायत नहीं मिली")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {complaints.map((c) => {
        const citizenName = c.citizenInfo?.fullName || "N/A";
        const serviceName = c.classification?.subService?.service?.title || "N/A";
        const districtName = c.address?.district?.name || c.address?.district || "N/A";

        return (
          <div
            key={c._id || c.id}
            className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 xs:p-3.5 border-b border-border/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <ComplaintId id={c._id} complaint={c} />
              <div className="flex items-center gap-1.5 shrink-0 ">
                <StatusBadge status={c.status} />
                <PriorityBadge priority={c.assignedPriority} />
              </div>
            </div>

            {/* Body */}
            <div className="p-3 xs:p-3.5 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                    {t("Citizen", "नागरिक")}
                  </span>
                  <span className="font-medium text-foreground text-xs block truncate mt-0.5">
                    {citizenName}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                    {t("District", "जिला")}
                  </span>
                  <span className="font-medium text-foreground text-xs block truncate mt-0.5">
                    {districtName}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                    {t("Service", "सेवा")}
                  </span>
                  <span className="font-medium text-foreground text-xs block truncate mt-0.5">
                    {serviceName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
