import React, { useState } from "react";
import {
  Network,
  Save,
  Check,
  Lock,
  Eye,
  Edit,
  Users,
  User,
} from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Internal staff menu items
const staffMenuItems = [
  "Dashboard",
  "Operational Dashboards",
  "AI Analytical Reports",
  "Performance Dashboard",
  "MIS Reports",
  "Workflow Config",
  "SLA Configuration",
  "Dynamic Form Config",
  "Officer Tagging",
  "Master Data",
  "User Management",
  "Manage Links",
  "Audit Trail",
  "Complaint Action",
  "Field Visit",
  "Geo-Tag Photo",
  "Raise Complaint",
  "Call Tracker",
  "Shift Management",
  "Track Complaint",
];

// Citizen-facing menu items
const citizenMenuItems = [
  "Dashboard",
  "Raise Complaint",
  "Track Complaint",
  "AI Assistant",
  "My Complaints",
  "Grievance History",
  "Download Receipt",
  "Feedback & Rating",
];

const staffRoles = [
  { name: "SUDA Admin", color: "bg-destructive/10 text-destructive" },
  { name: "Division Admin", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  { name: "ULB Admin", color: "bg-primary/10 text-primary" },
  { name: "L2 Officer", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  { name: "L1 Officer", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { name: "CC Supervisor", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { name: "CCE Agent", color: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
];

const permConfig = {
  edit: {
    icon: Edit,
    color: "text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20",
    label: "Full Access",
  },
  view: {
    icon: Eye,
    color: "text-primary bg-primary/10 hover:bg-primary/20",
    label: "View Only",
  },
  none: {
    icon: Lock,
    color: "text-muted-foreground bg-muted/50 hover:bg-muted",
    label: "No Access",
  },
  self: {
    icon: User,
    color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20",
    label: "Own Records Only",
  },
};

const permCycle = { none: "view", view: "edit", edit: "self", self: "none" };

const initialStaffPermissions = {
  "SUDA Admin": {
    Dashboard: "edit",
    "Operational Dashboards": "edit",
    "AI Analytical Reports": "view",
    "Performance Dashboard": "view",
    "MIS Reports": "edit",
    "Workflow Config": "edit",
    "SLA Configuration": "edit",
    "Dynamic Form Config": "edit",
    "Officer Tagging": "edit",
    "Master Data": "edit",
    "User Management": "edit",
    "Manage Links": "edit",
    "Audit Trail": "view",
    "Complaint Action": "none",
    "Field Visit": "none",
    "Geo-Tag Photo": "none",
    "Raise Complaint": "none",
    "Call Tracker": "view",
    "Shift Management": "view",
    "Track Complaint": "view",
  },
  "Division Admin": {
    Dashboard: "view",
    "Operational Dashboards": "view",
    "AI Analytical Reports": "view",
    "Performance Dashboard": "view",
    "MIS Reports": "view",
    "Workflow Config": "none",
    "SLA Configuration": "none",
    "Dynamic Form Config": "none",
    "Officer Tagging": "view",
    "Master Data": "none",
    "User Management": "none",
    "Manage Links": "none",
    "Audit Trail": "view",
    "Complaint Action": "edit",
    "Field Visit": "edit",
    "Geo-Tag Photo": "edit",
    "Raise Complaint": "none",
    "Call Tracker": "view",
    "Shift Management": "none",
    "Track Complaint": "view",
  },
  "ULB Admin": {
    Dashboard: "view",
    "Operational Dashboards": "view",
    "AI Analytical Reports": "none",
    "Performance Dashboard": "view",
    "MIS Reports": "view",
    "Workflow Config": "none",
    "SLA Configuration": "none",
    "Dynamic Form Config": "none",
    "Officer Tagging": "view",
    "Master Data": "none",
    "User Management": "none",
    "Manage Links": "none",
    "Audit Trail": "view",
    "Complaint Action": "edit",
    "Field Visit": "edit",
    "Geo-Tag Photo": "edit",
    "Raise Complaint": "none",
    "Call Tracker": "none",
    "Shift Management": "none",
    "Track Complaint": "view",
  },
  "L2 Officer": {
    Dashboard: "view",
    "Operational Dashboards": "none",
    "AI Analytical Reports": "none",
    "Performance Dashboard": "none",
    "MIS Reports": "none",
    "Workflow Config": "none",
    "SLA Configuration": "none",
    "Dynamic Form Config": "none",
    "Officer Tagging": "none",
    "Master Data": "none",
    "User Management": "none",
    "Manage Links": "none",
    "Audit Trail": "none",
    "Complaint Action": "edit",
    "Field Visit": "edit",
    "Geo-Tag Photo": "edit",
    "Raise Complaint": "none",
    "Call Tracker": "none",
    "Shift Management": "none",
    "Track Complaint": "view",
  },
  "L1 Officer": {
    Dashboard: "view",
    "Operational Dashboards": "none",
    "AI Analytical Reports": "none",
    "Performance Dashboard": "none",
    "MIS Reports": "none",
    "Workflow Config": "none",
    "SLA Configuration": "none",
    "Dynamic Form Config": "none",
    "Officer Tagging": "none",
    "Master Data": "none",
    "User Management": "none",
    "Manage Links": "none",
    "Audit Trail": "none",
    "Complaint Action": "edit",
    "Field Visit": "edit",
    "Geo-Tag Photo": "edit",
    "Raise Complaint": "none",
    "Call Tracker": "none",
    "Shift Management": "none",
    "Track Complaint": "view",
  },
  "CC Supervisor": {
    Dashboard: "view",
    "Operational Dashboards": "view",
    "AI Analytical Reports": "none",
    "Performance Dashboard": "view",
    "MIS Reports": "view",
    "Workflow Config": "none",
    "SLA Configuration": "none",
    "Dynamic Form Config": "none",
    "Officer Tagging": "none",
    "Master Data": "none",
    "User Management": "none",
    "Manage Links": "none",
    "Audit Trail": "view",
    "Complaint Action": "view",
    "Field Visit": "none",
    "Geo-Tag Photo": "none",
    "Raise Complaint": "edit",
    "Call Tracker": "edit",
    "Shift Management": "edit",
    "Track Complaint": "view",
  },
  "CCE Agent": {
    Dashboard: "view",
    "Operational Dashboards": "none",
    "AI Analytical Reports": "none",
    "Performance Dashboard": "none",
    "MIS Reports": "none",
    "Workflow Config": "none",
    "SLA Configuration": "none",
    "Dynamic Form Config": "none",
    "Officer Tagging": "none",
    "Master Data": "none",
    "User Management": "none",
    "Manage Links": "none",
    "Audit Trail": "none",
    "Complaint Action": "view",
    "Field Visit": "none",
    "Geo-Tag Photo": "none",
    "Raise Complaint": "edit",
    "Call Tracker": "edit",
    "Shift Management": "view",
    "Track Complaint": "view",
  },
};

const initialCitizenPermissions = {
  Dashboard: "view",
  "Raise Complaint": "edit",
  "Track Complaint": "edit",
  "AI Assistant": "view",
  "My Complaints": "self",
  "Grievance History": "self",
  "Download Receipt": "self",
  "Feedback & Rating": "edit",
};

function PermissionMatrix({ menuItems, roles, permissions, togglePermission }) {
  const cols = Array.isArray(roles) ? roles : null;
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-3 py-3 font-medium sticky left-0 bg-[#F4F7FA] dark:bg-[#172033] z-10">
                Menu Item
              </th>
              {cols ? (
                cols.map((r) => (
                  <th
                    key={r.name}
                    className="px-3 py-3 font-medium text-center min-w-[90px]"
                  >
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${r.color}`}
                    >
                      {r.name}
                    </Badge>
                  </th>
                ))
              ) : (
                <th className="px-3 py-3 font-medium text-center min-w-[90px]">
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-muted/50 text-muted-foreground"
                  >
                    Citizen
                  </Badge>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {menuItems.map((menu, mi) => (
              <tr key={mi} className="hover:bg-muted/30">
                <td className="px-3 py-2.5 font-medium sticky left-0 bg-white dark:bg-[#0f1729] z-10">
                  {menu}
                </td>
                {cols ? (
                  cols.map((r) => {
                    const perm = permissions[r.name]?.[menu] || "none";
                    const cfg = permConfig[perm];
                    const Icon = cfg.icon;
                    return (
                      <td key={r.name} className="px-3 py-2.5 text-center">
                        <button
                          onClick={() => togglePermission(r.name, menu)}
                          title={`Click to change: ${cfg.label}`}
                          className={`w-9 h-9 rounded-lg ${cfg.color} flex items-center justify-center mx-auto transition-all hover:scale-110 cursor-pointer`}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      </td>
                    );
                  })
                ) : (
                  <td className="px-3 py-2.5 text-center">
                    <button
                      onClick={() => togglePermission(null, menu)}
                      title={`Click to change: ${permConfig[permissions[menu] || "none"].label}`}
                      className={`w-9 h-9 rounded-lg ${permConfig[permissions[menu] || "none"].color} flex items-center justify-center mx-auto transition-all hover:scale-110 cursor-pointer`}
                    >
                      {React.createElement(
                        permConfig[permissions[menu] || "none"].icon,
                        { className: "w-4 h-4" },
                      )}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ManageLinks() {
  const [staffPerms, setStaffPerms] = useState(initialStaffPermissions);
  const [citizenPerms, setCitizenPerms] = useState(initialCitizenPermissions);
  const [saved, setSaved] = useState(false);

  const toggleStaff = (role, menu) => {
    setStaffPerms((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [menu]: permCycle[prev[role]?.[menu] || "none"],
      },
    }));
    setSaved(false);
  };

  const toggleCitizen = (_, menu) => {
    setCitizenPerms((prev) => ({
      ...prev,
      [menu]: permCycle[prev[menu] || "none"],
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SectionTitle
            title="Manage Links & Permissions"
            subtitle="Click any cell to cycle through access levels. Citizen Access is managed separately from internal staff roles."
          />
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-1" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1" /> Save Permissions
              </>
            )}
          </Button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {Object.entries(permConfig).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <div key={key} className="flex items-center gap-2 text-sm">
                <div
                  className={`w-7 h-7 rounded ${cfg.color} flex items-center justify-center`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-muted-foreground">{cfg.label}</span>
              </div>
            );
          })}
        </div>

        <Tabs defaultValue="staff">
          <TabsList>
            <TabsTrigger value="staff" className="gap-1">
              <Users className="w-3.5 h-3.5" /> Internal Staff Roles
            </TabsTrigger>
            <TabsTrigger value="citizen" className="gap-1">
              <User className="w-3.5 h-3.5" /> Citizen Access
            </TabsTrigger>
          </TabsList>

          <TabsContent value="staff" className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Role-based access control (RBAC) for internal government staff -
              SUDA, Division, ULB, Officers, and Call Centre personnel.
            </div>
            <PermissionMatrix
              menuItems={staffMenuItems}
              roles={staffRoles}
              permissions={staffPerms}
              togglePermission={toggleStaff}
            />
          </TabsContent>

          <TabsContent value="citizen" className="space-y-3">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-primary">
              <strong>Citizen Access Model:</strong> This is a separate access
              model for public citizens - not internal staff. Citizens access
              the portal via a public-facing interface with limited,
              self-service capabilities. They can only view/edit their own
              records.
            </div>
            <PermissionMatrix
              menuItems={citizenMenuItems}
              roles={null}
              permissions={citizenPerms}
              togglePermission={toggleCitizen}
            />
          </TabsContent>
        </Tabs>

        <div className="bg-muted/50 border border-border rounded-xl p-4 text-sm text-muted-foreground">
          <strong>Note:</strong> Citizen Access uses a fundamentally different
          access model (public self-service with own-record-only visibility) vs.
          internal staff RBAC (role-based hierarchical permissions). They are
          intentionally separated to prevent conflating the two architectures.
        </div>
      </div>
    </PortalLayout>
  );
}
