import React from "react";
import { Server, Cpu, HardDrive, Database, Globe, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { SYSTEM_HEALTH } from "@/lib/biharData";
import { useGetMonitoringChecks, useGetSystemHealth } from "../hooks";
import { useLanguage } from "@/context/LanguageContext";
import MonitoringStatus from "./components/MonitoringStatus";
import { formatUnderscoreText } from "@/utils/helpers";
import moment from "moment";

const statusBadge = (status) => {
  if (status === "Operational")
    return (
      <Badge
        variant="outline"
        className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      >
        {"● " + status}
      </Badge>
    );
  if (status === "Degraded")
    return (
      <Badge
        variant="outline"
        className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400"
      >
        {"● " + status}
      </Badge>
    );
  return (
    <Badge
      variant="outline"
      className="text-xs bg-destructive/10 text-destructive"
    >
      {"● " + status}
    </Badge>
  );
};

export default function SystemTab() {
  const { t } = useLanguage();
  const chartData = [
    { name: "CPU", usage: SYSTEM_HEALTH.cpuUsage, limit: 100 },
    {
      name: "Memory",
      usage: SYSTEM_HEALTH.memoryUsage,
      limit: 100,
    },
    {
      name: "DB Conn",
      usage: Math.round((SYSTEM_HEALTH.dbConnections / 100) * 100),
      limit: 100,
    },
  ];
  const { data, isLoading, error } = useGetSystemHealth(
    {},
    { refetchInterval: 60 * 1000 },
  );

  const {
    data: monitorApiData,
    isLoading: monitorLoading,
    error: monitorError,
  } = useGetMonitoringChecks();
  const monitorData = monitorApiData?.data?.data;

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const time = moment(timestamp);
    if (!time.isValid()) return "";
    const now = moment();
    const diffInSeconds = now.diff(time, "seconds");

    if (diffInSeconds < 60) {
      return t("Just now", "अभी");
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    return time.format("DD/MM");
  };

  const systemStats = data?.data?.data;
  return (
    <div className="space-y-6">
      {/* <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard
          icon={Server}
          label="Uptime"
          value={SYSTEM_HEALTH.uptime}
          color="green"
          sublabel="Target: 99.9%"
        />
        <StatCard
          icon={Activity}
          label="API Response"
          value={SYSTEM_HEALTH.apiResponseTime}
          color="blue"
          sublabel="Target: <200ms"
        />
        <StatCard
          icon={Users}
          label="Active Sessions"
          value={SYSTEM_HEALTH.activeSessions}
          color="purple"
        />
        <StatCard
          icon={Cpu}
          label="CPU Usage"
          value={`${SYSTEM_HEALTH.cpuUsage}%`}
          color="amber"
          sublabel="Threshold: 80%"
        />
        <StatCard
          icon={HardDrive}
          label="Memory"
          value={`${SYSTEM_HEALTH.memoryUsage}%`}
          color="blue"
          sublabel="Threshold: 85%"
        />
        <StatCard
          icon={Database}
          label="DB Connections"
          value={`${SYSTEM_HEALTH.dbConnections}/100`}
          color="purple"
          sublabel="Pool: 100"
        />
      </div> */}
      {/* <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" /> API Endpoint Health
          </h3>
          <ExportButton
            data={API_ENDPOINTS}
            columns={[
              { key: "name", label: "Service" },
              { key: "endpoint", label: "Endpoint" },
              { key: "status", label: "Status" },
              { key: "responseTime", label: "Response" },
              { key: "uptime", label: "Uptime" },
              { key: "lastError", label: "Last Error" },
            ]}
            filename="api_health"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Service</th>
                <th className="px-4 py-2 font-medium">Endpoint</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium text-right">
                  Response Time
                </th>
                <th className="px-4 py-2 font-medium text-right">
                  Uptime
                </th>
                <th className="px-4 py-2 font-medium">Last Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {API_ENDPOINTS.map((api, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-4 py-2.5 font-medium">{api.name}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                    {api.endpoint}
                  </td>
                  <td className="px-4 py-2.5">
                    {statusBadge(api.status)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs">
                    {api.responseTime}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs">
                    {api.uptime}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">
                    {api.lastError}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceUsageChart data={chartData} xKey="name" />
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-3">
            Service Status
          </h3>
          <div className="space-y-2">
            {[
              {
                name: "SMS Gateway",
                status: SYSTEM_HEALTH.smsGateway,
                icon: Phone,
              },
              {
                name: "Email Service",
                status: SYSTEM_HEALTH.emailService,
                icon: Activity,
              },
              {
                name: "IVR Service",
                status: SYSTEM_HEALTH.ivrService,
                icon: PhoneCall,
              },
              {
                name: "Mobile App Sync",
                status: SYSTEM_HEALTH.mobileAppSync,
                icon: Wifi,
              },
              { name: "Geo-Tag Service", status: "Down", icon: MapPin },
              {
                name: "Analytics API",
                status: "Degraded",
                icon: BarChart3,
              },
            ].map((s, i) => {
              const SIcon = s.icon;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <SIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                  {statusBadge(s.status)}
                </div>
              );
            })}
          </div>
        </div>
      </div> */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-500" />{" "}
            {t("Infrastructure Details", "अवसंरचना विवरण")}
          </h3>
          {/* {systemStats?.time && (
            <span className="text-xs text-muted-foreground font-mono">
              Checked: {systemStats.time}
            </span>
          )} */}
        </div>
        <LoaderErrWrapper isLoading={isLoading} error={error}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {/* Portal Uptime Card */}
            <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full min-h-[160px] relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      {t("Portal Monitoring", "पोर्टल अपटाइम")}
                    </h4>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded inline-flex items-center gap-1 capitalize">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {t(
                        formatUnderscoreText(monitorData?.overallStatus),
                        formatUnderscoreText(monitorData?.overallStatus),
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-3xl font-extrabold text-foreground tracking-tight">
                    {Math.round(
                      ((monitorData?.upTargets || 0) /
                        (monitorData?.totalTargets || 1)) *
                        100,
                    )}
                    %
                  </span>
                  {monitorData?.checkedAt && (
                    <span
                      title={`${t("Last checked", "अंतिम जांच")}: ${moment(monitorData.checkedAt).format("DD MMM YYYY, hh:mm A")}`}
                      className="text-xs text-muted-foreground font-medium flex items-center gap-1 shrink-0"
                    >
                      <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                      <span>{formatTimeAgo(monitorData.checkedAt)}</span>
                    </span>
                  )}
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(monitorData?.upTargets || 0) / (monitorData?.totalTargets || 1) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Server Uptime Card */}
       

            {/* CPU Card */}
            <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full min-h-[160px] relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      {t("CPU Usage", "सीपीयू उपयोग")}
                    </h4>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {systemStats?.cpu?.cores}{" "}
                      {systemStats?.cpu?.cores === 1
                        ? t("Core", "कोर")
                        : t("Cores", "कोर्स")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-foreground tracking-tight">
                    {systemStats?.cpu?.usagePercentage?.toFixed(2) ?? "0.00"}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${systemStats?.cpu?.usagePercentage ?? 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Memory Card */}
            <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full min-h-[160px] relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      {t("Memory (RAM)", "मेमोरी (रैम)")}
                    </h4>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-mono mt-0.5 bg-purple-500/10 px-1.5 py-0.5 rounded">
                      {systemStats?.ram?.free?.toFixed(2) ?? "0.00"}{" "}
                      {t("GB free", "जीबी खाली")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-foreground tracking-tight">
                    {systemStats?.ram?.usagePercentage?.toFixed(2) ?? "0.00"}%
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {systemStats?.ram?.used?.toFixed(2) ?? "0.00"} /{" "}
                    {systemStats?.ram?.total?.toFixed(2) ?? "0.00"} GB
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${systemStats?.ram?.usagePercentage ?? 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Storage Card */}
            <div className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full min-h-[160px] relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      {t("Disk (Storage)", "डिस्क (स्टोरेज)")}
                    </h4>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono mt-0.5 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      {systemStats?.disk?.free?.toFixed(2) ?? "0.00"}{" "}
                      {t("GB free", "जीबी खाली")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-foreground tracking-tight">
                    {systemStats?.disk?.usagePercentage?.toFixed(2) ?? "0.00"}%
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {systemStats?.disk?.used?.toFixed(2) ?? "0.00"} /{" "}
                    {systemStats?.disk?.total?.toFixed(2) ?? "0.00"} GB
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${systemStats?.disk?.usagePercentage ?? 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </LoaderErrWrapper>
      </div>
      {/* <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Recent System Errors &amp; Alerts
          </h3>
        </div>
        <div className="divide-y divide-border">
          {[
            {
              time: "07 Jul, 08:42",
              severity: "Critical",
              service: "Geo-Tag Service API",
              message:
                "Service down - geolocation tagging unavailable for new complaints. Engineering team notified.",
              color: "text-red-600 bg-destructive/10",
            },
            {
              time: "06 Jul, 22:10",
              severity: "Warning",
              service: "Analytics API",
              message:
                "Response time degraded (1,820ms vs 200ms baseline). Investigating database query performance.",
              color: "text-amber-600 bg-amber-500/10",
            },
            {
              time: "06 Jul, 09:15",
              severity: "Warning",
              service: "Email Service API",
              message:
                "SMTP connection timeout - retrying. Some notification emails may be delayed.",
              color: "text-amber-600 bg-amber-500/10",
            },
            {
              time: "05 Jul, 18:30",
              severity: "Resolved",
              service: "File Upload API",
              message:
                "Storage tier temporarily unavailable - resolved after 12 minutes. No data loss.",
              color: "text-emerald-600 bg-emerald-500/10",
            },
            {
              time: "04 Jul, 11:05",
              severity: "Resolved",
              service: "AI Chatbot API",
              message:
                "LLM provider rate limit hit - request queue backed up for 8 minutes. Auto-scaled.",
              color: "text-emerald-600 bg-emerald-500/10",
            },
          ].map((err, i) => (
            <div key={i} className="px-5 py-3 flex items-start gap-3">
              <div
                className={`px-2 py-1 rounded text-[10px] font-bold ${err.color}`}
              >
                {err.severity}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {err.service}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {err.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {err.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
      <LoaderErrWrapper isLoading={monitorLoading} error={monitorError}>
        <MonitoringStatus services={monitorData?.services || []} />
      </LoaderErrWrapper>
    </div>
  );
}
