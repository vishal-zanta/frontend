import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Search,
  Users,
  Settings,
  FileBarChart,
  Bot,
  ShieldCheck,
  Building2,
  Phone,
  Workflow,
  SlidersHorizontal,
  UserCog,
  ScrollText,
  Network,
  Activity,
  TrendingUp,
  BarChart3,
  Zap,
  ChevronDown,
  X,
  History,
  MessageSquare,
  ClipboardList,
  HardHat,
  Headphones,
} from "lucide-react";
import { PORTAL_META } from "@/lib/biharData";
import { apiPermissionOptions, PERMISSIONS } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";

export const sidebarSections = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
        permissions: PERMISSIONS.ADMIN_DASHBOARD,
      },
      {
        label: "Officer Dashboard",
        path: "/officer",
        icon: LayoutDashboard,
        permissions: PERMISSIONS.OFFICER_DASHBOARD,
      },
      {
        label: "CCE Dashboard",
        path: "/crm",
        icon: LayoutDashboard,
        permissions: PERMISSIONS.CCE_DASHBOARD,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Operational Dashboards",
        path: "/admin/operational",
        icon: Activity,
        permissions: PERMISSIONS.OPERATIONAL_DASHBOARD,
        children: [
          {
            label: "Call Volume & Traffic",
            path: "/admin/operational?tab=call-volume",
            permissions: PERMISSIONS.OPERATIONAL_CALL_VOLUME,
          },
          {
            label: "CCE Performance",
            path: "/admin/operational?tab=cce-performance",
            permissions: PERMISSIONS.OPERATIONAL_CCE_PERFORMANCE,
          },
          {
            label: "SLA Performance",
            path: "/admin/operational?tab=sla-performance",
            permissions: PERMISSIONS.OPERATIONAL_SLA_PERFORMANCE,
          },
          {
            label: "Grievance Management",
            path: "/admin/operational?tab=grievance",
            permissions: PERMISSIONS.OPERATIONAL_GRIEVANCE,
          },
          {
            label: "Citizen Interaction",
            path: "/admin/operational?tab=citizen-interaction",
            permissions: PERMISSIONS.OPERATIONAL_CITIZEN_INTERACTION,
          },
          {
            label: "System Monitoring",
            path: "/admin/operational?tab=system",
            permissions: PERMISSIONS.OPERATIONAL_SYSTEM,
          },
        ],
      },
      {
        label: "AI Analytical Reports",
        path: "/admin/ai-reports",
        icon: TrendingUp,
        permissions: PERMISSIONS.AI_REPORTS,
      },
      {
        label: "Performance Dashboard",
        path: "/admin/performance",
        icon: BarChart3,
        permissions: PERMISSIONS.PERFORMANCE_DASHBOARD,
      },
    ],
  },
  {
    title: "Complaints",
    items: [
      {
        label: "My Complaints",
        path: "/officer/complaints",
        icon: Search,
        permissions: PERMISSIONS.MY_COMPLAINTS,
      },
      {
        label: "Field Visits",
        path: "/officer/field-visits",
        icon: ClipboardList,
        permissions: PERMISSIONS.FIELD_VISITS, 
      },
      {
        label: "Raise Complaint",
        path: "/crm/raise",
        icon: FileText,
        permissions: PERMISSIONS.RAISE_COMPLAINTS,
      },
      {
        label: "Track Complaint",
        path: "/crm/track-complaint",
        icon: Search,
        permissions: PERMISSIONS.TRACK_COMPLAINTS ,
      },
    ],
  },
  {
    title: "Call Centre",
    items: [
      {
        label: "Incoming Call",
        path: "/crm/incoming-call",
        icon: Phone,
        permissions: PERMISSIONS.INCOMING_CALL,
      },
      {
        label: "Call Tracker",
        path: "/crm/calls",
        icon: Phone,
        permissions: PERMISSIONS.CALL_TRACKER,
      },
      {
        label: "Call History Log",
        path: "/crm/history",
        icon: History,
        permissions: PERMISSIONS.CALL_HISTORY_LOG,
      },
      {
        label: "Shift Management",
        path: "/crm/shift",
        icon: Users,
        permissions: PERMISSIONS.SHIFT_AGENT,
      },
    ],
  },
  {
    title: "MIS & Reports",
    items: [
      {
        label: "MIS Reports",
        path: "/admin/mis",
        icon: FileBarChart,
        permissions: PERMISSIONS.MIS_REPORTS,
        children: [
          {
            label: "Complaint Summary",
            path: "/admin/mis?report=summary",
            permissions: PERMISSIONS.MIS_REPORTS,
          },
          {
            label: "Officer Ranking",
            path: "/admin/mis?report=officer",
            permissions: PERMISSIONS.MIS_REPORTS,
            
          },
          {
            label: "Service Performance",
            path: "/admin/mis?report=service",
            permissions: PERMISSIONS.MIS_REPORTS,
          },
          {
            label: "Urban Performance",
            path: "/admin/mis?report=urban",
            permissions: PERMISSIONS.MIS_REPORTS,
          },
          {
            label: "Rural Performance",
            path: "/admin/mis?report=rural",
            permissions: PERMISSIONS.MIS_REPORTS,
          },
          {
            label: "ULB Leadership Board",
            path: "/admin/mis?report=ulb",
            permissions: PERMISSIONS.MIS_REPORTS,
          },
          {
            label: "IVR Report",
            path: "/admin/mis?report=ivr",
            permissions: PERMISSIONS.MIS_REPORTS,
          },
          {
            label: "Agent Performance",
            path: "/admin/mis?report=agent",
            permissions: PERMISSIONS.MIS_REPORTS,
          },
        ],
      },
      {
        label: "Call History",
        path: "/admin/call-history",
        icon: History,
        permissions: PERMISSIONS.CALL_HISTORY,
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        label: "Workflow Config",
        path: "/admin/workflow",
        icon: Workflow,
        permissions: PERMISSIONS.WORKFLOW_MANAGEMENT,
      },
      {
        label: "SLA Configuration",
        path: "/admin/sla",
        icon: SlidersHorizontal,
        permissions: PERMISSIONS.SLA_CONFIGURATION,
      },
      {
        label: "Officer Tagging",
        path: "/admin/officer-tagging",
        icon: UserCog,
        permissions: PERMISSIONS.OFFICER_TAGGING,
      },
      {
        label: "Master Data",
        path: "/admin/master-data",
        icon: Building2,
        permissions: PERMISSIONS.MASTER_DATA,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "User Management",
        path: "/admin/users",
        icon: Users,
        permissions: PERMISSIONS.USER_MANAGEMENT,
      },
      // {
      //   label: "Manage Officers",
      //   path: "/admin/officers",
      //   icon: HardHat,
      //   permissions: PERMISSIONS.MANAGE_OFFICERS,
      // },
      // {
      //   label: "Manage CCE Agents",
      //   path: "/admin/agents",
      //   icon: Headphones,
      //   permissions: PERMISSIONS.MANAGE_AGENTS,
      // },
      // {
      //   label: "Manage Links",
      //   path: "/admin/manage-links",
      //   icon: Network,
      //   permissions: PERMISSIONS.MANAGE_LINKS,
      // },
      // {
      //   label: "Audit Trail",
      //   path: "/admin/audit",
      //   icon: ScrollText,
      //   permissions: PERMISSIONS.AUDIT_TRAIL,
      // },
    ],
  },
];

