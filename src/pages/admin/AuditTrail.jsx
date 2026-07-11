import React, { useState } from "react";
import {
  ScrollText,
  Search,
  Download,
  Filter,
  User,
  Clock,
  FileText,
  Settings,
  AlertTriangle,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { AUDIT_TRAIL } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const actionConfig = {
  "Status Updated": {
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
  },
  "Complaint Registered": { icon: FileText, color: "bg-blue-50 text-blue-600" },
  "Auto-Escalation": { icon: AlertTriangle, color: "bg-red-50 text-red-600" },
  "Config Updated": { icon: Settings, color: "bg-purple-50 text-purple-600" },
  "Photo Uploaded": { icon: MapPin, color: "bg-sky-50 text-sky-600" },
  "Reassigned Complaint": {
    icon: AlertTriangle,
    color: "bg-amber-50 text-amber-600",
  },
  "Complaint Closed": {
    icon: CheckCircle2,
    color: "bg-slate-50 text-slate-600",
  },
  "User Created": { icon: User, color: "bg-indigo-50 text-indigo-600" },
  "Shift Updated": { icon: Clock, color: "bg-orange-50 text-orange-600" },
  Login: { icon: User, color: "bg-green-50 text-green-600" },
};

export default function AuditTrail() {
  const [search, setSearch] = useState("");

  const filtered = AUDIT_TRAIL.filter(
    (a) =>
      a.user.toLowerCase().includes(search.toLowerCase()) ||
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.details.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SectionTitle
            title="Audit Trail & Logging"
            subtitle="Who viewed/updated complaint, status changes, reassignments & rejections - full traceability"
          />
          <Button variant="outline">
            <Download className="w-4 h-4 mr-1" /> Export Log
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by user, action, or complaint ID..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="status">Status Changes</SelectItem>
              <SelectItem value="escalation">Escalations</SelectItem>
              <SelectItem value="reassign">Reassignments</SelectItem>
              <SelectItem value="config">Config Changes</SelectItem>
              <SelectItem value="login">Logins</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Audit log */}
        <div className="bg-white rounded-xl border border-border">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-blue-500" /> Audit Log (
              {filtered.length} entries)
            </h3>
          </div>
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto scrollbar-thin">
            {filtered.map((log, i) => {
              const cfg = actionConfig[log.action] || {
                icon: FileText,
                color: "bg-slate-50 text-slate-600",
              };
              const Icon = cfg.icon;
              return (
                <div
                  key={i}
                  className="px-5 py-3 hover:bg-muted/30 flex items-start gap-4"
                >
                  <div
                    className={`w-9 h-9 rounded-lg ${cfg.color} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{log.user}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {log.role}
                      </Badge>
                      <span className="text-sm text-muted-foreground">→</span>
                      <span className="text-sm font-medium text-foreground">
                        {log.action}
                      </span>
                      {log.complaintId !== "-" && (
                        <ComplaintId
                          id={log.complaintId}
                          className="text-[10px]"
                        />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {log.details}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />{" "}
                      {log.timestamp.split(", ")[1] || log.timestamp}
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {log.timestamp.split(", ")[0]}
                    </div>
                    <div className="text-[10px] text-muted-foreground/50 font-mono mt-0.5">
                      {log.ipAddress}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
