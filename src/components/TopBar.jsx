import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Bell,
  Menu,
  LogOut,
  Settings,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Shield,
  Repeat,
  Loader2,
} from "lucide-react";
import { PORTAL_META } from "@/lib/biharData";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getBreakStatus, postToggleBreak, postPulse } from "@/api/breaks.api";
import { getErrorToast } from "@/utils/helpers";
import BreakOverlay from "./break-timer/BreakOverlay";
import { postLogout } from "@/api/auth.api";
import { useAuth } from "@/context/AuthContext";

const roleInfo = {
  superadmin: {
    label: "Super Admin Console",
    user: "Ramanuj Prasad",
    title: "SUDA Administrator",
    avatar: "RP",
    settingsPath: "/admin/users",
  },
  officer: {
    label: "Officer Portal",
    user: "Rajesh Kumar Singh",
    title: "L1 Field Officer - Patna",
    avatar: "RS",
    settingsPath: "/officer/settings",
  },
  crm: {
    label: "CRM / Call Centre",
    user: "Priya Sharma",
    title: "CCE Agent - Morning Shift",
    avatar: "PS",
    settingsPath: "/crm/settings",
  },
  citizen: {
    label: "Citizen Portal",
    user: "Ramesh Prasad",
    title: "Citizen - Patna",
    avatar: "RP",
    settingsPath: "/citizen/settings",
  },
};

const officerProfiles = [
  {
    id: "l1",
    label: "L1 Field Officer",
    user: "Rajesh Kumar Singh",
    title: "L1 Field Officer - Patna",
    avatar: "RS",
  },
  {
    id: "l2",
    label: "L2 Supervisory Officer",
    user: "Prakash Jha",
    title: "L2 Supervisory Officer - Patna",
    avatar: "PJ",
  },
  {
    id: "zone",
    label: "Zone Administrator",
    user: "Vikash Prasad",
    title: "Zone Administrator - Patna",
    avatar: "VP",
  },
  {
    id: "division",
    label: "Divisional Administrator",
    user: "Vikash Prasad",
    title: "Divisional Administrator - Patna",
    avatar: "VP",
  },
  {
    id: "suda",
    label: "SUDA Administrator",
    user: "Ramanuj Prasad",
    title: "SUDA Administrator - Patna",
    avatar: "RP",
  },
];

const crmProfiles = [
  {
    id: "agent",
    label: "CCE Agent",
    user: "Priya Sharma",
    title: "CCE Agent - Morning Shift",
    avatar: "PS",
  },
  {
    id: "supervisor",
    label: "CC Supervisor",
    user: "Sneha Gupta",
    title: "CC Supervisor - Full Day",
    avatar: "SG",
  },
];

const CITIZEN_NOTIFICATIONS = [
  {
    id: 1,
    text: "Your complaint BH-2026-047821 has been resolved ✅",
    time: "2h ago",
    type: "success",
  },
  {
    id: 2,
    text: "Your complaint BH-2026-047823 was escalated to L2 ⚠️",
    time: "5h ago",
    type: "warning",
  },
  {
    id: 3,
    text: "New service available: Animal Rescue 🐕",
    time: "1d ago",
    type: "info",
  },
  {
    id: 4,
    text: "Officer assigned to your complaint BH-2026-047825",
    time: "2d ago",
    type: "info",
  },
];

const STAFF_NOTIFICATIONS = [
  {
    id: 1,
    text: "3 new complaints assigned to your ward",
    time: "10m ago",
    type: "info",
  },
  {
    id: 2,
    text: "SLA breach warning: 2 complaints approaching deadline",
    time: "30m ago",
    type: "warning",
  },
  {
    id: 3,
    text: "Shift change reminder: Handover at 2:00 PM",
    time: "1h ago",
    type: "info",
  },
];

