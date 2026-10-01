import React, { useState, useEffect } from "react";
import EditDialog from "@/components/EditDialog";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComplaintRemark, putComplaintRemark } from "@/api/complaint.api";
import { getSuccessToast, getErrorToast, getWarningToast } from "@/utils/helpers";
import { QUERY_KEYS } from "@/utils/constants";
import { MessageSquarePlus, Pencil } from "lucide-react";

export default function ComplaintRemarkDialog({
  isOpen,
  onClose,
  grievanceId,
  timelineId,
  initialRemark = "",
  title,
  onSuccess,
}) {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [remark, setRemark] = useState("");

  const isEditMode = Boolean(timelineId);

  useEffect(() => {
    if (isOpen) {
      setRemark(initialRemark || "");
    }
  }, [isOpen, initialRemark]);

  const { mutate: saveRemarkMutation, isPending } = useMutation({
    mutationFn: async (data) => {
      if (isEditMode) {
        return putComplaintRemark({ timelineId, data });
      }
      return postComplaintRemark({ id: grievanceId, data });
    },
    onSuccess: (res) => {
      const defaultMsg = isEditMode
        ? t("Remark updated successfully", "टिप्पणी सफलतापूर्वक अपडेट की गई")
        : t("Remark added successfully", "टिप्पणी सफलतापूर्वक जोड़ी गई");
      getSuccessToast(res?.data?.message || defaultMsg);

      // Invalidate relevant queries
      const targetId = grievanceId;
      if (targetId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.COMPLAINT_DETAIL, targetId],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.COMPLAINT_DETAIL_OFFICER, targetId],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.COMPLAINT_COMMUNICATIONS, targetId],
        });
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_DETAIL],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_DETAIL_OFFICER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_COMMUNICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINTS_OFFICER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINTS_ALL],
      });

      onSuccess?.(res);
      onClose?.();
      setRemark("");
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!remark.trim()) {
      getWarningToast(
        t("Please enter a remark", "कृपया एक टिप्पणी दर्ज करें")
      );
      return;
    }
    if (!isEditMode && !grievanceId) {
      getErrorToast("Grievance ID not found");
      return;
    }
    if (isEditMode && !timelineId) {
      getErrorToast("Timeline ID not found");
      return;
    }

    saveRemarkMutation({
      remark: remark.trim(),
    });
  };

  const defaultTitle = isEditMode ? (
    <div className="flex items-center gap-2">
      <Pencil className="w-4 h-4 text-primary" />
      <span>{t("Edit Remark", "टिप्पणी संपादित करें")}</span>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <MessageSquarePlus className="w-5 h-5 text-primary" />
      <span>{t("Add Remark", "टिप्पणी जोड़ें")}</span>
    </div>
  );

  return (
    <EditDialog
      title={title || defaultTitle}
      onClose={onClose}
      onSave={handleSave}
      saving={isPending}
      bodyClassname="max-w-md"
    >
      <div>
        <label className="text-xs font-semibold block mb-1.5 text-foreground">
          {t("Remark", "टिप्पणी")} <span className="text-destructive">*</span>
        </label>
        <Textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder={
            isEditMode
              ? t("Enter updated remark...", "अपडेट की गई टिप्पणी दर्ज करें...")
              : t("Enter remark for this grievance...", "इस शिकायत के लिए टिप्पणी दर्ज करें...")
          }
          rows={4}
          className="text-xs resize-none"
          autoFocus
        />
      </div>
    </EditDialog>
  );
}
