import React from "react";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/utils/constants";

export default function ComplaintDetailHeader({
  c,
  displayId,
  displayStatus,
  displayPriority,
  serviceText,
  subServiceText,
  isCCE,
  formattedDate,
  userOptions,
  assignOfficerMutation,
  selectedId,
}) {
  const {hasPermission} = useAuth();
  return (
    <div className="flex items-start justify-between border-b border-border pb-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-primary font-mono">{displayId}</h2>
          <StatusBadge status={displayStatus} />
          <PriorityBadge priority={displayPriority} />
        </div>
        <p className="text-sm font-semibold text-foreground">
          {serviceText} &rarr; {subServiceText}
        </p>
        {isCCE && (
          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
            <span>Filed: {formattedDate}</span>
            <span>SLA: {c.classification?.subService?.sla || c.slaHours || "24"}h</span>
          </div>
        )}
      </div>

      {hasPermission(PERMISSIONS.ASSIGN_GRIEVANCE) ? (
        <div className="w-56 text-left">
          <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
            Assign Officer
          </label>
          <select
            value={c.assignedOfficer?._id || c.assignedOfficer || ""}
            onChange={(e) => {
              const officerId = e.target.value;
              if (officerId) {
                assignOfficerMutation.mutate({ id: selectedId, assignedOfficer: officerId });
              }
            }}
            disabled={assignOfficerMutation.isPending}
            className="w-full text-xs bg-background border border-border rounded-lg p-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60"
          >
            <option value="">Select Officer...</option>
            {userOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="text-right text-xs text-muted-foreground">
          <div>Filed: {formattedDate}</div>
          <div>SLA: {c.classification?.subService?.sla || c.slaHours || "24"}h</div>
        </div>
      )}
    </div>
  );
}
