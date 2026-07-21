import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STATUS_ACTIONS, PRIORITY_ACTIONS } from "@/utils/constants";
import EditDialog from "../EditDialog";
import { Textarea } from "../ui/textarea";
import { getErrorToast } from "@/utils/helpers";
import { Label } from "../ui/label";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const initialRemark = { isOpen: false, value: "", id: null, status: null };

export default function ComplaintActionSection({
  isCCE,
  selectedId,
  statusUpdate,
  updateStatusMutation,
  updatePriorityMutation,
  selectedFiles,
  fileInputRef,
  handleFileChange,
  handleUpload,
  removeFile,
  postMutation,
  currentStatus,
  currentPriority,
  fieldVisit,
  geotaggedImages,
}) {
  const { t } = useLanguage();
  const { profiledata } = useAuth();
  const [remark, setRemark] = useState(initialRemark);
  const [statusErr, setStatusErr] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus || "");
  const [selectedPriority, setSelectedPriority] = useState(
    currentPriority || "",
  );

  useEffect(() => {
    if (currentStatus) {
      setSelectedStatus(currentStatus);
    }
  }, [currentStatus]);

  useEffect(() => {
    if (currentPriority) {
      setSelectedPriority(currentPriority);
    }
  }, [currentPriority]);

  async function handleSaveRemark() {
    if (remark.value.trim() === "") {
      getErrorToast(t("Remark is required", "टिप्पणी आवश्यक है"));
    } else {
      await updateStatusMutation.mutateAsync({
        id: remark.id,
        status: remark.status,
        remark: remark.value,
      });
      setRemark(initialRemark);
    }
  }

  const handleSaveStatus = () => {
    const action = STATUS_ACTIONS.find((a) => a.value === selectedStatus);
    if (action?.isRemark) {
      setRemark({
        isOpen: true,
        value: "",
        id: selectedId,
        status: selectedStatus,
      });
    } else {
      updateStatusMutation.mutate({
        id: selectedId,
        status: selectedStatus,
      });
    }
  };
  const handleStatusChange = (e, statusObj) => {
    setStatusErr(null);
    if (statusObj?.requireFieldVisit) {
      console.log({ fieldVisit, geotaggedImages });
      if (fieldVisit?.status == "COMPLETED" && !!geotaggedImages?.[0]?.url) {
        setSelectedStatus(e.target.value);
      } else {
        getErrorToast(
          fieldVisit?.status !== "COMPLETED"
            ? t("Field visit not completed", "फील्ड विजिट पूरा नहीं हुआ")
            : t("Geo-tag photo not uploaded", "जियो-टैग फोटो अपलोड नहीं की गई"),
        );
      }
    } else {
      setSelectedStatus(e.target.value);
    }
  };

  const handleSavePriority = () => {
    updatePriorityMutation.mutate({
      id: selectedId,
      assignedPriority: selectedPriority,
    });
  };
  return (
    <>
      {/* Status actions */}
      <div className="border-t border-border pt-4">
        <div className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
          {t("Update Status", "स्थिति अपडेट करें")}
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={selectedStatus}
            onChange={(e) =>
              handleStatusChange(
                e,
                STATUS_ACTIONS.find((s) => s.value === e.target.value),
              )
            }
            disabled={updateStatusMutation.isPending}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <option value="" disabled>
              {t("Select Status", "स्थिति चुनें")}
            </option>
            {STATUS_ACTIONS.map((a, i) => (
              <option
                key={i}
                value={a.value}
                disabled={
                  (a.disabled && a.disabled.includes(currentStatus)) ||
                  (a.roleHidden && a.roleHidden.includes(profiledata?.role))
                }
              >
                {a.badgeLabel || a.label}
              </option>
            ))}
          </select>

          {selectedStatus !== currentStatus && (
            <Button
              onClick={handleSaveStatus}
              disabled={updateStatusMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 cursor-pointer"
              size="sm"
            >
              {updateStatusMutation.isPending ? t("Saving...", "सहेज रहा है...") : t("Save", "सहेजें")}
            </Button>
          )}
        </div>
        {statusErr && (
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {statusErr}
          </div>
        )}

        {statusUpdate && (
          <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-600 dark:text-emerald-400">
            ✓ {t("Status updated to", "स्थिति को अपडेट किया गया")} <strong>{statusUpdate}</strong>.
          </div>
        )}
      </div>

      {/* Priority actions */}
      <div className="border-t border-border pt-4">
        <div className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
          {t("Update Priority", "प्राथमिकता अपडेट करें")}
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            disabled={updatePriorityMutation.isPending}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <option value="" disabled>
              {t("Select Priority", "प्राथमिकता चुनें")}
            </option>
            {PRIORITY_ACTIONS.map((a, i) => (
              <option key={i} value={a.value}>
                {a.badgeLabel || a.label}
              </option>
            ))}
          </select>
          {selectedPriority !== currentPriority && (
            <Button
              onClick={handleSavePriority}
              disabled={updatePriorityMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 cursor-pointer"
              size="sm"
            >
              {updatePriorityMutation.isPending ? t("Saving...", "सहेज रहा है...") : t("Save", "सहेजें")}
            </Button>
          )}
        </div>
      </div>

      {/* Geo-tag upload */}
      {!isCCE && (
        <div className="border-t border-border pt-4 mt-4">
          <div className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
            {t("Geo-Tag Photo Upload", "जियो-टैग फोटो अपलोड")}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          {selectedFiles.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
            >
              <Camera className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {t(
                  "Click to capture/upload field photo with geo-tag (multiple allowed)",
                  "जियो-टैग के साथ फील्ड फोटो कैप्चर/अपलोड करने के लिए क्लिक करें (एकाधिक अनुमत)"
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {selectedFiles.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2.5 border border-border rounded-lg bg-muted/20"
                  >
                    {item.preview && (
                      <img
                        src={item.preview}
                        alt={`Preview ${idx}`}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {item.file.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {(item.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-xs text-red-500 hover:underline px-2 py-1 cursor-pointer"
                    >
                      {t("Remove", "हटाएं")}
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex-1 cursor-pointer"
                >
                  {t("Add More", "और जोड़ें")}
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={postMutation.isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  {postMutation.isPending
                    ? t("Uploading...", "अपलोड हो रहा है...")
                    : `${t("Save", "सहेजें")} ${selectedFiles.length} ${t("Image(s)", "छवि(याँ)")}`}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {remark.isOpen && (
        <EditDialog
          title={t("Add remark", "टिप्पणी जोड़ें")}
          onClose={() => setRemark(initialRemark)}
          onSave={handleSaveRemark}
          saving={updateStatusMutation.isPending}
        >
          <div className="">
            <Label>
              {t("Remark", "टिप्पणी")} <span className="text-red-500 mb-2">*</span>
            </Label>
            <Textarea
              value={remark.value}
              onChange={(e) =>
                setRemark((prev) => ({ ...prev, value: e.target.value }))
              }
              placeholder={t("Enter remark...", "टिप्पणी दर्ज करें...")}
              rows={5}
              className="border border-border rounded-lg p-2.5 w-full bg-background"
            />
          </div>
        </EditDialog>
      )}
    </>
  );
}
