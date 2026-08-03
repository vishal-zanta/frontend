import React, { useState } from "react";
import {
  ScrollText,
  Search,
  Download,
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
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  const filtered = AUDIT_TRAIL.filter(
    (a) =>
      a.user.toLowerCase().includes(search.toLowerCase()) ||
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.details.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PortalLayout role="superadmin">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <SectionTitle
            title={t("Audit Trail & Logging", "ऑडिट ट्रेल और लॉगिंग")}
            subtitle={t(
              "Who viewed/updated complaint, status changes, reassignments & rejections - full traceability",
              "शिकायत किसने देखी/अद्यतन की, स्थिति में बदलाव, पुनराबंटन और अस्वीकृति - पूरी ट्रैसेबिलिटी",
            )}
          />
          <Button variant="outline">
            <Download className="w-4 h-4 mr-1" />{" "}
            {t("Export Log", "लॉग निर्यात करें")}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t(
                "Search by user, action, or complaint ID...",
                "उपयोगकर्ता, कार्रवाई या शिकायत आईडी से खोजें...",
              )}
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-44">
              <SelectValue
                placeholder={t("Action Type", "कार्रवाई का प्रकार")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("All Actions", "सभी कार्रवाइयां")}
              </SelectItem>
              <SelectItem value="status">
                {t("Status Changes", "स्थिति परिवर्तन")}
              </SelectItem>
              <SelectItem value="escalation">
                {t("Escalations", "वृद्धियां")}
              </SelectItem>
              <SelectItem value="reassign">
                {t("Reassignments", "पुनराबंटन")}
              </SelectItem>
              <SelectItem value="config">
                {t("Config Changes", "कॉन्फ़िगरेशन परिवर्तन")}
              </SelectItem>
              <SelectItem value="login">{t("Logins", "लॉगिन")}</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("Date Range", "तिथि सीमा")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Time", "सभी समय")}</SelectItem>
              <SelectItem value="today">{t("Today", "आज")}</SelectItem>
              <SelectItem value="week">
                {t("This Week", "इस सप्ताह")}
              </SelectItem>
              <SelectItem value="month">
                {t("This Month", "इस महीने")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Audit log */}
        <div className="bg-white rounded-xl border border-border">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-blue-500" />{" "}
              {t("Audit Log", "ऑडिट लॉग")} ({filtered.length}{" "}
              {t("entries", "प्रविष्टियां")})
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
