import React from "react";
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeMeta, getPriorityBadgeMeta } from "@/utils/constants";

export function StatusBadge({ status }) {
  const meta = getStatusBadgeMeta(status);
  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-medium tracking-wide text-nowrap ${meta.badgeClass}`}
    >
      Status : {meta.badgeLabel}
    </Badge>
  );
}

export function PriorityBadge({ priority }) {
  const meta = getPriorityBadgeMeta(priority);
  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-medium tracking-wide text-nowrap ${meta.badgeClass}`}
    >
      Priority : {meta.badgeLabel}
    </Badge>
  );
}

export const getTypeBadgeClass = (type) => {
  const norm = (type || "").toUpperCase();
  if (norm === "COMPLAINT") {
    return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30";
  }
  if (norm === "QUERY") {
    return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
  }
  return "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30";
};

export const getSourceBadgeClass = (source) => {
  const norm = (source || "").toUpperCase();
  if (norm === "HELPLINE") {
    return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30";
  }
  if (norm === "CALL") {
    return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
  }
  if (norm === "LANDLINE") {
    return "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/30";
  }
  if (norm === "OFFICE" || norm === "IN_PERSON") {
    return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30";
  }
  if (norm === "WEB" || norm === "WEBSITE") {
    return "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30";
  }
  if (norm === "MOBILE_APP" || norm === "APP") {
    return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30";
  }
  return "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30";
};

export function TypeBadge({ type, className = "" }) {
  if (!type) return null;
  const badgeClass = getTypeBadgeClass(type);
  return (
    <Badge
      variant="outline"
      className={`text-[9px] px-1.5 py-0.5 font-semibold uppercase tracking-wider ${badgeClass} ${className}`}
    >
      {type}
    </Badge>
  );
}

export function SourceBadge({ source, label, className = "" }) {
  if (!source && !label) return null;
  const badgeClass = getSourceBadgeClass(source);
  return (
    <Badge
      variant="outline"
      className={`text-[10px] px-1.5 py-0.5 font-medium tracking-wide ${badgeClass} ${className}`}
    >
      {label || source}
    </Badge>
  );
}
