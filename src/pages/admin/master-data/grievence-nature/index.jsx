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
import { postOption, putOption, deleteOption } from "../api";
import { useGetOptions, useGetOptionTypes } from "../hooks";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import { grievanceNatureSchema, grievanceNatureDefaultValues } from "../schema";
import GrievenceItems from "./components/GrievenceItems";
import GrievenceForm from "./components/GrievenceForm";
import useSort from "@/hooks/useSort";

export default function GrievenceNatureTab() {
  const sortProps = useSort();
  const queryClient = useQueryClient();
  const { page, limit, ...paginationProps } = usePagination();

  // Fetch paginated options list
  const { data, isLoading, error } = useGetOptions([page, limit, sortProps.sortBy, sortProps.sortOrder], {
    page,
    limit,
    sortBy: sortProps.sortBy,
    sortOrder: sortProps.sortOrder,
  });
  const rawItems = data?.data?.data?.docs || [];
  const totalPages = data?.data?.data?.pagination?.totalPages || 1;

  // Fetch available types for the creatable select
  const { data: typesData, isLoading: typesLoading } = useGetOptionTypes();
  const typeOptions = useMemo(() => {
    const types = typesData?.data?.data || typesData?.data || [];
    if (Array.isArray(types)) {
      return types.map((t) =>
        typeof t === "string"
          ? { label: t, value: t }
          : { label: t.label ?? t.value, value: t.value },
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
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.OPTIONS],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.OPTION_TYPES],
        refetchType: "active",
      });

      setDialog(null);
    },
    onError: (err) => getErrorToast(err),
  });

  const putMutation = useMutation({
    mutationFn: putOption,
    onSuccess: () => {
      getSuccessToast("Grievance nature updated successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.OPTIONS],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.OPTION_TYPES],
        refetchType: "active",
      });

      setDialog(null);
    },
    onError: (err) => getErrorToast(err),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOption,
    onSuccess: () => {
      getSuccessToast("Grievance nature deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.OPTIONS],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.OPTION_TYPES],
        refetchType: "active",
      });

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
      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between p-5 py-3">
          <h3 className="font-bold text-foreground">Grievance Options</h3>
          <Button
            size="sm"
            onClick={() => setDialog({ type: "add" })}
            className="bg-primary hover:bg-primary/90 animate-fade-in"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Option
          </Button>
        </div>

        <LoaderErrWrapper isLoading={isLoading} error={error}>
          {rawItems.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border">
              No grievance natures configured yet.
            </div>
          ) : (
            <>
              <GrievenceItems
                rawItems={rawItems}
                setDialog={setDialog}
                sortProps={sortProps}
              />
              <Pagination
                page={page}
                limit={limit}
                totalPage={totalPages}
                isLoading={isLoading}
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
          <GrievenceForm
            initialValues={initialValues}
            handleSubmit={handleSubmit}
            typeOptions={typeOptions}
          />
        </EditDialog>
      )}
    </>
  );
}
