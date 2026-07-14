import { CheckCircle2, XCircle, Pause, RotateCcw, Lock, Check, Clock, AlertTriangle, AlertCircle } from "lucide-react";

export const QUERY_KEYS = {
    ROLES : "roles",
    SERVICES : "services",
    SUBSERVICES : "subservices",
    COMPLAINT_SOURCES: "complaint-sources",
    DEMOGRAPHY: "demography",
    ULBS: "ulbs",
    USERS : "users",
    OFFICER_TAGGINGS: "officer-taggings",
    SLA_CONFIGS: "sla-configs",
    WORKFLOW_LEVELS: "workflow-levels",
    OPTIONS: "options",
    OPTION_TYPES: "option-types",
    COMPLAINTS_OFFICER: "complaints-officer",
    COMPLAINT_DETAIL: "complaint-detail",
    COMPLAINT_DETAIL_OFFICER: "complaint-detail-officer",

    COMPLAINTS_ALL: "complaints-all",
    CHATS_INFINTE : "chats-infinite"
}

export const PREFERRED_LANGUAGE_OPTIONS = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "हिन्दी (Hindi)" },
];

export const IMG_BASE_URL = import.meta.env.VITE_BASE_URL;

export const STATUS_ACTIONS = [
  { 
    label: "Mark Resolved", 
    value: "RESOLVED", 
    icon: CheckCircle2, 
    color: "bg-emerald-600 hover:bg-emerald-700", 
    badgeLabel: "Resolved", 
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" ,
    isRemark : true,
  },
  { 
    label: "Closed", 
    value: "CLOSED", 
    icon: XCircle, 
    color: "bg-red-600 hover:bg-red-700", 
    badgeLabel: "Closed", 
    badgeClass: "bg-slate-50 text-slate-500 border-slate-200",
    isRemark : true,

  },
  { 
    label: "In Progress", 
    value: "IN_PROGRESS", 
    icon: Pause, 
    color: "bg-amber-600 hover:bg-amber-700", 
    badgeLabel: "In Progress", 
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200" 
  },
  { 
    label: "Reopen", 
    value: "REOPENED", 
    icon: RotateCcw, 
    color: "bg-yellow-600 hover:bg-yellow-700", 
    badgeLabel: "Reopened", 
    badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-200" 
  },
  { 
    label: "Open", 
    value: "OPEN", 
    icon: Clock, 
    color: "bg-blue-600 hover:bg-blue-700", 
    badgeLabel: "Pending", 
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200" 
  },
  { 
    label: "Escalate", 
    value: "ESCALATED", 
    icon: AlertCircle, 
    color: "bg-red-600 hover:bg-red-700", 
    badgeLabel: "Escalated", 
    badgeClass: "bg-red-100 text-red-800 border-red-300" 
  },
];

export const PRIORITY_ACTIONS = [
  { 
    label: "Normal", 
    value: "NORMAL", 
    icon: Check, 
    color: "bg-slate-600 hover:bg-slate-700", 
    badgeLabel: "Normal", 
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200" 
  },
  { 
    label: "Pending", 
    value: "PENDING", 
    icon: Clock, 
    color: "bg-blue-600 hover:bg-blue-700", 
    badgeLabel: "Pending", 
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200" 
  },
  { 
    label: "Urgent", 
    value: "URGENT", 
    icon: AlertTriangle, 
    color: "bg-amber-600 hover:bg-amber-700", 
    badgeLabel: "Urgent", 
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200" 
  },
  { 
    label: "Critical", 
    value: "CRITICAL", 
    icon: AlertCircle, 
    color: "bg-red-600 hover:bg-red-700", 
    badgeLabel: "Critical", 
    badgeClass: "bg-red-100 text-red-800 border-red-300" 
  },
];

export const FIELD_VISIT_STATUS = [
  { value: "PENDING", label: "Pending" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "IN_PROGRESS", label: "In Progress" },
];

export const getFieldVisitStatusClass = (status) => {
  const normStatus = (status || "").toUpperCase();
  if (normStatus === "COMPLETED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (normStatus === "IN_PROGRESS") return "bg-purple-50 text-purple-700 border-purple-200";
  if (normStatus === "SCHEDULED") return "bg-blue-50 text-blue-700 border-blue-200";
  if (normStatus === "CANCELLED") return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export const getStatusBadgeMeta = (status) => {
  const norm = (status || "").toUpperCase().replace(/[\s-]/g, "_");
  const match = STATUS_ACTIONS.find(a => a.value === norm);
  if (match) return match;
  // Legacy / fallbacks
  if (norm === "OPEN") {
    return { badgeLabel: "Pending", badgeClass: "bg-blue-50 text-blue-700 border-blue-200" };
  }
  if (norm === "PENDING") {
    return { badgeLabel: "Pending", badgeClass: "bg-blue-50 text-blue-700 border-blue-200" };
  }
  if (norm === "REJECTED") {
    return { badgeLabel: "Rejected", badgeClass: "bg-red-50 text-red-700 border-red-200" };
  }
  if (norm === "FIELD_VISIT") {
    return { badgeLabel: "Field Visit", badgeClass: "bg-purple-50 text-purple-700 border-purple-200" };
  }
  // Default fallback
  return { badgeLabel: status || "Pending", badgeClass: "bg-slate-100 text-slate-700 border-slate-200" };
};

export const getPriorityBadgeMeta = (priority) => {
  const norm = (priority || "").toUpperCase().replace(/[\s-]/g, "_");
  const match = PRIORITY_ACTIONS.find(p => p.value === norm);
  if (match) return match;
  // Fallbacks
  if (norm === "LOW") {
    return { badgeLabel: "Low", badgeClass: "bg-slate-100 text-slate-700 border-slate-200" };
  }
  if (norm === "HIGH") {
    return { badgeLabel: "High", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" };
  }
  // Default fallback
  return { badgeLabel: priority || "Normal", badgeClass: "bg-blue-50 text-blue-700 border-blue-200" };
};