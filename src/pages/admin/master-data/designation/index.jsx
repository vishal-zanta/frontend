import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import useGetRoles from "@/hooks/query/useGetRoles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRole, postRole, putRole } from "@/api/roles.api";
import { MAX_LIMIT, QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import DesignationTable from "./components/DesignationTable";
import DesignationForm from "./components/DesignationForm";
import { useGetDepartments } from "../hooks";
import Filter from "@/components/Filter";

export default function DesignationsTab() {
  const [filters, setFilters] = useState({});
  const { page, limit, ...paginationProps } = usePagination();
  const { data, isLoading, error } = useGetRoles(
    [page, limit, filters.department],
    { page, limit, department: filters.department },
  );

  const designations = data?.data?.docs || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;
  const queryClient = useQueryClient();

  const { data: departmentApiData } = useGetDepartments([1, MAX_LIMIT], {
    page: 1,
    limit: MAX_LIMIT,
  });
  const departmentOptions = (departmentApiData?.data?.data?.docs || []).map(
    (d) => ({
      label: d.title || d.name || "",
      value: d._id,
    }),
  );

  const [dialog, setDialog] = useState(null); // { type: "add"|"edit"|"delete", item? }

  const postMutation = useMutation({
    mutationFn: postRole,
    onSuccess: () => {
      getSuccessToast("Designation added successfully ");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const putMutation = useMutation({
    mutationFn: putRole,
    onSuccess: () => {
      getSuccessToast("Designation updated successfully ");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      getSuccessToast("Designation deleted successfully ");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
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
        roleId: dialog.item._id,
        role: { ...dialog.item, ...formData },
      });
    }
  };

  const initialValues = {
    designationEnglish: dialog?.item?.designationEnglish || "",
    designationHindi: dialog?.item?.designationHindi || "",
    level: dialog?.item?.level || "L1",
    permissions: dialog?.item?.permissions || [],
    department: dialog?.item?.department?._id || dialog?.item?.department || "",
  };

  const isSaving = postMutation.isPending || putMutation.isPending;

  return (
    <>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground">Designations</h3>
          <div className="flex items-center gap-2">
            <Filter
              filters={filters}
              setFilters={setFilters}
              filterOptions={[
                {
                  label: "Department",
                  filterKey: "department",
                  options: departmentOptions,
                },
              ]}
            />
            <Button
              size="sm"
              onClick={() => setDialog({ type: "add" })}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Designation
            </Button>
          </div>
        </div>
        <LoaderErrWrapper isLoading={isLoading} error={error}>
          <DesignationTable designations={designations} setDialog={setDialog} />
          <Pagination
            page={page}
            limit={limit}
            totalPage={totalPages}
            isLoading={isLoading}
            {...paginationProps}
          />
        </LoaderErrWrapper>
      </div>

      {dialog && dialog.type === "delete" && (
        <DeleteDialog
          title={dialog.item.designationEnglish}
          onDelete={() => deleteMutation.mutate(dialog.item._id)}
          onClose={() => setDialog(null)}
          deleting={deleteMutation.isPending}
        />
      )}
      {dialog && dialog.type !== "delete" && (
        <EditDialog
          title={
            dialog.type === "add"
              ? "Add Designation"
              : `Edit ${dialog.item?.designationEnglish || "Record"}`
          }
          onClose={() => setDialog(null)}
          isHideFooter={true}
        >
          <DesignationForm
            initialValues={initialValues}
            handleSubmit={handleSubmit}
            onClose={() => setDialog(null)}
            saving={isSaving}
            departmentOptions={departmentOptions}
          />
        </EditDialog>
      )}
    </>
  );
}
