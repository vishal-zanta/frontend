import React, { useState, useEffect } from "react";
import EditDialog from "@/components/EditDialog";
import { useLanguage } from "@/context/LanguageContext";
import { usePatchInmailStatus } from "@/hooks/query/useGetInmails";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/utils/constants";
import { getErrorToast, getWarningToast } from "@/utils/helpers";

export default function InmailRejectDialog({
  mail,
  onClose,
  onSuccess,
}) {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (mail) {
      setReason("");
      setError("");
    }
  }, [mail]);

  const patchMutation = usePatchInmailStatus({
    onSuccess: () => {
      getWarningToast(
        t(
          `Email ${mail?.emailId || mail?.id || mail?._id} rejected`,
          `ईमेल ${mail?.emailId || mail?.id || mail?._id} अस्वीकार कर दिया गया`,
        ),
      );
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INMAILS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INMAIL_STATS] });
      onSuccess && onSuccess();
      onClose();
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  if (!mail) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError(
        t("Rejection reason is mandatory", "अस्वीकृति का कारण अनिवार्य है"),
      );
      return;
    }

    patchMutation.mutate({
      id: mail._id || mail.id || mail.emailId,
      status: "REJECTED",
      rejectionReason: reason.trim(),
    });
  };

  return (
    <EditDialog
      title={t("Reject Email Communication", "ईमेल संचार अस्वीकार करें")}
      onClose={onClose}
      onSave={handleConfirm}
      isPending={patchMutation.isPending}
    >
      <div className="space-y-3 text-xs">
        <p className="text-muted-foreground">
          {t(
            "Specify the reason for rejecting this email. This will mark the inmail as rejected without raising a grievance.",
            "इस ईमेल को अस्वीकार करने का कारण बताएं। यह ईमेल को बिना शिकायत दर्ज किए अस्वीकार चिह्नित करेगा।",
          )}
        </p>

        <div>
          <label className="font-medium text-foreground block mb-1">
            {t("Reason", "कारण")}{" "}
            <span className="text-destructive">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (e.target.value.trim()) setError("");
            }}
            placeholder={t(
              "Enter reason for rejection...",
              "अस्वीकृति का कारण दर्ज करें...",
            )}
            className="w-full h-24 p-2.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {error && (
            <p className="text-destructive text-[11px] mt-1 font-medium">
              {error}
            </p>
          )}
        </div>
      </div>
    </EditDialog>
  );
}
