import React from "react";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  "Pending": "bg-slate-100 text-slate-700 border-slate-200",
  "Assigned": "bg-blue-50 text-blue-700 border-blue-200",
  "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
  "Field Visit": "bg-purple-50 text-purple-700 border-purple-200",
  "On Hold": "bg-orange-50 text-orange-700 border-orange-200",
  "Reopened": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Resolved": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Rejected": "bg-red-50 text-red-700 border-red-200",
  "Closed": "bg-slate-50 text-slate-500 border-slate-200",
  "Withdrawn": "bg-gray-50 text-gray-500 border-gray-200",
  "Escalated": "bg-red-100 text-red-800 border-red-300",
};

const priorityColors = {
  "Normal": "bg-blue-50 text-blue-600 border-blue-200",
  "Low": "bg-slate-50 text-slate-600 border-slate-200",
  "High": "bg-red-50 text-red-600 border-red-200",
};

export function StatusBadge({ status }) {
  return <Badge variant="outline" className={`text-xs font-medium ${statusColors[status] || statusColors["Pending"]}`}>{status}</Badge>;
}

export function PriorityBadge({ priority }) {
  return <Badge variant="outline" className={`text-xs font-medium ${priorityColors[priority] || priorityColors["Normal"]}`}>{priority}</Badge>;
}