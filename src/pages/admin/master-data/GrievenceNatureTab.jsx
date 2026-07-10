import React, { useMemo, useState } from "react";
import { Plus, Trash2, Pencil, FileHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import RhfWrapper from "@/components/RhfWrapper";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postOption, putOption, deleteOption } from "./api";
import { useGetOptions, useGetOptionTypes } from "./hooks";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import { grievanceNatureSchema, grievanceNatureDefaultValues } from "./schema";

export default function GrievenceNatureTab() {
  const queryClient = useQueryClient();
  const { page, limit, ...paginationProps } = usePagination();

  // Fetch paginated options list
  const { data, isLoading, error } = useGetOptions([page, limit], {
    page,
    limit,
  });
  const rawItems = data?.data?.data?.docs || [];
  const totalPages = data?.data?.data?.pagination?.totalPages || 1;

  // Fetch available types for the creatable select
  const { data: typesData, isLoading: typesLoading } = useGetOptionTypes();
  const typeOptions = useMemo(() => {
    const types = typesData?.data?.data || typesData?.data || [];
    if (Array.isArray(types)) {
      return types.map((t) =>
        typeof t === "string" ? { label: t, value: t } : { label: t.label ?? t.value, value: t.value }
      );
    }
    return [];
  }, [typesData]);

  const [dialog, setDialog] = useState(null); // { type: "add"|"edit"|"delete", item? }

  // Derive initial form values for the dialog
  const initialValues = useMemo(() => {
    if (dialog?.type === "edit") {
      return {
        title: dialog.item?.title ?? "",
        type: dialog.item?.type ?? "",
      };
    }
    return grievanceNatureDefaultValues;
  }, [dialog]);

  // ── Mutations ───────────────────────────────────────────────────────────────
  const postMutation = useMutation({
    mutationFn: postOption,
    onSuccess: () => {
      getSuccessToast("Grievance nature added successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OPTIONS] , refetchType : "active"});
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OPTION_TYPES] , refetchType : "active"});

      setDialog(null);
    },
    onError: (err) => getErrorToast(err),
  });

  const putMutation = useMutation({
    mutationFn: putOption,
    onSuccess: () => {
      getSuccessToast("Grievance nature updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OPTIONS] ,  refetchType : "active"});
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OPTION_TYPES] , refetchType : "active"});

      setDialog(null);
    },
    onError: (err) => getErrorToast(err),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOption,
    onSuccess: () => {
      getSuccessToast("Grievance nature deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OPTIONS],  refetchType : "active" });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OPTION_TYPES] , refetchType : "active"});

      setDialog(null);
    },
    onError: (err) => getErrorToast(err),
  });

  // ── Form submit ─────────────────────────────────────────────────────────────
  const handleSubmit = (formData) => {
    if (dialog?.type === "add") {
      postMutation.mutate({ title: formData.title, type: formData.type });
    } else if (dialog?.type === "edit") {
      putMutation.mutate({
        optionId: dialog.item._id,
        option: { ...dialog.item, title: formData.title, type: formData.type },
      });
    }
  };

  const isSaving = postMutation.isPending || putMutation.isPending;

  return (
    <>
      {/* ── List card ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">Grievance Nature</h3>
          <Button
            size="sm"
            onClick={() => setDialog({ type: "add" })}
            className="bg-primary hover:bg-primary/90 animate-fade-in"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Nature
          </Button>
        </div>

        <LoaderErrWrapper isLoading={isLoading} error={error}>
          {rawItems.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border">
              No grievance natures configured yet.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-2">
                {rawItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 group bg-card transition-all duration-200 shadow-sm"
                  >
                    <FileHeart className="w-5 h-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      {item.type && (
                        <p className="text-xs text-muted-foreground truncate">{item.type}</p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => setDialog({ type: "edit", item })}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setDialog({ type: "delete", item })}
                        className="p-1 hover:bg-muted rounded text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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

      {/* ── Delete dialog ─────────────────────────────────────────────────── */}
      {dialog?.type === "delete" && (
        <DeleteDialog
          title={dialog.item.title}
          onDelete={() => deleteMutation.mutate(dialog.item._id)}
          onClose={() => setDialog(null)}
          deleting={deleteMutation.isPending}
        />
      )}

      {/* ── Add / Edit dialog ─────────────────────────────────────────────── */}
      {dialog && dialog.type !== "delete" && (
        <EditDialog
          title={
            dialog.type === "add"
              ? "Add Grievance Nature"
              : `Edit "${dialog.item?.title ?? "Record"}"`
          }
          onClose={() => setDialog(null)}
          onSave={() => document.getElementById("rhf-form")?.requestSubmit()}
          saving={isSaving}
        >
          <RhfWrapper
            initialValues={initialValues}
            isValidation
            validationSchema={grievanceNatureSchema}
            onSubmit={handleSubmit}
          >
            {/* Title */}
            <RhfInput
              name="title"
              label="Title"
              placeholder="e.g., Community, Family, Self"
              required
            />

            {/* Type — creatable single select from /options/types */}
            <RhfSelect
              name="type"
              label="Type"
              placeholder="Select or type a new type..."
              options={typeOptions}
              required
              isCreatable={true}
              isMultiple={false}
            />
          </RhfWrapper>
        </EditDialog>
      )}
    </>
  );
}
