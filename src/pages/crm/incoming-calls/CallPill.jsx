import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PhoneCall } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCall } from "@/context/CallContext";
import { PERMISSIONS } from "@/utils/constants";

export default function CallPill({ sidebarOpen = false }) {
  const { caller, isRinging, hasActiveCall, stopRingtone } = useCall();
  const { hasPermission } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const hasChat = hasPermission(PERMISSIONS.CHAT);
  const isOnIncomingPage = location.pathname === "/crm/incoming-call";

  // When sidebar is open on desktop (>=1024px), the sidebar card is visible so hide CallPill.
  // Show CallPill only when sidebar is collapsed (or mobile view) and there is an active call.
  const isDesktopSidebarOpen =
    sidebarOpen &&
    (typeof window !== "undefined" ? window.innerWidth >= 1024 : false);

  if (!hasActiveCall || isOnIncomingPage || isDesktopSidebarOpen) {
    return null;
  }

  const callerName = caller?.name || t("Incoming Caller", "इनकमिंग कॉलर");
  const callerNumber = caller?.mobile;

  const handleClick = () => {
    stopRingtone();
    navigate("/crm/incoming-call");
  };

  return (
    <div
      className={`fixed bottom-5 z-[9999] transition-all duration-300 ${
        hasChat ? "right-20 sm:right-24" : "right-5"
      }`}
    >
      <button
        type="button"
        onClick={handleClick}
        className="relative group flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-2xl shadow-emerald-700/40 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/30 cursor-pointer"
        title={t(
          "Click to open incoming call",
          "इनकमिंग कॉलर खोलने के लिए क्लिक करें",
        )}
      >
        {/* Glowing pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-60 animate-ping pointer-events-none" />

        {/* Ringing Phone Icon */}
        <div className="relative w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
          <PhoneCall
            className={`w-5 h-5 text-white ${isRinging ? "animate-bounce" : ""}`}
          />
          <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
        </div>

        {/* Caller Info */}
        <div className="text-left text-xs font-semibold leading-tight pr-1">
          <div className="flex items-center gap-1.5 text-white">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="uppercase tracking-wider text-[10px] font-bold">
              {isRinging
                ? t("Incoming Call", "प्राप्त कॉल")
                : t("Active Call", "सक्रिय कॉल")}
            </span>
          </div>
          <div className="text-sm font-bold text-white max-w-[140px] truncate mt-0.5">
            {callerName}
          </div>
          {callerNumber && callerNumber !== callerName && (
            <div className="text-[11px] text-white/80 font-mono">
              {callerNumber}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
