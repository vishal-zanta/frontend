import React, { useState, useMemo } from "react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import MyTable from "@/components/MyTable";
import Pagination from "@/components/Pagination";
import EditDialog from "@/components/EditDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, UserCheck, UserX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import SearchDebounced from "@/components/debounced/SearchDebounced";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSuccessToast } from "@/utils/helpers";

const INITIAL_DUMMY_AGENTS = [
  {
    id: "1",
    name: "new CCE",
    loginId: "CCE2",
    initials: "nC",
    lastLogin: "03 Oct 2026, 09:15 AM",
    lastLogout: "-",
    isActive: true,
  },
  {
    id: "2",
    name: "jane",
    loginId: "CCE",
    initials: "j",
    lastLogin: "03 Oct 2026, 08:30 AM",
    lastLogout: "-",
    isActive: true,
  },
  {
    id: "3",
    name: "officer+CCE",
    loginId: "QWERTY",
    initials: "o",
    lastLogin: "02 Oct 2026, 05:45 PM",
    lastLogout: "02 Oct 2026, 08:30 PM",
    isActive: false,
  },
];

const TrackAgent = () => {
  const { t } = useLanguage();
  const [agents, setAgents] = useState(INITIAL_DUMMY_AGENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [logoutUser, setLogoutUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        agent.name.toLowerCase().includes(q) ||
        agent.loginId.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && agent.isActive) ||
        (statusFilter === "inactive" && !agent.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [agents, searchQuery, statusFilter]);

  const totalPage = Math.max(1, Math.ceil(filteredAgents.length / limit));
  const paginatedAgents = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredAgents.slice(start, start + limit);
  }, [filteredAgents, page, limit]);

  const activeCount = agents.filter((a) => a.isActive).length;
  const inactiveCount = agents.length - activeCount;

  const handleLogoutClick = (user) => {
    setLogoutUser(user);
  };

  const confirmLogout = () => {
    if (!logoutUser) return;
    setIsLoggingOut(true);
    setTimeout(() => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const formattedTime = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const logoutTimestamp = `${formattedDate}, ${formattedTime}`;

      setAgents((prev) =>
        prev.map((a) =>
          a.id === logoutUser.id
            ? {
                ...a,
                isActive: false,
                lastLogout: logoutTimestamp,
              }
            : a,
        ),
      );

      getSuccessToast(
        t(
          `Force logout successful for ${logoutUser.name}`,
          `${logoutUser.name} को सफलतापूर्वक लॉगआउट किया गया`,
        ),
      );
      setIsLoggingOut(false);
      setLogoutUser(null);
    }, 350);
  };


  const tableHeaders = [
    {
      id: "user",
      label: t("User", "उपयोगकर्ता"),
      className:
        "bg-[#F4F7FA] dark:bg-[#172033] sticky left-0 z-10 whitespace-nowrap min-w-[200px]",
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
      id: "status",
      label: t("Status", "स्थिति"),
      className: "whitespace-nowrap min-w-[120px]",
    },
    {
      id: "actions",
      label: t("Actions", "कार्रवाई"),
      className:
        "text-center bg-[#F4F7FA] dark:bg-[#172033] sticky right-0 z-10 whitespace-nowrap min-w-[100px]",
    },
  ];

  const tableBody = paginatedAgents.map((agent) => {
    return {
      user: {
        className:
          "bg-white dark:bg-[#0f1729] sticky left-0 z-10 whitespace-nowrap min-w-[200px]",
        value: (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#102a54] dark:bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm select-none">
              {agent.initials || agent.name.slice(0, 2)}
            </div>
            <div>
              <div className="font-semibold text-foreground text-sm whitespace-nowrap">
                {agent.name}
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {agent.loginId}
              </div>
            </div>
          </div>
        ),
      },
      lastLogin: {
        className:
          "text-xs text-muted-foreground whitespace-nowrap min-w-[160px]",
        value: agent.lastLogin || "-",
      },
      lastLogout: {
        className:
          "text-xs text-muted-foreground whitespace-nowrap min-w-[160px]",
        value: agent.lastLogout || "-",
      },
      status: {
        className: "whitespace-nowrap min-w-[120px]",
        value: (
          <Badge
            variant="outline"
            className={`text-xs capitalize whitespace-nowrap font-medium px-2.5 py-0.5 ${
              agent.isActive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${
                agent.isActive ? "bg-emerald-500" : "bg-destructive"
              }`}
            />
            {agent.isActive
              ? t("Active", "सक्रिय")
              : t("Inactive", "निष्क्रिय")}
          </Badge>
        ),
      },
      actions: {
        className:
          "text-center bg-white dark:bg-[#0f1729] sticky right-0 z-10 whitespace-nowrap min-w-[100px]",
        value: (
          <div className="flex items-center justify-center">
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

        {/* Stats summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">
                {t("Total Agents", "कुल एजेंट")}
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {agents.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">
                {t("Active Agents", "सक्रिय एजेंट")}
              </p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {activeCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">
                {t("Inactive Agents", "निष्क्रिय एजेंट")}
              </p>
              <h3 className="text-2xl font-bold text-muted-foreground mt-1">
                {inactiveCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className=" space-y-3">
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex-1 max-w-sm">
              <SearchDebounced
                initialValue={searchQuery}
                handleDebouncedChange={setSearchQuery}
                placeholder={t(
                  "Search agent by name or ID...",
                  "एजेंट नाम या आईडी से खोजें...",
                )}
                delay={300}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder={t("All Status", "सभी स्थिति")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Status", "सभी स्थिति")}</SelectItem>
                  <SelectItem value="active">{t("Active", "सक्रिय")}</SelectItem>
                  <SelectItem value="inactive">{t("Inactive", "निष्क्रिय")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table Container */}
          <div className="border border-border rounded-lg overflow-hidden bg-card ">
            <MyTable
              tableHeaders={tableHeaders}
              tableBody={tableBody}
              emptyText={t("No agents found", "कोई एजेंट नहीं मिला")}
            />
            <Pagination
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              totalPage={totalPage}
              limitOptions={[10, 20, 50]}
            />
          </div>
        </div>

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
                {t("Are you sure you want to force logout", "क्या आप वाकई फोर्स लॉगआउट करना चाहते हैं")}{" "}
                <strong className="text-foreground">{logoutUser.name}</strong> ({logoutUser.loginId})?
              </p>
              <p className="text-xs text-muted-foreground/80">
                {t(
                  "This will immediately terminate their active session and mark their status as inactive.",
                  "यह उनके सक्रिय सत्र को तुरंत समाप्त कर देगा और उनकी स्थिति को निष्क्रिय चिह्नित करेगा।",
                )}
              </p>
            </div>
          </EditDialog>
        )}
      </div>
    </PortalLayout>
  );
};

export default TrackAgent;