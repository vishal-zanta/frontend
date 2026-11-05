import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  User,
  CheckCircle2,
  Circle,
  AlertCircle,
  PhoneForwarded,
  Headset,
  Users,
  PhoneOff,
} from "lucide-react";
import EditDialog from "@/components/EditDialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useCall } from "@/context/CallContext";
import { getTransferTargets } from "@/api/calling.api";

/**
 * Dialog for selecting a transfer / consult target.
 * Displays parentSupervisor and cces with single selection,
 * role badges (CCS / CCE), and invokes transfer, consult, conference, or cancel mutations.
 */
export default function TransferTargetsDialog({
  isOpen,
  onClose,
  actionType = "transfer", // "transfer" | "consult" | "conference" | "cancel"
}) {
  const { t } = useLanguage();
  const [selectedUserId, setSelectedUserId] = useState(null);

  const {
    transferCall,
    consultCall,
    conferenceCall,
    consultCancel,
    isTransferring,
    isConsulting,
    isConferencing,
    isCancellingConsult,
  } = useCall();

  const isActionLoading =
    isTransferring || isConsulting || isConferencing || isCancellingConsult;

  const {
    data: targets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["telephonyTransferTargets"],
    queryFn: async () => {
      const response = await getTransferTargets();
      const result = response?.data?.data ?? response?.data;
      console.log("[TransferTargets] Fetched targets data:", result);
      return result;
    },
    enabled: Boolean(isOpen),
  });

  const parentSupervisor = targets?.parentSupervisor || null;
  const cces = Array.isArray(targets?.cces) ? targets.cces : [];

  // Default selection to parentSupervisor or first CCE when targets load
  useEffect(() => {
    if (!isOpen) {
      setSelectedUserId(null);
      return;
    }
    if (parentSupervisor?._id) {
      setSelectedUserId(parentSupervisor._id);
    } else if (cces.length > 0) {
      setSelectedUserId(cces[0]._id);
    }
  }, [isOpen, parentSupervisor?._id, cces.length]);

  if (!isOpen) return null;

  const getActionConfig = () => {
    switch (actionType) {
      case "consult":
        return {
          title: t(
            "Consult Agent / Supervisor",
            "एजेंट / सुपरवाइजर से परामर्श",
          ),
          icon: Headset,
          btnText: t("Start Consult", "परामर्श शुरू करें"),
          badgeText: "CONSULT",
        };
      case "conference":
        return {
          title: t("Conference (3-Way Call)", "सम्मेलन (3-पक्षीय कॉल)"),
          icon: Users,
          btnText: t("Start Conference", "सम्मेलन शुरू करें"),
          badgeText: "CONFERENCE",
        };
      case "cancel":
        return {
          title: t("Cancel Consult", "परामर्श रद्द करें"),
          icon: PhoneOff,
          btnText: t("Confirm Cancel", "रद्द करने की पुष्टि करें"),
          badgeText: "CANCEL",
        };
      case "transfer":
      default:
        return {
          title: t("Transfer Call", "कॉल स्थानांतरित करें"),
          icon: PhoneForwarded,
          btnText: t("Transfer Call", "कॉल स्थानांतरित करें"),
          badgeText: "TRANSFER",
        };
    }
  };

  const actionConfig = getActionConfig();

  const handleConfirm = async () => {
    try {
      if (actionType === "cancel") {
        await consultCancel();
      } else if (actionType === "transfer" && selectedUserId) {
        await transferCall(selectedUserId);
      } else if (actionType === "consult" && selectedUserId) {
        await consultCall(selectedUserId);
      } else if (actionType === "conference" && selectedUserId) {
        await conferenceCall(selectedUserId);
      }
      onClose();
    } catch (err) {
      console.error(`[TransferTargets] Error executing ${actionType}:`, err);
    }
  };

  const renderTargetItem = (target, isParent = false) => {
    const targetId = target?._id || target?.id;
    const isSelected = selectedUserId === targetId;
    const isSupervisor =
      Boolean(target?.isSupervisor) ||
      Boolean(target?.isParentSupervisor) ||
      target?.roleName?.toLowerCase().includes("supervisor");
    const roleBadge = isSupervisor ? "CCS" : "CCE";
    const isOnline =
      target?.isOnline ??
      target?.status === "AVAILABLE" ??
      target?.status === "READY_FREE";

    return (
      <div
        key={targetId}
        onClick={() => setSelectedUserId(targetId)}
        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
          isSelected
            ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
            : "border-border bg-card hover:bg-muted/60"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Radio indicator */}
          <div className="shrink-0 text-primary">
            {isSelected ? (
              <CheckCircle2 className="w-4 h-4 fill-primary text-primary-foreground" />
            ) : (
              <Circle className="w-4 h-4 text-muted-foreground/60" />
            )}
          </div>

          {/* User info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground truncate">
                {target.name}
              </span>

              {/* Role Badge: CCE / CCS */}
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                  isSupervisor
                    ? "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20"
                    : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                }`}
              >
                {roleBadge}
              </span>

              {/* {isParent && (
                <span className="text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-1 rounded">
                  {t("Parent", "पैरेंट")}
                </span>
              )} */}
            </div>

            <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
              {target.userCode && (
                <span className="font-mono text-[10px] font-medium text-foreground/80">
                  {target.userCode}
                </span>
              )}
              {/* {target.extension && (
                <span className="font-mono text-[10px] bg-muted px-1.5 py-0.2 rounded text-muted-foreground">
                  Ext: {target.extension}
                </span>
              )} */}
            </div>
          </div>
        </div>

        {/* Online / Status dot */}
        <div className="flex items-center gap-1.5 shrink-0 text-[11px] text-muted-foreground font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-emerald-500" : "bg-slate-400"
            }`}
            title={isOnline ? "Available" : "Offline / Busy"}
          />
          <span className="hidden sm:inline text-[10px]">
            {target.status || (isOnline ? "Available" : "Offline")}
          </span>
        </div>
      </div>
    );
  };

  const hasAnyTargets = Boolean(parentSupervisor || cces.length > 0);

  return (
    <EditDialog
      title={actionConfig.title}
      onClose={onClose}
      isHideFooter={true}
      bodyClassname="max-w-lg"
    >
      <div className="space-y-4">
        {/* Banner with action badge */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-xs text-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <actionConfig.icon className="w-4 h-4 text-primary shrink-0" />
            <span>
              {actionType === "cancel"
                ? t(
                    "Cancel ongoing consultation and resume call with customer.",
                    "चल रहे परामर्श को रद्द करें और नागरिक के साथ कॉल पुनः शुरू करें।",
                  )
                : t(
                    "Select a target CCE or supervisor below.",
                    "नीचे दिए गए लक्षित CCE या सुपरवाइजर का चयन करें।",
                  )}
            </span>
          </div>
          <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-primary/20 text-primary">
            {actionConfig.badgeText}
          </span>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs">
              {t(
                "Fetching available targets...",
                "उपलब्ध लक्ष्य प्राप्त किए जा रहे हैं...",
              )}
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">
              {error?.response?.data?.message ||
                error?.message ||
                t(
                  "Failed to load transfer targets.",
                  "स्थानांतरण लक्ष्य लोड करने में विफल।",
                )}
            </span>
            <button
              type="button"
              onClick={() => refetch()}
              className="underline text-[11px] font-medium"
            >
              {t("Retry", "पुनः प्रयास")}
            </button>
          </div>
        )}

        {/* Targets List */}
        {!isLoading && !error && actionType !== "cancel" && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {!hasAnyTargets ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                <User className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>
                  {t(
                    "No available CCE or supervisor targets found.",
                    "कोई उपलब्ध CCE या सुपरवाइजर लक्ष्य नहीं मिला।",
                  )}
                </p>
              </div>
            ) : (
              <>
                {/* 1. Parent Supervisor Section */}
                {parentSupervisor && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold tracking-wide uppercase text-muted-foreground flex items-center gap-1.5">
                      <span>
                        {t("Parent Supervisor (CCS)", "पैरेंट सुपरवाइजर (CCS)")}
                      </span>
                    </div>
                    {renderTargetItem(parentSupervisor, true)}
                  </div>
                )}

                {/* 2. CCEs Section */}
                {cces.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold tracking-wide uppercase text-muted-foreground flex items-center gap-1.5">
                      <span>
                        {t(
                          "Call Centre Executives (CCE)",
                          "कॉल सेंटर एग्जीक्यूटिव्स (CCE)",
                        )}{" "}
                        ({cces.length})
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {cces.map((cce) => renderTargetItem(cce, false))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="pt-3 pb-3 border-t border-border flex items-center justify-end gap-2">
          <Button
            variant="outline"
            // className="flex-1"
            type="button"
            size="sm"
            onClick={onClose}
            disabled={isActionLoading}
          >
            {t("Cancel", "रद्द करें")}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={
              isActionLoading || (actionType !== "cancel" && !selectedUserId)
            }
            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]"
          >
            {isActionLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                <span>{t("Processing...", "प्रक्रिया जारी...")}</span>
              </>
            ) : (
              <>
                <actionConfig.icon className="w-3.5 h-3.5 mr-1.5" />
                <span>{actionConfig.btnText}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </EditDialog>
  );
}