export default function TopBar({
  role = "superadmin",
  profile,
  onProfileChange,
  onToggleSidebar,
  sidebarOpen,
}) {
  const {profile: profileData} = useAuth();
  const baseInfo = roleInfo[role] || roleInfo.superadmin;
  const navigate = useNavigate();
  const isCitizen = role === "citizen";
  const isSuperAdmin = role === "superadmin";
  const isOfficer = role === "officer";
  const isCRM = role === "crm";
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const switcherRef = useRef(null);

  const notifications = isCitizen ? CITIZEN_NOTIFICATIONS : STAFF_NOTIFICATIONS;

  const { data: breakStatusData, refetch: refetchBreakStatus } = useQuery({
    queryKey: ["breakStatus"],
    queryFn: getBreakStatus,
    enabled: !isCitizen,
  });

  const breakStatus = breakStatusData?.data?.data || breakStatusData?.data;
  const activeBreak = breakStatusData?.data?.data?.activeBreak;

  const toggleBreakMutation = useMutation({
    mutationFn: postToggleBreak,
    onSuccess: () => {
      refetchBreakStatus();
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const pulseMutation = useMutation({
    mutationFn: postPulse,
  });

  useEffect(() => {

    let timer = null;
    if (breakStatus && breakStatus.isBreak === false) {
              if (document.visibilityState === "visible") {
          pulseMutation.mutate();
        }
      timer = setInterval(() => {
        if (document.visibilityState === "visible") {
          pulseMutation.mutate();
        }
      }, 50000);
    }
    return () => clearInterval(timer);
  }, [breakStatus?.isBreak, isCitizen]);

  // Determine current sub-profile from props (passed by PortalLayout)
  let profiles = null;
  let currentProfileId = profile || "default";
  if (isOfficer) {
    profiles = officerProfiles;
    if (!currentProfileId || currentProfileId === "default")
      currentProfileId = "l1";
  } else if (isCRM) {
    profiles = crmProfiles;
    if (!currentProfileId || currentProfileId === "default")
      currentProfileId = "agent";
  }
  const currentProfile = profiles
    ? profiles.find((p) => p.id === currentProfileId) || profiles[0]
    : null;
  const info = currentProfile ? { ...baseInfo, ...currentProfile } : baseInfo;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
      if (switcherRef.current && !switcherRef.current.contains(e.target))
        setShowSwitcher(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logoutMutation = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      localStorage.removeItem("usertoken");
      sessionStorage.removeItem("usertoken");
      navigate("/");
    },
    onError: (err) => {
      console.error("Logout API failed:", err);
      // Revert/proceed on failure to avoid blocking users
      localStorage.removeItem("usertoken");
      sessionStorage.removeItem("usertoken");
      navigate("/");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleSwitchProfile = (profileId) => {
    setShowSwitcher(false);
    setShowProfile(false);
    if (onProfileChange) onProfileChange(profileId);
    // Navigate to the dashboard - no query param needed, profile is in localStorage
    navigate(`/${role}`);
  };

  const notifIcon = (type) => {
    if (type === "success")
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (type === "warning")
      return <AlertCircle className="w-4 h-4 text-amber-500" />;
    return <Info className="w-4 h-4 text-blue-500" />;
  };

  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <div className="text-[11px] text-muted-foreground font-medium">
            {info.label}
          </div>
          <div className="text-sm font-bold text-foreground -mt-0.5 hidden sm:block">
            {PORTAL_META.name}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isCitizen && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-muted-foreground">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search complaints, officers..."
              className="bg-transparent text-sm w-40 lg:w-56 outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        )}

        {/* Profile switcher for officer and CRM */}
        {profiles && (
          <div className="relative" ref={switcherRef}>
            <button
              onClick={() => setShowSwitcher(!showSwitcher)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-primary bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{currentProfile.label}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showSwitcher && (
              <div className="absolute right-0 top-11 w-64 bg-white border border-border rounded-xl shadow-xl overflow-hidden z-50">
                <div className="px-4 py-2.5 border-b border-border bg-muted/50">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Switch Profile View
                  </span>
                </div>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSwitchProfile(p.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors ${p.id === currentProfileId ? "bg-blue-50" : ""}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[10px] font-bold">
                      {p.avatar}
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">{p.label}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {p.user}
                      </div>
                    </div>
                    {p.id === currentProfileId && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {!isSuperAdmin && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-border rounded-xl shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="font-semibold text-sm">Notifications</span>
                  <button
                    onClick={() => setShowNotifs(false)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 flex items-start gap-3"
                    >
                      <div className="mt-0.5">{notifIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{n.text}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!isCitizen && (
          <button
            onClick={() => toggleBreakMutation.mutate()}
            disabled={toggleBreakMutation.isPending}
            className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {toggleBreakMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
            Start Break
          </button>
        )}

        {/* <Link
          to="/"
          className="px-3 py-1.5 text-xs font-medium text-primary bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          Switch Portal
        </Link> */}

        {breakStatus?.isBreak && (
          <BreakOverlay
            // breakStartedAt={breakStatus?.breakStartedAt}
            onEndBreak={() => toggleBreakMutation.mutate()}
            isEnding={toggleBreakMutation.isPending}
            activeBreak={activeBreak}
          />
        )}

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-3 border-l border-border"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
              {profileData?.name?.slice(0,2)?.toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-foreground leading-tight">
                {profileData?.name}
              </div>
              <div className="text-[11px] text-muted-foreground leading-tight">
                {profileData?.role?.designationEnglish ?? profileData?.role}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-12 w-56 bg-white border border-border rounded-xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-border">
                <div className="font-semibold text-sm"> {profileData?.name}</div>
                <div className="text-xs text-muted-foreground">
                                {profileData?.role?.designationEnglish ?? profileData?.role}

                </div>
              </div>
              {info.settingsPath && (
                <Link
                  to={info.settingsPath}
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />{" "}
                  Settings
                </Link>
              )}
              {isSuperAdmin && (
                <Link
                  to="/admin/users"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted"
                >
                  <Shield className="w-4 h-4 text-muted-foreground" /> Manage
                  Access
                </Link>
              )}
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 border-t border-border disabled:opacity-50"
              >
                {logoutMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
