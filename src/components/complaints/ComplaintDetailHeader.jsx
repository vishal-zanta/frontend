import React, { useState, useEffect } from "react";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/utils/constants";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

function SLATimer({ createdAt, slaHours }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!createdAt) return;

    const calculate = () => {
      const createdAtTime = new Date(createdAt).getTime();
      const slaHrs = Number(slaHours || 24);
      const slaMs = slaHrs * 60 * 60 * 1000;
      const deadline = createdAtTime + slaMs;
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        setIsExpired(true);
        setIsUrgent(false);
        setTimeLeft("Expired");
        return;
      }

      setIsExpired(false);
      setIsUrgent(diff < 4 * 60 * 60 * 1000); // Urgent if less than 4 hours left

      const totalMinutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setTimeLeft(`${hours}h ${minutes}m left`);
    };

    calculate();
    const interval = setInterval(calculate, 60000); // update every minute

    return () => clearInterval(interval);
  }, [createdAt, slaHours]);

  if (!createdAt) return null;

  let badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (isExpired) {
    badgeClass = "bg-red-50 text-red-700 border-red-200";
  } else if (isUrgent) {
    badgeClass = "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
  }

  return (
    <Badge variant="outline" className={`text-[10px] font-medium tracking-wide flex items-center gap-1 ${badgeClass}`}>
      <Clock className="w-3 h-3" />
      SLA Timer: {timeLeft}
    </Badge>
  );
}

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
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h2 className="text-lg font-bold text-primary font-mono">{displayId}</h2>
          <StatusBadge status={displayStatus} />
          <PriorityBadge priority={displayPriority} />
        </div>
        <p className="text-sm font-semibold text-foreground">
          {serviceText} &rarr; {subServiceText}
        </p>
        {isCCE && (
          <div className="flex gap-4 text-xs text-muted-foreground mt-1 items-center">
            <span>Filed: {formattedDate}</span>
            {/* <span>SLA: {c.classification?.subService?.sla || c.slaHours || "24"}h</span> */}
          <SLATimer createdAt={c.createdAt} slaHours={c.classification?.subService?.sla || c.slaHours} />

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
