import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";

export default function TagEvidenceDialog({
  tagDialog,
  onClose,
  onConfirm,
}) {
  const { t } = useLanguage();
  const [reason, setReason] = useState("");
  const [caseRef, setCaseRef] = useState("");

  if (!tagDialog) return null;

  const count = tagDialog.ids?.length || 0;

  const handleConfirm = () => {
    onConfirm?.({
      ids: tagDialog.ids,
      reason,
      caseRef,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
          <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-bold text-foreground">
            {t("Tag", "चिह्नित करें")} {count}{" "}
            {t("Call(s) as Priority", "कॉल प्राथमिकता के रूप में")}
          </h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-sm text-purple-600 dark:text-purple-400">
            {t(
              "Priority-tagged calls are preserved with enhanced retention (7 years) and flagged for legal/audit review. Recordings cannot be deleted while tagged.",
              "प्राथमिकता-चिह्नित कॉल को बढ़ी हुई अवधारण (7 वर्ष) के साथ संरक्षित किया जाता है और कानूनी/लेखापरीक्षा समीक्षा के लिए चिह्नित किया जाता है। चिह्नित होने के दौरान रिकॉर्डिंग हटाई नहीं जा सकती।"
            )}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">
              {t("Tagging Reason", "टैगिंग का कारण")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Legal escalation, dispute case, citizen complaint against agent..."
              className="bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">
              {t("Case Reference (optional)", "मामला संदर्भ (वैकल्पिक)")}
            </label>
            <Input
              value={caseRef}
              onChange={(e) => setCaseRef(e.target.value)}
              placeholder="e.g., LEGAL-2026-00472"
              className="bg-background"
            />
          </div>
        </div>
        <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            {t("Cancel", "रद्द करें")}
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <ShieldCheck className="w-4 h-4 mr-1" />{" "}
            {t("Confirm Priority Tag", "प्राथमिकता टैग की पुष्टि करें")}
          </Button>
        </div>
      </div>
    </div>
  );
}