const roleConfig = {
  superadmin: {
    label: "Super Admin",
    color: "text-sky-400",
    sections: sidebarSections,
  },
  officer: {
    label: "Officer",
    color: "text-emerald-400",
    sections: sidebarSections,
  },
  crm: {
    label: "CRM Agent",
    color: "text-amber-400",
    sections: sidebarSections,
  },
};

// Profile-specific sidebar label overrides
const profileLabelOverrides = {
  crm: {
    supervisor: { "Shift & Agent": "Shift Management" },
    agent: { "Shift & Agent": "My Shift" },
  },
};

function NavItem({ item, onNavigate, overrideLabel }) {
  const { hasPermission } = useAuth();
  const location = useLocation();
  const label = overrideLabel || item.label;
  const isActive = location.pathname === item.path;
  
  const visibleChildren = (item.children || []).filter((child) =>
    hasPermission(child.permissions)
  );

  const hasChildren = visibleChildren.length > 0;
  const childActive =
    hasChildren &&
    visibleChildren.some((c) => location.pathname + location.search === c.path);
  const [expanded, setExpanded] = useState(isActive || childActive);
  const Icon = item.icon;

  if (hasChildren) {
    return (
      <div className="mb-0.5">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full transition-all ${
            isActive || childActive
              ? "bg-sidebar-primary text-white font-medium shadow-md"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }`}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="truncate flex-1 text-left">{label}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
        {expanded && (
          <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
            {visibleChildren.map((child, ci) => {
              const childIsActive =
                location.pathname + location.search === child.path;
              return (
                <Link
                  key={ci}
                  to={child.path}
                  onClick={onNavigate}
                  className={`block px-3 py-1.5 rounded-lg text-xs transition-all ${
                    childIsActive
                      ? "bg-sidebar-accent text-white font-medium"
                      : "text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }`}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-0.5 transition-all ${
        isActive
          ? "bg-sidebar-primary text-white font-medium shadow-md"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function Sidebar({
  role = "superadmin",
  profile,
  open = true,
  onClose,
}) {
  const config = roleConfig[role] || roleConfig.superadmin;
  const overrides = profileLabelOverrides[role]?.[profile] || {};
  const { hasPermission } = useAuth();

  const navRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedScrollTop = sessionStorage.getItem("sidebar-scroll-position");
      if (savedScrollTop && navRef.current) {
        requestAnimationFrame(() => {
          if (navRef.current) {
            navRef.current.scrollTop = parseInt(savedScrollTop, 10);
          }
        });
      }
    }
  }, []);

  const handleScroll = (e) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("sidebar-scroll-position", e.currentTarget.scrollTop);
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
        bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0 border-r border-sidebar-border
        transition-all duration-300 overflow-hidden
        ${open ? "w-64" : "w-0"}
        lg:sticky fixed z-50 lg:z-auto
      `}
      >
        <div className="w-64 flex flex-col h-full">
          <div className="px-5 py-4 border-b border-sidebar-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center shadow-lg shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white leading-tight">
                  e-Grievance
                </div>
                <div className="text-[10px] text-sidebar-foreground/60 leading-tight">
                  Govt. of Bihar
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-sidebar-accent rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav
            ref={navRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto scrollbar-thin py-3 px-3"
          >
            {config.sections.map((section, si) => {
              const visibleItems = section.items.filter((item) =>
                hasPermission(item.permissions)
              );

              if (visibleItems.length === 0) return null;

              return (
                <div key={si} className="mb-4">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                    {section.title}
                  </div>
                  {visibleItems.map((item, ii) => (
                    <NavItem
                      key={`${si}-${ii}`}
                      item={item}
                      onNavigate={onClose}
                      overrideLabel={overrides[item.label]}
                    />
                  ))}
                </div>
              );
            })}
          </nav>

          <div className="px-4 py-3 border-t border-sidebar-border text-[10px] text-sidebar-foreground/50">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span className="font-medium text-sidebar-foreground/70">
                System Status
              </span>
            </div>
            <div>All services operational</div>
            <div className="mt-1">{PORTAL_META.version}</div>
          </div>
        </div>
      </aside>
    </>
  );
}
