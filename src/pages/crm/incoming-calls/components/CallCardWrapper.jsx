import React from "react";
import { Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCall } from "@/context/CallContext";
import CallActiveCard from "./CallActiveCard";
import CallSidebarCard from "./CallSidebarCard";

export default function CallCardWrapper({
  variant = "full",
  className = "",
  isConsult = false,
  // Extended desktop props (for variant="full")
  showReroutePanel,
  setShowReroutePanel,
  showOutbound,
  setShowOutbound,
  rerouteTarget,
  onSimulateNewCall,
}) {
  const { t } = useLanguage();

  const {
    callState,
    caller,
    activeCall,
    callDetails,
    callDuration,
    isHold,
    toggleHold,
    isMuted,
    setIsMuted,
    isRecording,
    setIsRecording,
    answerCall,
    dropCall,
    isAnswering,
    hasActiveCall,
    isAvayaReady,
  } = useCall();

  // -------------------------------------------------------------
  // VARIANT 1: SIDEBAR (Compact bottom dock)
  // -------------------------------------------------------------
  if (variant === "sidebar") {
    return <CallSidebarCard className={className} isConsult={isConsult} />;
  }

  const handleAnswer = async () => {
    try {
      await answerCall();
    } catch (e) {
      console.error("Error answering call:", e);
    }
  };

  const handleDrop = async () => {
    try {
      await dropCall();
    } catch (e) {
      console.error("Error dropping call:", e);
    }
  };

  const timerStartTime =
    callDetails?.callStartTime ||
    activeCall?.createdAt ||
    caller?.createdAt;

  // -------------------------------------------------------------
  // VARIANT 2: FULL - IDLE / NO ACTIVE CALL
  // -------------------------------------------------------------
  if (!hasActiveCall || callState === "idle" || callState === "ended") {
    return (
      <div
        className={`rounded-2xl p-6 text-white bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 shadow-xl ${className}`}
      >
        {/* Top Header / Ready status */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isAvayaReady ? "bg-emerald-400 animate-pulse" : "bg-slate-400"
              }`}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
              {isAvayaReady
                ? t("Telephony Ready", "टेलीफोनी तैयार")
                : t("Telephony Standby", "टेलीफोनी स्टैंडबाय")}
            </span>
          </div>
        </div>

        {/* Center: No Active Call state */}
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center mb-4 text-white/60 border border-white/10 shadow-inner">
            <Phone className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {t("No Active Call", "कोई सक्रिय कॉल नहीं")}
          </h3>
          <p className="text-sm text-white/60 max-w-xs mx-auto">
            {isAvayaReady
              ? t(
                  "Waiting for incoming citizen calls...",
                  "इनकमिंग नागरिक कॉल की प्रतीक्षा कर रहे हैं..."
                )
              : t(
                  "Avaya telephony is not connected.",
                  "अवाया टेलीफोनी कनेक्टेड नहीं है।"
                )}
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VARIANT 2: FULL - ACTIVE CALL
  // -------------------------------------------------------------
  const safeCaller = caller || {
    name: t("Incoming Caller", "इनकमिंग कॉलर"),
    mobile: "N/A",
  };

  return (
    <CallActiveCard
      callState={callState}
      callDuration={callDuration}
      startTime={timerStartTime}
      caller={safeCaller}
      isHold={isHold}
      setIsHold={toggleHold}
      isConsult={isConsult}
      isMuted={isMuted}
      setIsMuted={setIsMuted}
      isRecording={isRecording}
      setIsRecording={setIsRecording}
      showReroutePanel={showReroutePanel}
      setShowReroutePanel={setShowReroutePanel}
      showOutbound={showOutbound}
      setShowOutbound={setShowOutbound}
      rerouteTarget={rerouteTarget}
      onAccept={handleAnswer}
      onEnd={handleDrop}
      onSimulateNewCall={onSimulateNewCall}
      isAcceptPending={isAnswering}
    />
  );
}
