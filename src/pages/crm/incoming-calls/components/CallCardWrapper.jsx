import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone,
  PhoneOff,
  User,
  Pause,
  Play,
  Mic,
  MicOff,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useCall } from "@/context/CallContext";
import { formatDurationMMSS } from "../helpers";
import CallActiveCard from "./CallActiveCard";
import CallTimer from "./CallTimer";

export default function CallCardWrapper({
  variant = "full",
  className = "",
  // Extended desktop props (for variant="full")
  showReroutePanel,
  setShowReroutePanel,
  showOutbound,
  setShowOutbound,
  rerouteTarget,
  onSimulateNewCall,
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const {
    callState,
    caller,
    activeCall,
    callDetails,
    callDuration,
    isHold: contextIsHold,
    answerCall,
    holdCall,
    unholdCall,
    dropCall,
    isAnswering,
    isHolding,
    isUnholding,
    isDropping,
    hasActiveCall,
    isAvayaReady,
    extension,
    agentId,
    unifiedStatus,
  } = useCall();

  // Local audio toggles
  const [isHold, setIsHold] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(true);

  const effectiveHold = contextIsHold || isHold;

  const handleAnswer = async () => {
    try {
      await answerCall();
    } catch (e) {
      console.error("Error answering call:", e);
    }
  };

  const handleToggleHold = async () => {
    const nextHold = !effectiveHold;
    setIsHold(nextHold);
    try {
      if (nextHold) {
        await holdCall();
      } else {
        await unholdCall();
      }
    } catch (e) {
      console.error("Error toggling hold:", e);
    }
  };

  const handleDrop = async () => {
    try {
      await dropCall();
    } catch (e) {
      console.error("Error dropping call:", e);
    }
  };

  // Extract timing details from /telephony/call/details API response or activeCall fallback
  const actualDetails = callDetails?.data || callDetails;
  const timerStartTime =
    actualDetails?.answerTimeISO ||
    actualDetails?.answerTime ||
    actualDetails?.ringTimeISO ||
    actualDetails?.ringTime ||
    activeCall?.createdAt ||
    caller?.createdAt;

  const initialDurationSeconds = actualDetails?.currentDurationSeconds;
  const initialDuration = actualDetails?.currentDuration;

  // -------------------------------------------------------------
  // VARIANT 1: SIDEBAR (Compact bottom dock)
  // -------------------------------------------------------------
  if (variant === "sidebar") {
    // Only show sidebar card when there is an active/ringing call
    if (!hasActiveCall || callState === "idle" || callState === "ended") {
      return null;
    }

    const safeCaller = caller || {
      name: t("Incoming Caller", "इनकमिंग कॉलर"),
      mobile: "N/A",
      callType: "Inbound",
    };

    const isRinging = callState === "ringing";
    const isConnected = callState === "connected";

    return (
      <div
        className={`w-full rounded-xl p-3 text-white shadow-xl transition-all border border-white/20 ${
          isRinging
            ? "bg-gradient-to-br from-amber-600 to-orange-700 animate-pulse"
            : effectiveHold
              ? "bg-gradient-to-br from-amber-700 to-stone-800"
              : "bg-gradient-to-br from-blue-900 to-slate-900"
        } ${className}`}
      >
        {/* Header: Status, Timer & Maximize Link */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/15">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            {isRinging ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                <span className="text-[11px] uppercase tracking-wider text-amber-200">
                  {t("Ringing", "घंटी बज रही")}
                </span>
              </>
            ) : effectiveHold ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[11px] uppercase tracking-wider text-amber-300">
                  {t("On Hold", "होल्ड पर")}
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <CallTimer
                  startTime={timerStartTime}
                  initialDurationSeconds={initialDurationSeconds}
                  fallbackText={initialDuration || "00:00"}
                  className="text-[11px] font-mono text-emerald-300"
                />
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/crm/incoming-call")}
            className="p-1 hover:bg-white/20 rounded transition-colors text-white/80 hover:text-white"
            title={t("Open Desktop Call Screen", "डेस्कटॉप कॉल स्क्रीन खोलें")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Caller Info */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold truncate text-white">
              {safeCaller.name}
            </div>
            <div className="text-[10px] text-white/70 font-mono truncate">
              {safeCaller.mobile}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 justify-between">
          {isRinging && (
            <>
              <Button
                type="button"
                size="sm"
                onClick={handleAnswer}
                disabled={isAnswering}
                className="flex-1 h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
              >
                {isAnswering ? (
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                ) : (
                  <Phone className="w-3 h-3 mr-1" />
                )}
                {t("Answer", "उत्तर दें")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleDrop}
                disabled={isDropping}
                className="h-7 px-2.5 text-xs"
                title={t("Decline", "अस्वीकार")}
              >
                {isDropping ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <PhoneOff className="w-3 h-3" />
                )}
              </Button>
            </>
          )}

          {isConnected && (
            <>
              <button
                type="button"
                onClick={handleToggleHold}
                disabled={isHolding || isUnholding}
                className={`flex-1 h-7 px-2 rounded flex items-center justify-center gap-1 text-xs font-medium transition-all ${
                  effectiveHold
                    ? "bg-amber-500 text-white"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}
                title={effectiveHold ? t("Resume", "पुनः शुरू") : t("Hold", "होल्ड")}
              >
                {isHolding || isUnholding ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : effectiveHold ? (
                  <>
                    <Play className="w-3 h-3" />
                    <span>{t("Resume", "शुरू")}</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>{t("Hold", "होल्ड")}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`w-7 h-7 rounded flex items-center justify-center text-xs transition-all ${
                  isMuted
                    ? "bg-red-500 text-white"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}
                title={isMuted ? t("Unmute", "अनम्यूट") : t("Mute", "म्यूट")}
              >
                {isMuted ? (
                  <MicOff className="w-3.5 h-3.5" />
                ) : (
                  <Mic className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={handleDrop}
                disabled={isDropping}
                className="w-7 h-7 rounded bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all disabled:opacity-50"
                title={t("End Call", "कॉल समाप्त करें")}
              >
                {isDropping ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <PhoneOff className="w-3.5 h-3.5" />
                )}
              </button>
            </>
          )}

          {callState === "ended" && (
            <div className="w-full text-center py-1 text-xs text-white/80">
              {t("Call Ended", "कॉल समाप्त")}
            </div>
          )}
        </div>
      </div>
    );
  }

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
          {extension && (
            <span className="text-xs text-white/60 font-mono">
              {t("Ext", "एक्सटेंशन")}: {extension}
            </span>
          )}
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

        {/* Footer info (no action buttons) */}
        {/* <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <span>
            {t("Agent ID", "एजेंट आईडी")}: {agentId || "—"}
          </span>
          <span>
            {unifiedStatus
              ? `${t("Status", "स्थिति")}: ${unifiedStatus}`
              : t("Idle", "निष्क्रिय")}
          </span>
        </div> */}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VARIANT 2: FULL - ACTIVE CALL
  // -------------------------------------------------------------
  const safeCaller = caller || {
    name: t("Incoming Caller", "इनकमिंग कॉलर"),
    mobile: "N/A",
    callType: "Inbound",
    previousCalls: [],
  };

  return (
    <CallActiveCard
      callState={callState}
      callDuration={callDuration}
      startTime={timerStartTime}
      initialDurationSeconds={initialDurationSeconds}
      initialDuration={initialDuration}
      caller={safeCaller}
      isHold={effectiveHold}
      setIsHold={handleToggleHold}
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
