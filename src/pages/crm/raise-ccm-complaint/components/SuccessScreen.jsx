import React, { useState } from "react";
import { CheckCircle2, Copy, Check } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { Button } from "@/components/ui/button";
import { getSuccessToast } from "@/utils/helpers";

export default function SuccessScreen({
  role,
  t,
  onReset,
  externalComplaintId,
  data,
  grievanceNatureOptions = [],
}) {
  const [copied, setCopied] = useState(false);
  const finalData = data?.data?.data || data?.data || data;
  const grievanceId =
    finalData?.grievanceId ||
    finalData?.externalComplaintId ||
    externalComplaintId ||
    finalData?.id ||
    finalData?._id;

  const natureVal = finalData?.classification?.nature;
  let natureTitleEn = "Complaint";
  let natureTitleHi = "शिकायत";

  if (natureVal && typeof natureVal === "object") {
    natureTitleEn = natureVal.title || natureVal.name || "Complaint";
    natureTitleHi =
      natureVal.titleHindi || natureVal.nameHindi || natureTitleEn;
  } else if (natureVal && typeof natureVal === "string") {
    const matched = grievanceNatureOptions.find(
      (opt) =>
        opt.value === natureVal ||
        opt._id === natureVal ||
        opt.title === natureVal ||
        opt.label === natureVal,
    );
    if (matched) {
      natureTitleEn = matched.title || matched.label || "Complaint";
      natureTitleHi = matched.titleHindi || matched.label || "शिकायत";
    }
  }

  const handleCopy = () => {
    if (grievanceId) {
      navigator.clipboard.writeText(grievanceId);
      setCopied(true);
      getSuccessToast(
        t("Grievance ID copied to clipboard", "शिकायत आईडी कॉपी हो गई"),
      );
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <PortalLayout role={role}>
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[80vh]">
        <div className="max-w-md w-full bg-card rounded-2xl border border-border shadow-xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            {t(`${natureTitleEn} Submitted!`, `${natureTitleHi} दर्ज हो गई!`)}
          </h2>

          {/* <p className="text-sm text-muted-foreground mb-6">
            {t(
              `Your ${natureTitleEn.toLowerCase()} has been recorded. You will be notified about updates.`,
              `आपकी ${natureTitleHi} दर्ज कर ली गई है। आपको अपडेट के बारे में सूचित किया जाएगा।`,
            )}
          </p> */}

          {grievanceId && (
            <div className="bg-muted/50 dark:bg-muted/30 border border-border rounded-xl p-4 mt-6 text-left">
              <div className="text-xs text-muted-foreground font-medium mb-1">
                {t("Tracking number", "ट्रैकिंग आईडी")}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-base sm:text-lg font-bold text-primary tracking-wide">
                  {grievanceId}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  title={t("Copy ID", "आईडी कॉपी करें")}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* <Button
            className="bg-primary hover:bg-primary/90 w-full"
            onClick={onReset}
          >
            {t("File Another Complaint", "एक और शिकायत दर्ज करें")}
          </Button> */}
        </div>
      </div>
    </PortalLayout>
  );
}

