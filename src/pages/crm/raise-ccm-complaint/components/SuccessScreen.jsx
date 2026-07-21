import React from "react";
import { CheckCircle2 } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { Button } from "@/components/ui/button";

export default function SuccessScreen({ role, t, onReset }) {
  return (
    <PortalLayout role={role}>
      <div className="p-6 flex items-center justify-center min-h-[80vh]">
        <div className="max-w-md w-full bg-card rounded-2xl border border-border shadow-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t("Complaint Submitted!", "शिकायत दर्ज हो गई!")}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {t(
              "Your grievance has been recorded. You will be notified about updates.",
              "आपकी शिकायत दर्ज कर ली गई है। आपको अपडेट के बारे में सूचित किया जाएगा।",
            )}
          </p>
          <Button
            className="bg-primary hover:bg-primary/90 w-full"
            onClick={onReset}
          >
            {t("File Another Complaint", "एक और शिकायत दर्ज करें")}
          </Button>
        </div>
      </div>
    </PortalLayout>
  );
}
