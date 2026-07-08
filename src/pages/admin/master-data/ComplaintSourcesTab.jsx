import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { useGetComplaintSources } from "./hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComplaintSource, putComplaintSource, deleteComplaintSource } from "./api";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";

export default function ComplaintSourcesTab() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useGetComplaintSources();
  const rawSources = data?.data?.data?.docs || [];

  const [dialog, setDialog] = useState(null); // { type: "add"|"edit"|"delete", item? }
  const [formData, setFormData] = useState({
    title: "",
  });
  const [errors, setErrors] = useState({
    title: "",
  });

  useEffect(() => {
    if (dialog) {
      setErrors({ title: "" });
      if (dialog.type === "edit") {
        setFormData({
          title: dialog.item?.title || "",
        });
      } else if (dialog.type === "add") {
        setFormData({
          title: "",
        });
      }
    }
  }, [dialog]);

  const postMutation = useMutation({
    mutationFn: postComplaintSource,
    onSuccess: () => {
      getSuccessToast("Complaint source added successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPLAINT_SOURCES] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const putMutation = useMutation({
    mutationFn: putComplaintSource,
    onSuccess: () => {
      getSuccessToast("Complaint source updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPLAINT_SOURCES] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComplaintSource,
    onSuccess: () => {
      getSuccessToast("Complaint source deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPLAINT_SOURCES] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleSave = () => {
    if (dialog.type === "delete") {
      deleteMutation.mutate(dialog.item._id);
      return;
    }

    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Source name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({ title: "" });

    if (dialog.type === "add") {
      postMutation.mutate(formData);
    } else {
      putMutation.mutate({
        sourceId: dialog.item._id,
        source: {
          ...dialog.item,
          ...formData,
        },
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">Complaint Sources</h3>
          <Button
            size="sm"
            onClick={() => setDialog({ type: "add" })}
            className="bg-primary hover:bg-primary/90 animate-fade-in"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Source
          </Button>
        </div>
        <LoaderErrWrapper isLoading={isLoading} error={error}>
          {rawSources.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border col-span-full">
              No complaint sources configured yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {rawSources.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 group bg-card transition-all duration-200 shadow-sm"
                >
                  <Globe className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium flex-1 truncate">{s.title}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setDialog({ type: "edit", item: s })}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setDialog({ type: "delete", item: s })}
                      className="p-1 hover:bg-muted rounded text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </LoaderErrWrapper>
      </div>

      {dialog && dialog.type === "delete" && (
        <DeleteDialog
          title={dialog.item.title}
          onDelete={handleSave}
          onClose={() => setDialog(null)}
          deleting={deleteMutation.isPending}
        />
      )}
      {dialog && dialog.type !== "delete" && (
        <EditDialog
          title={dialog.type === "add" ? "Add Source" : `Edit ${dialog.item?.title || "Record"}`}
          onClose={() => setDialog(null)}
          onSave={handleSave}
          saving={postMutation.isPending || putMutation.isPending}
        >
          <div>
            <Label className="mb-1.5 block">Source Name *</Label>
            <Input
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }));
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
              }}
              placeholder="e.g., Mobile App"
              required
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
        </EditDialog>
      )}
    </>
  );
}
