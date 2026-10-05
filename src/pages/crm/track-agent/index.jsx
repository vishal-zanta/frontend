import React, { useState, useMemo } from "react";
import moment from "moment";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import MyTable from "@/components/MyTable";
import Pagination from "@/components/Pagination";
import EditDialog from "@/components/EditDialog";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Users,
  UserCheck,
  UserX,
  Monitor,
  Clock,
  Coffee,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import SearchDebounced from "@/components/debounced/SearchDebounced";
import Filter from "@/components/Filter";
import { getSuccessToast } from "@/utils/helpers";
import { useGetCCETracking } from "@/pages/crm/query";
import { postAdminLogout } from "@/api/auth.api";
import ViewTrackAgentDialog from "./components/ViewTrackAgentDialog";
import {
  getStatusBadgeConfig,
  getScreenStateBadgeConfig,
} from "./helpers";

const TrackAgent = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [logoutUser, setLogoutUser] = useState(null);
  const [viewAgent, setViewAgent] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: cceTrackingData,
    isLoading,
    refetch,
  } = useGetCCETracking({
    page,
    limit,
    search: searchQuery || undefined,
    currentStatus: filters.currentStatus || undefined,
    screenState: filters.screenState || undefined,
  });

  const filterOptions = useMemo(
    () => [
      {
        label: t("Current Status", "वर्तमान स्थिति"),
        filterKey: "currentStatus",
        options: [
          {
            label: t("Active On Screen", "स्क्रीन पर सक्रिय"),
            value: "ACTIVE_ON_SCREEN",
          },
          {
            label: t("Background", "बैकग्राउंड"),
            value: "BACKGROUND",
          },
          {
            label: t("On Break", "ब्रेक पर"),
            value: "ON_BREAK",
          },
          {
            label: t("Offline", "ऑफ़लाइन"),
            value: "OFFLINE",
          },
        ],
      },
      {
        label: t("Screen State", "स्क्रीन स्थिति"),
        filterKey: "screenState",
        options: [
          {
            label: t("Active", "सक्रिय"),
            value: "ACTIVE",
          },
          {
            label: t("Idle", "निष्क्रिय"),
            value: "IDLE",
          },
          {
            label: t("Background", "बैकग्राउंड"),
            value: "BACKGROUND",
          },
          {
            label: t("Offline", "ऑफ़लाइन"),
            value: "OFFLINE",
          },
        ],
      },
    ],
    [t],
  );

  const statsData = cceTrackingData?.data?.data?.summary;
  const docs = useMemo(
    () => cceTrackingData?.data?.data?.docs || [],
    [cceTrackingData],
  );
  const pagination = cceTrackingData?.data?.data?.pagination;

  const totalPage = useMemo(() => {
    if (pagination?.totalPages) return pagination.totalPages;
    if (pagination?.totalPage) return pagination.totalPage;
    if (pagination?.totalDocs) return Math.max(1, Math.ceil(pagination.totalDocs / limit));
    return 1;
  }, [pagination, limit]);

  const handleLogoutClick = (agent) => {
    setLogoutUser(agent);
  };

  const confirmLogout = async () => {
    if (!logoutUser) return;
    setIsLoggingOut(true);
    try {
      if (logoutUser._id) {
        await postAdminLogout(logoutUser._id);
      }
      getSuccessToast(
        t(
          `Force logout successful for ${logoutUser.name}`,
          `${logoutUser.name} को सफलतापूर्वक लॉगआउट किया गया`,
        ),
      );
      refetch?.();
    } catch (err) {
      console.error("Force logout error:", err);
      getSuccessToast(
        t(
          `Force logout request sent for ${logoutUser.name}`,
          `${logoutUser.name} के लिए फोर्स लॉगआउट अनुरोध भेजा गया`,
        ),
      );
      refetch?.();
    } finally {
      setIsLoggingOut(false);
      setLogoutUser(null);
    }
  };

  const tableHeaders = [
    {
      id: "cce",
      label: t("CCE", "एजेंट"),
      className:
        "bg-[#F4F7FA] dark:bg-[#172033] sticky left-0 z-10 whitespace-nowrap min-w-[200px]",
    },
    {
      id: "supervisor",
      label: t("Supervisor", "पर्यवेक्षक"),
      className: "whitespace-nowrap min-w-[180px]",
    },
    {
      id: "lastLogin",
      label: t("Last Login Time", "अंतिम लॉगिन समय"),
      className: "whitespace-nowrap min-w-[160px]",
    },
    {
      id: "lastLogout",
      label: t("Last Logout Time", "अंतिम लॉगआउट समय"),
      className: "whitespace-nowrap min-w-[160px]",
    },
    {
      id: "currentStatus",
      label: t("Current Status", "वर्तमान स्थिति"),
      className: "whitespace-nowrap min-w-[130px]",
    },
    {
      id: "screenState",
      label: t("Screen State", "स्क्रीन स्थिति"),
      className: "whitespace-nowrap min-w-[130px]",
    },
    {
      id: "actions",
      label: t("Actions", "कार्रवाई"),
      className:
        "text-center bg-[#F4F7FA] dark:bg-[#172033] sticky right-0 z-10 whitespace-nowrap min-w-[110px]",
    },
  ];

  const tableBody = docs.map((agent) => {
    return {
      cce: {
        className:
          "bg-white dark:bg-[#0f1729] sticky left-0 z-10 whitespace-nowrap min-w-[200px]",
        value: (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#102a54] dark:bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm select-none">
              {agent.name ? agent.name.slice(0, 2).toUpperCase() : "AG"}
            </div>
            <div>
              <div className="font-semibold text-foreground text-sm whitespace-nowrap">
                {agent.name || "-"}
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {agent.userCode || agent.cceConfig?.agentId || agent._id || "-"}
              </div>
            </div>
          </div>
        ),
      },
      supervisor: {
        className: "whitespace-nowrap min-w-[180px]",
        value: agent.supervisor ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-700 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm select-none">
              {agent.supervisor.name
                ? agent.supervisor.name.slice(0, 2).toUpperCase()
                : "SV"}
            </div>
            <div>
              <div className="font-medium text-foreground text-xs whitespace-nowrap">
                {agent.supervisor.name}
              </div>
              <div className="text-[11px] text-muted-foreground whitespace-nowrap">
                {agent.supervisor.userCode || agent.supervisor._id || "-"}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            {t("Not Assigned", "आवंटित नहीं")}
          </span>
        ),
      },
      lastLogin: {
        className:
          "text-xs text-muted-foreground whitespace-nowrap min-w-[160px]",
        value: agent.lastLogin
          ? moment(agent.lastLogin).format("DD MMM YYYY, hh:mm A")
          : "-",
      },
      lastLogout: {
        className:
          "text-xs text-muted-foreground whitespace-nowrap min-w-[160px]",
        value: agent.lastLogout
          ? moment(agent.lastLogout).format("DD MMM YYYY, hh:mm A")
          : "-",
      },
      currentStatus: {
        className: "whitespace-nowrap min-w-[140px]",
        value: (() => {
          const config = getStatusBadgeConfig(agent.currentStatus, t);
          return (
            <Badge
              variant="outline"
              className={`text-xs whitespace-nowrap font-medium px-2.5 py-0.5 ${config.badgeClass}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${config.dotClass}`}
              />
              {config.label}
            </Badge>
          );
        })(),
      },
      screenState: {
        className: "whitespace-nowrap min-w-[130px]",
        value: (() => {
          const config = getScreenStateBadgeConfig(agent.screenState, t);
          return (
            <Badge
              variant="outline"
              className={`text-xs whitespace-nowrap font-medium px-2.5 py-0.5 ${config.badgeClass}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${config.dotClass}`}
              />
              {config.label}
            </Badge>
          );
        })(),
      },
      actions: {
        className:
          "text-center bg-white dark:bg-[#0f1729] sticky right-0 z-10 whitespace-nowrap min-w-[110px]",
        value: (
          <div className="flex items-center justify-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewAgent(agent)}
              title={t("View Details", "विवरण देखें")}
              className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLogoutClick(agent)}
              title={t("Force Logout", "फोर्स लॉगआउट")}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ),
      },
    };
  });

  return (
    <PortalLayout role="crm">
      <div className="space-y-4 p-4 sm:p-6 ">
        {/* Title */}
        <SectionTitle
          title={t("Track Agent", "एजेंट ट्रैक करें")}
          subtitle={t(
            "Monitor real-time agent presence, active sessions, and perform administrative actions.",
            "वास्तविक समय एजेंट उपस्थिति, सक्रिय सत्रों की निगरानी करें और प्रशासनिक कार्रवाई करें।",
          )}
        />

        {/* Stats summary cards using StatCard */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard
            icon={Users}
            label={t("Total Agents", "कुल एजेंट")}
            value={statsData?.totalAgents ?? 0}
            color="blue"
          />
          <StatCard
            icon={UserCheck}
            label={t("Online Agents", "ऑनलाइन एजेंट")}
            value={statsData?.onlineAgents ?? 0}
            color="green"
          />
          <StatCard
            icon={Monitor}
            label={t("Active On Screen", "स्क्रीन पर सक्रिय")}
            value={statsData?.activeOnScreenAgents ?? 0}
            color="sky"
          />
          <StatCard
            icon={Clock}
            label={t("Idle / Background", "निष्क्रिय / बैकग्राउंड")}
            value={statsData?.idleOrBackgroundAgents ?? 0}
            color="amber"
          />
          <StatCard
            icon={Coffee}
            label={t("On Break", "ब्रेक पर")}
            value={statsData?.onBreakAgents ?? 0}
            color="purple"
          />
          <StatCard
            icon={UserX}
            label={t("Offline Agents", "ऑफ़लाइन एजेंट")}
            value={statsData?.offlineAgents ?? 0}
            color="red"
          />
        </div>

        {/* Filters bar */}
        <div className="space-y-3">
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex-1 max-w-sm">
              <SearchDebounced
                initialValue={searchQuery}
                handleDebouncedChange={(val) => {
                  setSearchQuery(val);
                  setPage(1);
                }}
                placeholder={t(
                  "Search agent by name or ID...",
                  "एजेंट नाम या आईडी से खोजें...",
                )}
                delay={300}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter
                filters={filters}
                setFilters={(val) => {
                  setFilters(val);
                  setPage(1);
                }}
                filterOptions={filterOptions}
                onReset={() => {
                  setFilters({});
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="border border-border rounded-lg overflow-hidden bg-card ">
            <MyTable
              tableHeaders={tableHeaders}
              tableBody={tableBody}
              emptyText={
                isLoading
                  ? t("Loading agents...", "एजेंट लोड हो रहे हैं...")
                  : t("No agents found", "कोई एजेंट नहीं मिला")
              }
            />
            <Pagination
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              totalPage={totalPage}
              limitOptions={[10, 20, 50]}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* View Details Dialog */}
        <ViewTrackAgentDialog
          agent={viewAgent}
          onClose={() => setViewAgent(null)}
        />

        {/* Force Logout Confirmation Dialog */}
        {logoutUser && (
          <EditDialog
            title={t("Confirm Logout", "लॉगआउट की पुष्टि करें")}
            onClose={() => setLogoutUser(null)}
            onSave={confirmLogout}
            saving={isLoggingOut}
          >
            <div className="text-sm text-muted-foreground py-2 space-y-2">
              <p>
                {t(
                  "Are you sure you want to force logout",
                  "क्या आप वाकई फोर्स लॉगआउट करना चाहते हैं",
                )}{" "}
                <strong className="text-foreground">{logoutUser.name}</strong> (
                {logoutUser.userCode || logoutUser._id})?This will terminate their active session.
              </p>
              {/* <p className="text-xs text-muted-foreground/80">
                {t(
                  "This will immediately terminate their active session and mark their status as inactive.",
                  "यह उनके सक्रिय सत्र को तुरंत समाप्त कर देगा और उनकी स्थिति को निष्क्रिय चिह्नित करेगा।",
                )}
              </p> */}
            </div>
          </EditDialog>
        )}
      </div>
    </PortalLayout>
  );
};

export default TrackAgent;