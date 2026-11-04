import React from "react";
import { useCall } from "@/context/CallContext";
import { Phone, PhoneCall, PhoneOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TopCallStatusIcon = () => {
  const { responseData } = useCall();

  const avayaStatus =
    responseData?.avayaStatus ??
    responseData?.data?.avayaStatus ??
    responseData;

  const isLoggedIn = Boolean(avayaStatus?.isLoggedIn);
  const state = avayaStatus?.state;
  const error = avayaStatus?.error;
  const extension = avayaStatus?.extension;
  const agentId = avayaStatus?.agentId;

  // Determine color and status details according to avaya-status rules
  let colorScheme;
  // console.log({isLoggedIn, avayaStatus})

  if (!isLoggedIn) {
    // 1 & 2 -> Red color, isLoggedIn: false, show error on hover tooltip
    colorScheme = {
      status: "error",
      iconColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-500/10 hover:bg-red-500/20",
      borderColor: "border-red-500/30",
      dotColor: "bg-red-500",
      pulse: false,
      Icon: PhoneOff,
      badgeText: state === "UNKNOWN" ? "Disconnected" : "Logged Out",
      tooltipTitle: "Avaya Not Connected / Logged Out",
      tooltipMessage:
        error ||
        (state === "UNKNOWN"
          ? "Avaya not connected properly"
          : "Agent not logged in and not connected with a softphone"),
    };
  } else if (state === "READY_FREE") {
    // Green: isLoggedIn is true and state == "READY_FREE"
    colorScheme = {
      status: "ready",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10 hover:bg-emerald-500/20",
      borderColor: "border-emerald-500/30",
      dotColor: "bg-emerald-500",
      pulse: true,
      Icon: PhoneCall,
      badgeText: "Ready",
      tooltipTitle: "Avaya Connected & Ready",
      tooltipMessage: `Avaya OK with fully connected${extension ? ` (Ext: ${extension})` : ""}`,
    };
  } else {
    // Yellow: isLoggedIn is true and state != "READY_FREE"
    colorScheme = {
      status: "warning",
      iconColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10 hover:bg-amber-500/20",
      borderColor: "border-amber-500/30",
      dotColor: "bg-amber-500",
      pulse: false,
      Icon: Phone,
      badgeText:
        state === "LOGGED_OUT"
          ? "Logged Out"
          : String(state || "In Call")
              .split("_")
              .join(" ")
              .toLowerCase(),
      tooltipTitle: "Avaya Warning",
      tooltipMessage:
        state === "LOGGED_OUT"
          ? "Agent is Logged Out"
          : `Agent State: ${state || "Not Ready"}`,
    };
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${colorScheme.bgColor} ${colorScheme.borderColor}`}
            aria-label={colorScheme.tooltipTitle}
          >
            {/* <span className="relative flex h-2 w-2">
              {colorScheme.pulse && (
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorScheme.dotColor}`}
                />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${colorScheme.dotColor}`}
              />
            </span> */}

            <colorScheme.Icon className={`w-3.5 h-3.5 ${colorScheme.iconColor} `} />

            <span
              className={`hidden sm:inline font-semibold capitalize ${colorScheme.iconColor}`}
            >
              {colorScheme.badgeText}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="end"
          className="max-w-xs p-3 text-xs bg-slate-900 text-slate-100 dark:bg-slate-800 border border-slate-700 shadow-xl rounded-lg space-y-1.5 z-[99999]"
        >
          <div className="font-semibold flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${colorScheme.dotColor}`} />
            <span>{colorScheme.tooltipTitle}</span>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed">
            {colorScheme.tooltipMessage}
          </p>

          {(agentId || extension || error) && (
            <div className="pt-1.5 mt-1 border-t border-slate-700/80 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400 font-mono">
              {agentId && <span>Agent: {agentId}</span>}
              {extension && <span>Ext: {extension}</span>}
              {error && (
                <span className="text-red-400 truncate max-w-full">
                  Error: {error}
                </span>
              )}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TopCallStatusIcon;
