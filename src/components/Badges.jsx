import React from "react";
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeMeta, getPriorityBadgeMeta } from "@/utils/constants";

export function StatusBadge({ status }) {
  const meta = getStatusBadgeMeta(status);
  return (
    <Badge variant="outline" className={`text-[10px] font-medium tracking-wide text-nowrap ${meta.badgeClass}`}>
     Status :  {meta.badgeLabel}
    </Badge>
  );
}

export function PriorityBadge({ priority }) {
  const meta = getPriorityBadgeMeta(priority);
  return (
    <Badge variant="outline" className={`text-[10px] font-medium tracking-wide text-nowrap ${meta.badgeClass}`}>
    Priority :   {meta.badgeLabel}
    </Badge>
  );
}