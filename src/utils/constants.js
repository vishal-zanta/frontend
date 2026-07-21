import {
  CheckCircle2,
  XCircle,
  Pause,
  RotateCcw,
  Lock,
  Check,
  Clock,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

export const USER_ROLES_EXECULDED = [
  "Admin",
  "Call Centre Executive",
  "Call Centre Supervisor",
];

export const LANGUAGES = [
  { label: "English", value: "English" },
  { label: "हिन्दी", value: "Hindi" },
];

export const MAX_LIMIT  = 500;
export const QUERY_KEYS = {
  ROLES: "roles",
  SERVICES: "services",
  SUBSERVICES: "subservices",
  COMPLAINT_SOURCES: "complaint-sources",
  DEMOGRAPHY: "demography",
  ULBS: "ulbs",
  USERS: "users",
  OFFICER_TAGGINGS: "officer-taggings",
  SLA_CONFIGS: "sla-configs",
  WORKFLOW_LEVELS: "workflow-levels",
  OPTIONS: "options",
  OPTION_TYPES: "option-types",
  COMPLAINTS_OFFICER: "complaints-officer",
  COMPLAINT_DETAIL: "complaint-detail",
  COMPLAINT_DETAIL_OFFICER: "complaint-detail-officer",

  COMPLAINTS_ALL: "complaints-all",
  CHATS_INFINTE: "chats-infinite",
  QUERY_KEY_OFIICER_DASHBOARD: "officer-dashboard",
  QUERY_KEY_OFFICER_DASHBOARD: "officer-dashboard",
  MIS_REPORTS: "mis-reports",
  MIS_STATS: "mis-stats",
  SHIFTS: "shifts",
  SYSTEM_HEALTH: "system-health",
  DEPARTMENTS: "departments",
  SKILLS: "skills",
};

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
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    isRemark: true,
    disabled: ["RESOLVED", "CLOSED"],
    roleHidden: USER_ROLES_EXECULDED,
    requireFieldVisit: true,
  },
  {
    label: "Closed",
    value: "CLOSED",
    icon: XCircle,
    color: "bg-red-600 hover:bg-red-700",
    badgeLabel: "Closed",
    badgeClass: "bg-slate-50 text-slate-500 border-slate-200",
    isRemark: true,
    disabled: ["RESOLVED", "CLOSED"],
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
    icon: Pause,
    color: "bg-amber-600 hover:bg-amber-700",
    badgeLabel: "In Progress",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    disabled: ["RESOLVED", "CLOSED"],
  },
  {
    label: "Reopen",
    value: "REOPENED",
    icon: RotateCcw,
    color: "bg-yellow-600 hover:bg-yellow-700",
    badgeLabel: "Reopened",
    badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
    isRemark: true,
  },
  {
    label: "Open",
    value: "OPEN",
    icon: Clock,
    color: "bg-blue-600 hover:bg-blue-700",
    badgeLabel: "Pending",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    disabled: ["RESOLVED", "CLOSED"],
  },
  {
    label: "Escalate",
    value: "ESCALATED",
    icon: AlertCircle,
    color: "bg-red-600 hover:bg-red-700",
    badgeLabel: "Escalated",
    badgeClass: "bg-red-100 text-red-800 border-red-300",
    disabled: ["RESOLVED", "CLOSED"],
  },
];

