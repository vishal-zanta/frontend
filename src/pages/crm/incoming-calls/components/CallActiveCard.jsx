import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  PhoneOff,
  User,
  AlertTriangle,
  PhoneForwarded,
  Pause,
  Play,
  Mic,
  MicOff,
  PhoneOutgoing,
  FileText,
  Circle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { formatDuration } from "../constants";
import CallTimer from "./CallTimer";

const getGradientClass = (callState) => {
  switch (callState) {
    case "ringing":
      return "bg-gradient-to-br from-amber-500 to-orange-600";
    case "connected":
      return "bg-gradient-to-br from-blue-900 to-blue-600";
    case "rerouting":
      return "bg-gradient-to-br from-purple-600 to-indigo-600";
    default:
      return "bg-gradient-to-br from-slate-500 to-slate-700";
  }
};

export default function CallActiveCard({
  callState,
  callDuration,
  startTime,
  caller,
  isHold,
  setIsHold,
  isMuted,
  setIsMuted,
  isRecording,
  setIsRecording,
  showReroutePanel,
  setShowReroutePanel,
  showOutbound,
  setShowOutbound,
  rerouteTarget,
  onAccept,
  onEnd,
  onSimulateNewCall,
  isAcceptPending = false,
}) {
  const { t } = useLanguage();

  return (
    <div className={`rounded-2xl p-6 text-white ${getGradientClass(callState)}`}>
      {/* Caller info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <div>
          <div className="text-lg font-bold">{caller.name}</div>
          <div className="text-sm text-white/80">{caller.mobile}</div>
        </div>
      </div>

      {/* Recording indicator (commented out for now)
      {callState === "connected" && isRecording && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-red-500/90 px-2.5 py-1 rounded-full text-xs font-medium">
            <Circle className="w-2.5 h-2.5 fill-white animate-pulse" /> REC
          </div>
          <span className="text-xs text-white/70">
            {t("Call recording in progress", "कॉल रिकॉर्डिंग प्रगति पर है")}
          </span>
          <button
            onClick={() => setIsRecording(false)}
            className="ml-auto text-xs text-white/60 hover:text-white underline"
          >
            {t("Stop", "रोकें")}
          </button>
        </div>
      )}
      */}

      {/* Repeat caller alert */}
      {/* <div className="bg-white/10 rounded-xl p-3 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
        <div className="text-sm">
          <div className="font-semibold">
            {t("Repeat Caller", "पुनरावृत्ति कॉलर")} - {previousCallsCount}{" "}
            {t("previous calls", "पिछली कॉल")}
          </div>
          <div className="text-white/70 text-xs">
            {t("Citizen has called", "नागरिक ने कॉल किया है")} {previousCallsCount}{" "}
            {t("times about the same issue", "बार इसी मुद्दे पर")}
          </div>
        </div>
      </div> */}

      {/* Call state presentation */}
      <div className="text-center mb-6">
        {callState === "ringing" && (
          <>
            <div className="flex justify-center mb-3">
              <Phone className="w-10 h-10 animate-bounce" />
            </div>
            <div className="text-lg font-semibold">
              {t("Incoming Call...", "प्राप्त कॉल...")}
            </div>
            <div className="text-sm text-white/70">
              {t("Call from", "कॉल से")} {caller.district}, {caller.ward}
            </div>
          </>
        )}

        {callState === "connected" && (
          <>
            <div className="flex justify-center mb-3">
              <Phone className="w-8 h-8" />
            </div>
            <div className="text-lg font-semibold font-mono">
              <CallTimer startTime={startTime || caller?.createdAt} />
            </div>
            <div className="text-sm text-white/70">
              {isHold
                ? t("On Hold", "होल्ड पर")
                : t("Connected", "जुड़ा हुआ")}
            </div>
          </>
        )}

        {callState === "rerouting" && (
          <>
            <div className="flex justify-center mb-3">
              <PhoneForwarded className="w-8 h-8 animate-pulse" />
            </div>
            <div className="text-lg font-semibold">
              {t("Rerouting call...", "कॉल पुनः निर्देशित किया जा रहा है...")}
            </div>
            <div className="text-sm text-white/70">
              {t("Transferring to", "स्थानांतरित किया जा रहा है")}{" "}
              {rerouteTarget?.name}
            </div>
          </>
        )}

        {callState === "ended" && (
          <>
            <div className="flex justify-center mb-3">
              <PhoneOff className="w-8 h-8" />
            </div>
            <div className="text-lg font-semibold">
              {t("Call Ended", "कॉल समाप्त")}
            </div>
            <div className="text-sm text-white/70">
              {rerouteTarget
                ? `${t("Transferred to", "स्थानांतरित किया गया")} ${rerouteTarget.name}`
                : t("Completed", "पूरा हुआ")}
            </div>
          </>
        )}
      </div>

      {/* Action controls */}
      <div className="flex gap-2 justify-center">
        {callState === "ringing" && (
          <Button
            onClick={onAccept}
            disabled={isAcceptPending}
            className="bg-card text-emerald-600 hover:bg-white/90"
          >
            {isAcceptPending ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Phone className="w-4 h-4 mr-1" />
            )}
            {t("Accept", "स्वीकार करें")}
          </Button>
        )}

        {callState === "connected" && (
          <div className="space-y-2">
            <div className="flex gap-2 justify-center flex-wrap">
              <button
                type="button"
                onClick={() => setIsHold(!isHold)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isHold
                    ? "bg-amber-400 text-white"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}
                title={isHold ? t("Resume", "पुनः शुरू") : t("Hold", "होल्ड")}
              >
                {isHold ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </button>
              {/* Mute button commented out for now
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isMuted
                    ? "bg-red-500 text-white"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}
                title={t("Mute", "म्यूट")}
              >
                {isMuted ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
              */}
              <button
                type="button"
                onClick={() => setShowReroutePanel(!showReroutePanel)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                title={t("Transfer / Conference", "स्थानांतरण / सम्मेलन")}
              >
                <PhoneForwarded className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowOutbound(!showOutbound)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                title={t("Outbound Dial", "आउटबाउंड डायल")}
              >
                <PhoneOutgoing className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onEnd}
                className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all"
                title={t("End Call", "कॉल समाप्त करें")}
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>
            <Link to="/crm/raise" className="block">
              <Button className="w-full bg-card text-primary hover:bg-white/90">
                <FileText className="w-4 h-4 mr-1" />{" "}
                {t("Register Complaint", "शिकायत दर्ज करें")}
              </Button>
            </Link>
          </div>
        )}

        {(callState === "ended" || callState === "rerouting") && (
          <Button
            onClick={onSimulateNewCall}
            className="bg-card text-primary hover:bg-white/90"
          >
            <Phone className="w-4 h-4 mr-1" />{" "}
            {t("Simulate New Call", "नया कॉल अनुकरण करें")}
          </Button>
        )}
      </div>
    </div>
  );
}
