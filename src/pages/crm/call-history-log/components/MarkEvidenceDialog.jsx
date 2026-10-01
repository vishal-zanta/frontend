import React, { useState, useEffect } from "react";
import EditDialog from "@/components/EditDialog";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchCallEvidence } from "@/api/calling.api";
import { getSuccessToast, getErrorToast, getWarningToast } from "@/utils/helpers";
import { QUERY_KEYS } from "@/utils/constants";
import { ShieldCheck } from "lucide-react";

export default function MarkEvidenceDialog({ call, onClose, onSuccess }) {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [evidenceReason, setEvidenceReason] = useState("");

  useEffect(() => {
    if (call) {
      setEvidenceReason(call.evidenceReason || "");
    }
  }, [call]);

  const { mutate: markEvidence, isPending } = useMutation({
    mutationFn: ({ callId, data }) => patchCallEvidence(callId, data),
    onSuccess: (res) => {
      getSuccessToast(
        res?.data?.message ||
          t(
            "Call marked as evidence successfully",
            "कॉल को सफलतापूर्वक साक्ष्य के रूप में चिह्नित किया गया"
          )
      );
      queryClient.invalidateQueries({
        queryKey: ["calls"],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_COMMUNICATIONS],
      });
      onSuccess?.({
        callId: call?._id || call?.callId,
        evidenceReason: evidenceReason.trim(),
      });
      onClose();
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  if (!call) return null;

  const callDbId = call._id;

  const handleSave = () => {
    if (!evidenceReason.trim()) {
      getWarningToast(
        t("Please enter an evidence reason", "कृपया साक्ष्य का कारण दर्ज करें")
      );
      return;
    }

    if (!callDbId) {
      getErrorToast("Call ID (_id) not found");
      return;
    }

    markEvidence({
      callId: callDbId,
      data: {
        evidenceReason: evidenceReason.trim(),
      },
    });
  };

  return (
    <EditDialog
      title={
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span>{t("Mark as Evidence", "साक्ष्य के रूप में चिह्नित करें")}</span>
        </div>
      }
      onClose={onClose}
      onSave={handleSave}
      saving={isPending}
      bodyClassname="max-w-md"
    >
      <div>
        <label className="text-xs font-semibold block mb-1.5 text-foreground">
          {t("Evidence Reason", "साक्ष्य का कारण")}{" "}
          <span className="text-destructive">*</span>
        </label>
        <Textarea
          value={evidenceReason}
          onChange={(e) => setEvidenceReason(e.target.value)}
          placeholder={t(
            "Enter evidence reason...",
            "साक्ष्य का कारण दर्ज करें..."
          )}
          rows={4}
          className="text-xs resize-none"
          autoFocus
        />
      </div>
    </EditDialog>
  );
}
