import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { useGetComplaintSources } from "../hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComplaintSource, putComplaintSource, deleteComplaintSource } from "../api";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import ComplaintTable from "./components/ComplaintTable";
import ComplaintForm from "./components/ComplaintForm";

export default function ComplaintSourcesTab() {
  const queryClient = useQueryClient();
  const { page, limit, ...paginationProps } = usePagination();
  const { data, isLoading, error } = useGetComplaintSources([page, limit], { page, limit });
  const rawSources = data?.data?.data?.docs || [];
  const totalPages = data?.data?.data?.pagination?.totalPages || 1;

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
            <>
             <ComplaintTable
             rawSources={rawSources}
             setDialog={setDialog}
             />
              <Pagination
                page={page}
                limit={limit}
                totalPage={totalPages}
                {...paginationProps}
              />
            </>
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
         <ComplaintForm
         formData={formData}
         setFormData={setFormData}
         errors={errors}
         setErrors={setErrors}
         />
        </EditDialog>
      )}
    </>
  );
}
