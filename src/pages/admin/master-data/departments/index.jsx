import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { useGetDepartments } from "../hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postDepartment, putDepartment, deleteDepartment } from "../api";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import DepartmentTable from "./components/DepartmentTable";
import DepartmentForm from "./components/DepartmentForm";

export default function DepartmentsTab() {
  const queryClient = useQueryClient();
  const { page, limit, ...paginationProps } = usePagination();
  const { data, isLoading, error } = useGetDepartments([page, limit], { page, limit });
  const departments = data?.data?.data?.docs || [];
  const totalPages = data?.data?.data?.pagination?.totalPages || 1;

  const [dialog, setDialog] = useState(null); // { type: "add"|"edit"|"delete", item? }

  const postMutation = useMutation({
    mutationFn: postDepartment,
    onSuccess: () => {
      getSuccessToast("Department added successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEPARTMENTS] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const putMutation = useMutation({
    mutationFn: putDepartment,
    onSuccess: () => {
      getSuccessToast("Department updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEPARTMENTS] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      getSuccessToast("Department deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEPARTMENTS] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleSubmit = (formData) => {
    if (dialog.type === "add") {
      postMutation.mutate(formData);
    } else {
      putMutation.mutate({
        departmentId: dialog.item._id,
        department: {
          ...dialog.item,
          ...formData,
        },
      });
    }
  };

  const initialValues = {
    title: dialog?.item?.title || "",
    titleHindi: dialog?.item?.titleHindi || "",
  };

  const isSaving = postMutation.isPending || putMutation.isPending;

  return (
    <>
      <div className="bg-white rounded-xl border border-border ">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="font-bold text-foreground">Department Management</h3>
          <Button
            size="sm"
            onClick={() => setDialog({ type: "add" })}
            className="bg-primary hover:bg-primary/90 animate-fade-in"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Department
          </Button>
        </div>
        <LoaderErrWrapper isLoading={isLoading} error={error}>
          {departments.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border col-span-full">
              No departments configured yet.
            </div>
          ) : (
            <DepartmentTable
              departments={departments}
              setDialog={setDialog}
              pagination={
                <Pagination
                  page={page}
                  limit={limit}
                  totalPage={totalPages}
                  isLoading={isLoading}
                  {...paginationProps}
                />
              }
            />
          )}
        </LoaderErrWrapper>
      </div>

      {dialog && dialog.type === "delete" && (
        <DeleteDialog
          title={dialog.item.title}
          onDelete={() => deleteMutation.mutate(dialog.item._id)}
          onClose={() => setDialog(null)}
          deleting={deleteMutation.isPending}
        />
      )}
      {dialog && dialog.type !== "delete" && (
        <EditDialog
          title={dialog.type === "add" ? "Add Department" : `Edit ${dialog.item?.title || "Record"}`}
          onClose={() => setDialog(null)}
          isHideFooter={true}
        >
          <DepartmentForm
            initialValues={initialValues}
            handleSubmit={handleSubmit}
            onClose={() => setDialog(null)}
            saving={isSaving}
          />
        </EditDialog>
      )}
    </>
  );
}