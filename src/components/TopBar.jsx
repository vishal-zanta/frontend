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
  Loader2,
  Sun,
  Moon,
} from "lucide-react";
import { PORTAL_META } from "@/lib/biharData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBreakStatus, postToggleBreak, postPulse } from "@/api/breaks.api";
import { getErrorToast } from "@/utils/helpers";
import BreakOverlay from "./break-timer/BreakOverlay";
import { postLogout } from "@/api/auth.api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import SearchComplaints from "@/components/SearchComplaints";
import { LangSelectorSmall } from "@/components/LangSelector";

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
  const {
    profile: profileData,
    setProfile: setProfileData,
    profiledata: profileMetaData,
  } = useAuth();
  const { t } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isSuperAdmin = profileMetaData?.isAdmin;
  const isCRM = profileMetaData?.isCRM;
  const isOfficer = profileMetaData?.isOfficer;
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const switcherRef = useRef(null);

  const notifications = STAFF_NOTIFICATIONS;

  const { data: breakStatusData, refetch: refetchBreakStatus } = useQuery({
    queryKey: ["breakStatus"],
    queryFn: getBreakStatus,
    enabled: true,
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
  }, [breakStatus?.isBreak]);

  const portalLabel = profileMetaData?.isAdmin
    ? t("Super Admin Console", "सुपर एडमिन कंसोल")
    : profileMetaData?.isCRM
      ? t("CRM / Call Centre", "सीआरएम / कॉल सेंटर")
      : t("Officer Portal", "अधिकारी पोर्टल");

  const settingsPath = profileMetaData?.isAdmin
    ? "/admin/settings"
    : profileMetaData?.isCRM
      // ? "/crm/settings"
      ? null
      : null;

      // : "/officer/settings";

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
  const qc = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      localStorage.removeItem("usertoken");
      sessionStorage.removeItem("usertoken");
      // localStorage.removeItem("off-lang");
      // localStorage.removeItem("cce-lang");


      setProfileData(null);
      qc.removeQueries();
      navigate("/");
    },
    onError: (err) => {
      console.error("Logout API failed:", err);
      // Revert/proceed on failure to avoid blocking users
      localStorage.removeItem("usertoken");
      sessionStorage.removeItem("usertoken");
      //     localStorage.removeItem("off-lang");
      // localStorage.removeItem("cce-lang");
      setProfileData(null);
      qc.removeQueries();
      navigate("/");
    },
  });

  const handleLogout = () => {
    setProfileData(null);
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
    <header className="h-14 bg-background border-b border-border flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          title={
            sidebarOpen
              ? t("Collapse sidebar", "साइडबार छोटा करें")
              : t("Expand sidebar", "साइडबार बढ़ाएं")
          }
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <div className="text-[11px] text-muted-foreground font-medium">
            {portalLabel}
          </div>
          <div className="text-sm font-bold text-foreground -mt-0.5 hidden sm:block">
            {t(PORTAL_META.name, "बिहार ई-शिकायत पोर्टल")}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
      <SearchComplaints/>

        {/* Profile switcher for officer and CRM */}
        {/* {profiles && (
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
        )} */}

        {/* Language Selector */}
     {  <LangSelectorSmall className="shrink-0" />}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

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
              <div className="absolute right-0 top-12 w-80 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50">
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
                      className="px-4 py-3 border-b border-border last:border-0 hover:bg-muted flex items-start gap-3"
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

        <button
          onClick={() => toggleBreakMutation.mutate()}
          disabled={toggleBreakMutation.isPending}
          className="px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          {toggleBreakMutation.isPending && (
            <Loader2 className="w-3 h-3 animate-spin" />
          )}
          {t("Start Break", "ब्रेक शुरू करें")}
        </button>

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
              {profileData?.name?.slice(0, 2)?.toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-foreground leading-tight">
                {profileData?.name}
              </div>
              <div className="text-[11px] text-muted-foreground leading-tight">
                {t(
                  profileData?.role?.designationEnglish ?? profileData?.role,
                  profileData?.role?.designationHindi ??
                    (profileData?.role?.designationEnglish ||
                      profileData?.role),
                )}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-12 w-56 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-border">
                <div className="font-semibold text-sm">
                  {" "}
                  {profileData?.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t(
                    profileData?.role?.designationEnglish ?? profileData?.role,
                    profileData?.role?.designationHindi ??
                      (profileData?.role?.designationEnglish ||
                        profileData?.role),
                  )}
                </div>
              </div>
              {settingsPath && (
                <Link
                  to={settingsPath}
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />{" "}
                  {t("Settings", "सेटिंग्स")}
                </Link>
              )}
              {isSuperAdmin && (
                <Link
                  to="/admin/users"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted"
                >
                  <Shield className="w-4 h-4 text-muted-foreground" />{" "}
                  {t("Manage Access", "पहुंच प्रबंधित करें")}
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
                {logoutMutation.isPending
                  ? t("Logging out...", "लॉग आउट हो रहा है...")
                  : t("Logout", "लॉगआउट")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
