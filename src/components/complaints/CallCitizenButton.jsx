import React from "react";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function CallCitizenButton({
  mobileNumber,
  className = "",
  size = "sm",
  variant = "outline",
  children,
  ...props
}) {
  const { t } = useLanguage();
  const { profiledata } = useAuth();

  if (!profiledata?.isCCE) {
    return null;
  }

  if (!mobileNumber || mobileNumber === "N/A" || mobileNumber === "-") {
    return null;
  }

  const cleanNumber = String(mobileNumber).trim();

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors ${className}`}
      {...props}
    >
      <a href={`tel:${cleanNumber}`}>
        <PhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        {children || t("Call Citizen", "नागरिक को कॉल करें")}
      </a>
    </Button>
  );
}
