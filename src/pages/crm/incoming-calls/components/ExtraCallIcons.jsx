import React from "react";
import {
  PhoneForwarded,
  Headset,
  Users,
  PhoneOff,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Single call action icon button with disabled and loading states.
 */
export function ExtraCallIconButton({
  icon: Icon,
  title,
  onClick,
  isDisabled = false,
  isLoading = false,
  size = "md",
  variant = "default",
  className = "",
}) {
  const isSm = size === "sm";

  const sizeClasses = isSm
    ? "w-7 h-7 rounded text-xs"
    : "w-10 h-10 rounded-full";

  const iconSizeClasses = isSm ? "w-3.5 h-3.5" : "w-4 h-4";

  let colorClasses = "bg-white/20 hover:bg-white/30 text-white";
  if (variant === "danger") {
    colorClasses = "bg-red-500/80 hover:bg-red-600 text-white";
  } else if (variant === "amber") {
    colorClasses = "bg-amber-500/80 hover:bg-amber-600 text-white";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled || isLoading}
      title={title}
      className={`flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed ${sizeClasses} ${colorClasses} ${className}`}
    >
      {isLoading ? (
        <Loader2 className={`${iconSizeClasses} animate-spin`} />
      ) : (
        <Icon className={iconSizeClasses} />
      )}
    </button>
  );
}

/**
 * Composite container for the Telephony Action Icons:
 * 1. Transfer
 * 2. Consult (when isConsult is false) OR Consult Cancel (when isConsult is true)
 * 3. Conference
 */
export default function ExtraCallIcons({
  onTransfer,
  onConsult,
  onConference,
  onConsultCancel,
  isConsult = false,
  isTransferDisabled = false,
  isConsultDisabled = false,
  isConferenceDisabled = false,
  isConsultCancelDisabled = false,
  isTransferLoading = false,
  isConsultLoading = false,
  isConferenceLoading = false,
  isConsultCancelLoading = false,
  size = "md",
  className = "",
}) {
  const { t } = useLanguage();

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* 1. Transfer */}
      <ExtraCallIconButton
        icon={PhoneForwarded}
        title={t("Transfer Call", "कॉल स्थानांतरित करें")}
        onClick={onTransfer}
        isDisabled={isTransferDisabled}
        isLoading={isTransferLoading}
        size={size}
      />

      {/* 2. Consult OR Consult Cancel (Only one shown at a time based on isConsult) */}
      {isConsult ? (
        <ExtraCallIconButton
          icon={PhoneOff}
          title={t("Cancel Consult", "परामर्श रद्द करें")}
          onClick={onConsultCancel}
          isDisabled={isConsultCancelDisabled}
          isLoading={isConsultCancelLoading}
          size={size}
          variant="danger"
        />
      ) : (
        <ExtraCallIconButton
          icon={Headset}
          title={t("Consult Agent / Supervisor", "एजेंट / सुपरवाइजर से परामर्श")}
          onClick={onConsult}
          isDisabled={isConsultDisabled}
          isLoading={isConsultLoading}
          size={size}
        />
      )}

      {/* 3. Conference */}
      <ExtraCallIconButton
        icon={Users}
        title={t("Conference Call", "सम्मेलन कॉल")}
        onClick={onConference}
        isDisabled={isConferenceDisabled}
        isLoading={isConferenceLoading}
        size={size}
      />
    </div>
  );
}
