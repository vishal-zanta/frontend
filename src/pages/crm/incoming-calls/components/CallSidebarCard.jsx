import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  PhoneOff,
  User,
  Pause,
  Play,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useCall } from "@/context/CallContext";
import CallTimer from "./CallTimer";

export default function CallSidebarCard({ className = "" }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const {
    callState,
    caller,
    activeCall,
    callDetails,
    isHold,
    toggleHold,
    answerCall,
    dropCall,
    isAnswering,
    isHolding,
    isUnholding,
    isDropping,
    hasActiveCall,
  } = useCall();

  // Only show sidebar card when there is an active/ringing call
  if (!hasActiveCall || callState === "idle" || callState === "ended") {
    return null;
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

  const safeCaller = caller || {
    name: t("Incoming Caller", "इनकमिंग कॉलर"),
    mobile: "N/A",
  };

  const isRinging = callState === "ringing";
  const isConnected = callState === "connected";

  return (
    <div
      className={`w-full rounded-xl p-3 text-white shadow-xl transition-all border border-white/20 ${
        isRinging
          ? "bg-gradient-to-br from-amber-600 to-orange-700 animate-pulse"
          : isHold
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
          ) : isHold ? (
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
              onClick={() => toggleHold()}
              disabled={isHolding || isUnholding}
              className={`flex-1 h-7 px-2 rounded flex items-center justify-center gap-1 text-xs font-medium transition-all ${
                isHold
                  ? "bg-amber-500 text-white"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
              title={isHold ? t("Resume", "पुनः शुरू") : t("Hold", "होल्ड")}
            >
              {isHolding || isUnholding ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : isHold ? (
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
