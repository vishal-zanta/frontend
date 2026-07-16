import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import useGetRoles from "@/hooks/query/useGetRoles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRole, postRole, putRole } from "@/api/roles.api";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import DesignationTable from "./components/DesignationTable";
import DesignationForm from "./components/DesignationForm";


export default function DesignationsTab() {
  const { page, limit, ...paginationProps } = usePagination();
  const { data, isLoading, isFetching, isRefetching, error } = useGetRoles(
    [page, limit],
    { page, limit },
  );
  const designations = data?.data?.docs || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;
  const queryClient = useQueryClient();

  const [dialog, setDialog] = useState(null); // { type: "add"|"edit"|"delete", item? }
  const [formData, setFormData] = useState({
    designationEnglish: "",
    designationHindi: "",
    level: "L1",
    permissions: [],
  });
  const [errors, setErrors] = useState({
    designationEnglish: "",
    designationHindi: "",
    permissions: "",
  });

  useEffect(() => {
    if (dialog) {
      setErrors({ designationEnglish: "", designationHindi: "", permissions: "" });
      if (dialog.type === "edit") {
        setFormData({
          designationEnglish: dialog.item?.designationEnglish || "",
          designationHindi: dialog.item?.designationHindi || "",
          level: dialog.item?.level || "L1",
          permissions: dialog.item?.permissions || [],
        });
      } else if (dialog.type === "add") {
        setFormData({
          designationEnglish: "",
          designationHindi: "",
          level: "L1",
          permissions: [],
        });
      }
    }
  }, [dialog]);

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

  const handleSave = () => {
    if (dialog.type === "delete") {
      deleteMutation.mutate(dialog.item._id);
      return;
    }

    const newErrors = {};
    if (!formData.designationEnglish.trim()) {
      newErrors.designationEnglish = "Designation (English) is required";
    }
    if (!formData.designationHindi.trim()) {
      newErrors.designationHindi = "पदनाम (Hindi) is required";
    }
    if (!formData.permissions || formData.permissions.length === 0) {
      newErrors.permissions = "Permissions are required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({ designationEnglish: "", designationHindi: "", permissions: "" });

    if (dialog.type === "add") {
      postMutation.mutate(formData);
    } else {
      putMutation.mutate({
        roleId: dialog.item._id,
        role: { ...dialog.item, ...formData },
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground">Designations</h3>
          <Button
            size="sm"
            onClick={() => setDialog({ type: "add" })}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Designation
          </Button>
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
          onDelete={handleSave}
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
          onSave={handleSave}
          saving={postMutation.isPending || putMutation.isPending}
        >
          <DesignationForm
            errors={errors}
            formData={formData}
            setFormData={setFormData}
            setErrors={setErrors}
          />
        </EditDialog>
      )}
    
      
      
      
    </>
  );
}
