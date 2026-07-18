import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STATUS_ACTIONS, PRIORITY_ACTIONS } from "@/utils/constants";
import EditDialog from "../EditDialog";
import { Textarea } from "../ui/textarea";
import { getErrorToast } from "@/utils/helpers";
import { Label } from "../ui/label";
import { useAuth } from "@/context/AuthContext";

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
}) {
  const { profiledata } = useAuth();
  const [remark, setRemark] = useState(initialRemark);
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
      getErrorToast("Remark is required");
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
        <div className="text-sm font-medium text-foreground mb-2">
          Update Status
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            disabled={updateStatusMutation.isPending}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>
              Select Status
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
              className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
              size="sm"
            >
              {updateStatusMutation.isPending ? "Saving..." : "Save"}
            </Button>
          )}
        </div>

        {statusUpdate && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
            ✓ Status updated to <strong>{statusUpdate}</strong>.
          </div>
        )}
      </div>

      {/* Priority actions */}
      <div className="border-t border-border pt-4">
        <div className="text-sm font-medium text-foreground mb-2">
          Update Priority
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            disabled={updatePriorityMutation.isPending}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>
              Select Priority
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
              className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
              size="sm"
            >
              {updatePriorityMutation.isPending ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>

      {/* Geo-tag upload */}
      {!isCCE && (
        <div className="border-t border-border pt-4 mt-4">
          <div className="text-sm font-medium text-foreground mb-2">
            Geo-Tag Photo Upload
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
              className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            >
              <Camera className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to capture/upload field photo with geo-tag (multiple
                allowed)
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
                      className="text-xs text-red-500 hover:underline px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex-1"
                >
                  Add More
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={postMutation.isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {postMutation.isPending
                    ? "Uploading..."
                    : `Save ${selectedFiles.length} Image(s)`}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {remark.isOpen && (
        <EditDialog
          title={"Add remark"}
          onClose={() => setRemark(initialRemark)}
          onSave={handleSaveRemark}
          saving={updateStatusMutation.isPending}
        >
          <div className="">
            <Label>
              Remark <span className="text-red-500 mb-2">*</span>
            </Label>
            <Textarea
              value={remark.value}
              onChange={(e) =>
                setRemark((prev) => ({ ...prev, value: e.target.value }))
              }
              placeholder="Enter remark..."
              rows={5}
              className="border border-border rounded-lg p-2.5 w-full"
            />
          </div>
        </EditDialog>
      )}
    </>
  );
}
