import React, { useState, useEffect } from "react";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/utils/constants";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function getResolvedDuration(createdAt, resolvedAt, t) {
  if (!createdAt || !resolvedAt) return "";
  const start = new Date(createdAt).getTime();
  const end = new Date(resolvedAt).getTime();
  const diff = end - start;
  if (isNaN(diff) || diff < 0) return "";

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function SLATimer({ createdAt, slaHours, customText = "Service SLA" }) {
  const { t } = useLanguage();
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
        setTimeLeft(t("Expired", "समाप्त"));
        return;
      }

      setIsExpired(false);
      setIsUrgent(diff < 4 * 60 * 60 * 1000); // Urgent if less than 4 hours left

      const totalMinutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setTimeLeft(`${hours}h ${minutes}m ${t("left", "शेष")}`);
    };

    calculate();
    const interval = setInterval(calculate, 60000); // update every minute

    return () => clearInterval(interval);
  }, [createdAt, slaHours, t]);

  if (!createdAt) return null;

  let badgeClass =
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  if (isExpired) {
    badgeClass = "bg-destructive/10 text-destructive border-destructive/20";
  } else if (isUrgent) {
    badgeClass =
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 animate-pulse";
  }

  const labelText =
    customText === "Officer SLA"
      ? t("Officer SLA:", "अधिकारी एसएलए:")
      : t(`${customText}:`, "सेवा एसएलए:");

  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-medium tracking-wide flex items-center text-nowrap w-fit gap-1 ${badgeClass}`}
    >
      <Clock className="w-3 h-3" />
      {labelText} {timeLeft}
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
  userLoading,
  assignOfficerMutation,
  selectedId,
}) {
  const { t } = useLanguage();
  const { hasPermission } = useAuth();
  const isResolved =
    (c?.status === "RESOLVED" || displayStatus === "RESOLVED") && c?.resolvedAt;

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-border pb-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 lg:gap-2 mb-1 flex-wrap">
          <h2 className="text-base lg:text-lg font-bold text-primary font-mono">
            {displayId}
          </h2>
          <StatusBadge status={displayStatus} />
          <PriorityBadge priority={displayPriority} />
        </div>
        <p className="text-xs lg:text-sm font-semibold text-foreground">
          {serviceText} &rarr; {subServiceText}
        </p>

          <>
        {hasPermission(PERMISSIONS.ASSIGN_GRIEVANCE) && (
            <div className="flex gap-2 text-[10px] lg:text-xs text-muted-foreground mt-1 items-center flex-wrap">
              <span>
                {t("Filed:", "दर्ज:")} {formattedDate}
              </span>

              <>
                <SLATimer
                  createdAt={c.createdAt}
                  slaHours={c.classification?.subService?.sla || c.slaHours}
                />
                <SLATimer
                  createdAt={c?.assignedAt || null}
                  slaHours={c.slaHours}
                  customText="Officer SLA"
                />
              </>
            </div>
            )}
             {isResolved &&   <div className="mt-1">
              <Badge
                variant="outline"
                className="text-[10px] font-medium tracking-wide flex items-center text-nowrap w-fit gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                {t("Resolved in:", "समाधान समय:")}{" "}
                {getResolvedDuration(c.createdAt, c.resolvedAt, t)}
              </Badge>
       
          </div>}
            
          </>
      </div>

      {hasPermission(PERMISSIONS.ASSIGN_GRIEVANCE) ? (
        <div className="w-full sm:w-44 lg:w-56 text-left shrink-0">
          <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
            {t("Assign Officer", "अधिकारी नियुक्त करें")}
          </label>
          {userLoading ? (
            <div className="flex py-1 ">
              <Loader2 className=" animate-spin" />
            </div>
          ) : (
            <select
              value={c.assignedOfficer?._id || c.assignedOfficer || ""}
              onChange={(e) => {
                const officerId = e.target.value;
                if (officerId) {
                  assignOfficerMutation.mutate({
                    id: selectedId,
                    assignedOfficer: officerId,
                  });
                }
              }}
              disabled={
                assignOfficerMutation.isPending ||
                (userOptions || []).length == 0
              }
              className="w-full text-xs bg-background border border-border rounded-lg p-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:opacity-60 cursor-pointer"
            >
              <option value="">
                {t(
                  !userOptions || userOptions.length === 0
                    ? "No Officer Available"
                    : "Select Officer...",
                  !userOptions || userOptions.length === 0
                    ? "कोई अधिकारी उपलब्ध नहीं"
                    : "अधिकारी चुनें...",
                )}
              </option>
              {userOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
          {isCCE && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide shrink-0">
                {t("Current:", "वर्तमान:")}
              </span>
              <span className="inline-flex items-center text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 truncate">
                {c?.assignedOfficer?.name
                  ? `${c.assignedOfficer.name}${c?.assignedOfficer?.role?.designationEnglish ? ` · ${c.assignedOfficer.role.designationEnglish}` : ""}`
                  : t("Not assigned", "नियुक्त नहीं")}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-right text-xs text-muted-foreground space-y-1 flex flex-col items-end">
          <div className="text-left sm:text-right">
            {t("Filed:", "दर्ज:")} {formattedDate}
          </div>
      

          <div className="flex flex-wrap gap-1 justify-end">
            {/* {isResolved ? ( */}

            
              <>
                <SLATimer
                  createdAt={c.createdAt}
                  slaHours={c.classification?.subService?.sla || c.slaHours}
                />
                {!!c.assignedAt && (
                  <SLATimer
                    createdAt={c.assignedAt}
                    slaHours={c.slaHours}
                    customText="Officer SLA"
                  />
                )}
              </>
           
          </div>
        </div>
      )}
    </div>
  );
}