export const PRIORITY_ACTIONS = [
  {
    label: "Normal",
    value: "NORMAL",
    icon: Check,
    color: "bg-slate-600 hover:bg-slate-700",
    badgeLabel: "Normal",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    label: "Pending",
    value: "PENDING",
    icon: Clock,
    color: "bg-blue-600 hover:bg-blue-700",
    badgeLabel: "Pending",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    label: "Urgent",
    value: "URGENT",
    icon: AlertTriangle,
    color: "bg-amber-600 hover:bg-amber-700",
    badgeLabel: "Urgent",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    label: "Critical",
    value: "CRITICAL",
    icon: AlertCircle,
    color: "bg-red-600 hover:bg-red-700",
    badgeLabel: "Critical",
    badgeClass: "bg-red-100 text-red-800 border-red-300",
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
  if (normStatus === "COMPLETED")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (normStatus === "IN_PROGRESS")
    return "bg-purple-50 text-purple-700 border-purple-200";
  if (normStatus === "SCHEDULED")
    return "bg-blue-50 text-blue-700 border-blue-200";
  if (normStatus === "CANCELLED")
    return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export const getStatusBadgeMeta = (status) => {
  const norm = (status || "").toUpperCase().replace(/[\s-]/g, "_");
  const match = STATUS_ACTIONS.find((a) => a.value === norm);
  if (match) return match;
  // Legacy / fallbacks
  if (norm === "OPEN") {
    return {
      badgeLabel: "Pending",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    };
  }
  if (norm === "PENDING") {
    return {
      badgeLabel: "Pending",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    };
  }
  if (norm === "REJECTED") {
    return {
      badgeLabel: "Rejected",
      badgeClass: "bg-red-50 text-red-700 border-red-200",
    };
  }
  if (norm === "FIELD_VISIT") {
    return {
      badgeLabel: "Field Visit",
      badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    };
  }
  // Default fallback
  return {
    badgeLabel: status || "Pending",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  };
};

export const getPriorityBadgeMeta = (priority) => {
  const norm = (priority || "").toUpperCase().replace(/[\s-]/g, "_");
  const match = PRIORITY_ACTIONS.find((p) => p.value === norm);
  if (match) return match;
  // Fallbacks
  if (norm === "LOW") {
    return {
      badgeLabel: "Low",
      badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    };
  }
  if (norm === "HIGH") {
    return {
      badgeLabel: "High",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }
  // Default fallback
  return {
    badgeLabel: priority || "Normal",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  };
};

export const apiPermissionOptions = [
  { label: "Full Access", value: "ALL" },

  { label: "All Grievance", value: "ALL_GRIEVANCE" },
  { label: "Create Grievance", value: "CREATE_GRIEVANCE" },
  { label: "Update Grievance", value: "UPDATE_GRIEVANCE" },
  { label: "Assign Grievance", value: "ASSIGN_GRIEVANCE" }, //custom
  { label: "My Grievance", value: "MY_COMPLAINT" },
  { label: "Field Visit", value: "FIELD_VISIT" },

  { label: "View Active Users", value: "VIEW_ACTIVE_USERS" },
  { label: "Logout Users", value: "LOGOUT_USERS" }, //custom

  { label: "Source Management", value: "SOURCE_MANAGEMENT" }, //custom

  { label: "Demography Management", value: "DEMOGRAPHY_MANAGEMENT" }, //custom

  { label: "MIS Report", value: "MIS_REPORT" },

  { label: "Officer Tagging", value: "OFFICER_TAGGING" },

  { label: "Option Management", value: "OPTION_MANAGEMENT" }, //custom

  { label: "Role Management", value: "ROLE_MANAGEMENT" }, //custom

  { label: "Service Management", value: "SERVICE_MANAGEMENT" }, //custom

  { label: "SLA Configuration", value: "SLA_CONFIGURATION" },

  { label: "User Management", value: "USER_MANAGEMENT" },

  { label: "Workflow Management", value: "WORKFLOW_MANAGEMENT" },

  // Dashboards
  { label: "Admin Dashboard", value: "ADMIN_DASHBOARD" },
  { label: "Officer Dashboard", value: "OFFICER_DASHBOARD" },
  { label: "CCE Dashboard", value: "CCE_DASHBOARD" },

  // Operations
  { label: "Operational Dashboard", value: "OPERATIONAL_DASHBOARD" },
  {
    label: "Operational - Call Volume & Traffic",
    value: "OPERATIONAL_CALL_VOLUME",
  },
  {
    label: "Operational - CCE Performance",
    value: "OPERATIONAL_CCE_PERFORMANCE",
  },
  {
    label: "Operational - SLA Performance",
    value: "OPERATIONAL_SLA_PERFORMANCE",
  },
  {
    label: "Operational - Grievance Management",
    value: "OPERATIONAL_GRIEVANCE",
  },
  {
    label: "Operational - Citizen Interaction",
    value: "OPERATIONAL_CITIZEN_INTERACTION",
  },
  { label: "Operational - System Monitoring", value: "OPERATIONAL_SYSTEM" },

  // Call Centre
  { label: "Incoming Call", value: "INCOMING_CALL" },
  { label: "Call Tracker", value: "CALL_TRACKER" },
  { label: "Call History Log", value: "CALL_HISTORY_LOG" },
  { label: "Shift & Agent", value: "SHIFT_AGENT" },

  // Administration
  { label: "Call History (Admin)", value: "CALL_HISTORY" },
  { label: "Manage Officers", value: "MANAGE_OFFICERS" },
  { label: "Manage CCE Agents", value: "MANAGE_AGENTS" },
  { label: "Audit Trail", value: "AUDIT_TRAIL" },
  { label: "AI Analytical Reports", value: "AI_REPORTS" },
  { label: "Performance Dashboard", value: "PERFORMANCE_DASHBOARD" },
  { label: "Chat", value: "CHAT" },

  { label: "Call statistics", value: "CALL_STATS" },
  {label : "Department Management", value : "DEPARTMENT_MANAGEMENT"},
  // {label : "Skill Management",value : "SKILL_SET_MANAGEMENT"}
];

export const PERMISSIONS = {
  RAISE_COMPLAINTS: ["CREATE_GRIEVANCE"],
  TRACK_COMPLAINTS: ["ALL_GRIEVANCE"],
  FIELD_VISITS: ["FIELD_VISIT"],
  MY_COMPLAINTS: ["MY_COMPLAINT"],
  MIS_REPORTS: ["MIS_REPORT"],
  WORKFLOW_MANAGEMENT: ["WORKFLOW_MANAGEMENT"],
  SLA_CONFIGURATION: ["SLA_CONFIGURATION"],
  OFFICER_TAGGING: ["OFFICER_TAGGING"],
  MASTER_DATA: [
    "ROLE_MANAGEMENT",
    "OPTION_MANAGEMENT",
    "SERVICE_MANAGEMENT",
    "DEMOGRAPHY_MANAGEMENT",
    "SOURCE_MANAGEMENT",
  ],
  USER_MANAGEMENT: ["USER_MANAGEMENT"],
  MANAGE_LINKS: ["ROLE_MANAGEMENT"],

  ROLE_MANAGEMENT: ["ROLE_MANAGEMENT"],
  SERVICE_MANAGEMENT: ["SERVICE_MANAGEMENT"],
  SOURCE_MANAGEMENT: ["SOURCE_MANAGEMENT"],
  DEMOGRAPHY_MANAGEMENT: ["DEMOGRAPHY_MANAGEMENT"],
  OPTION_MANAGEMENT: ["OPTION_MANAGEMENT"],
  LOGOUT_USERS: ["LOGOUT_USERS"],
  ASSIGN_GRIEVANCE: ["ASSIGN_GRIEVANCE"],

  // New ones
  ADMIN_DASHBOARD: ["ADMIN_DASHBOARD"],
  OFFICER_DASHBOARD: ["OFFICER_DASHBOARD"],
  CCE_DASHBOARD: ["CCE_DASHBOARD"],
  OPERATIONAL_DASHBOARD: [
    "OPERATIONAL_DASHBOARD",
    "OPERATIONAL_CALL_VOLUME",
    "OPERATIONAL_CCE_PERFORMANCE",
    "OPERATIONAL_SLA_PERFORMANCE",
    "OPERATIONAL_GRIEVANCE",
    "OPERATIONAL_CITIZEN_INTERACTION",
    "OPERATIONAL_SYSTEM",
  ],
  OPERATIONAL_CALL_VOLUME: ["OPERATIONAL_DASHBOARD", "OPERATIONAL_CALL_VOLUME"],
  OPERATIONAL_CCE_PERFORMANCE: [
    "OPERATIONAL_DASHBOARD",
    "OPERATIONAL_CCE_PERFORMANCE",
  ],
  OPERATIONAL_SLA_PERFORMANCE: [
    "OPERATIONAL_DASHBOARD",
    "OPERATIONAL_SLA_PERFORMANCE",
  ],
  OPERATIONAL_GRIEVANCE: ["OPERATIONAL_DASHBOARD", "OPERATIONAL_GRIEVANCE"],
  OPERATIONAL_CITIZEN_INTERACTION: [
    "OPERATIONAL_DASHBOARD",
    "OPERATIONAL_CITIZEN_INTERACTION",
  ],
  OPERATIONAL_SYSTEM: ["OPERATIONAL_DASHBOARD", "OPERATIONAL_SYSTEM"],
  AI_REPORTS: ["AI_REPORTS"],
  PERFORMANCE_DASHBOARD: ["PERFORMANCE_DASHBOARD"],
  INCOMING_CALL: ["INCOMING_CALL"],
  CALL_TRACKER: ["CALL_TRACKER"],
  CALL_HISTORY_LOG: ["CALL_HISTORY_LOG"],
  SHIFT_AGENT: ["SHIFT_AGENT"],
  CALL_HISTORY: ["CALL_HISTORY"],
  MANAGE_OFFICERS: ["MANAGE_OFFICERS"],
  MANAGE_AGENTS: ["MANAGE_AGENTS"],
  AUDIT_TRAIL: ["AUDIT_TRAIL"],
  CHAT: ["CHAT"],

  CALL_STATS: ["CALL_STATS"],
  DEPARTMENT_MANAGEMENT : ["DEPARTMENT_MANAGEMENT"],
  // SKILL_SET_MANAGEMENT: ["SKILL_SET_MANAGEMENT"]
};
