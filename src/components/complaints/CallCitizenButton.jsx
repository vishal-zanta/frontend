import React from "react";
import { PhoneCall, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { postMakeCall } from "@/api/calling.api";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";

export default function CallCitizenButton({
  mobileNumber,
  className = "",
  size = "sm",
  variant = "outline",
  children,
  onClick,
  ...props
}) {
  const { t } = useLanguage();
  const { profiledata } = useAuth();

  const makeCallMutation = useMutation({
    mutationFn: postMakeCall,
    onSuccess: (res) => {
      getSuccessToast(
        res?.data?.message ||
          t("Call initiated successfully", "कॉल सफलतापूर्वक शुरू की गई"),
      );
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  if (!profiledata?.isCCE) {
    return null;
  }

  if (!mobileNumber || mobileNumber === "N/A" || mobileNumber === "-") {
    return null;
  }

  const digitsOnly = String(mobileNumber || "").replace(/\D/g, "");
  const cleanNumber =
    digitsOnly.length >= 10
      ? digitsOnly.slice(-10)
      : digitsOnly || String(mobileNumber).trim();

  const handleClick = (e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    onClick && onClick(e);
    makeCallMutation.mutate({
      clientNumber: cleanNumber,
    });
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={makeCallMutation.isPending || props.disabled}
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors ${className}`}
      {...props}
    >
      {makeCallMutation.isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
      ) : (
        <PhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      )}
      {children || t("Call Citizen", "नागरिक को कॉल करें")}
    </Button>
  );
}
