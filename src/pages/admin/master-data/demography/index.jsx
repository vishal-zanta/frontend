import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { getErrorToast, getSuccessToast, isValidNumber } from "@/utils/helpers";

import { useGetDemographics } from "../hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postDemographic, putDemographic, deleteDemographic } from "../api";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import UrbanLocalBodiesTable from "./components/UrbanLocalBodiesTable";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import DemographyTable from "./components/DemographyTable";
import DemographyForm from "./components/DemographyForm";

export default function DemographyTab() {
  const queryClient = useQueryClient();
  const { page, limit, ...paginationProps } = usePagination();
  const { data, isLoading, error } = useGetDemographics([page, limit], {
    page,
    limit,
  });
  const districts = data?.data?.data?.docs || [];
  const totalPages = data?.data?.data?.pagination?.totalPages || 1;

  const [dialog, setDialog] = useState(null); // { type: "add"|"edit"|"delete", item? }
  const [formData, setFormData] = useState({
    name: "",
    nameHindi: "",
    division: "",
    zone: "South Bihar",
    population: 0,
    urban: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    nameHindi: "",
    division: "",
    population: "",
  });

  useEffect(() => {
    if (dialog) {
      setErrors({ name: "", nameHindi: "", division: "", population: "" });
      if (dialog.type === "edit") {
        setFormData({
          name: dialog.item?.name || "",
          nameHindi: dialog.item?.nameHindi || "",
          division: dialog.item?.division || "",
          zone: dialog.item?.zone || "South Bihar",
          population: dialog.item?.population || 0,
          urban: !!dialog.item?.urban,
        });
      } else if (dialog.type === "add") {
        setFormData({
          name: "",
          nameHindi: "",
          division: "",
          zone: "South Bihar",
          population: 0,
          urban: false,
        });
      }
    }
  }, [dialog]);

  const postMutation = useMutation({
    mutationFn: postDemographic,
    onSuccess: () => {
      getSuccessToast("District added successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEMOGRAPHY] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const putMutation = useMutation({
    mutationFn: putDemographic,
    onSuccess: () => {
      getSuccessToast("District updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEMOGRAPHY] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDemographic,
    onSuccess: () => {
      getSuccessToast("District deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEMOGRAPHY] });
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
    if (!formData.name.trim()) {
      newErrors.name = "District name (English) is required";
    }
    if (!formData.nameHindi.trim()) {
      newErrors.nameHindi = "जिला का नाम (Hindi) is required";
    }
    if (!formData.division.trim()) {
      newErrors.division = "Division is required";
    }
    if (
      !formData.population ||
      isNaN(Number(formData.population)) ||
      Number(formData.population) < 0
    ) {
      newErrors.population = "Valid population is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({ name: "", nameHindi: "", division: "", population: "" });

    const payload = {
      ...formData,
      population: Number(formData.population),
    };

    if (dialog.type === "add") {
      postMutation.mutate(payload);
    } else {
      putMutation.mutate({
        demographicId: dialog.item._id,
        demographic: {
          ...dialog.item,
          ...payload,
        },
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-foreground">
              Districts & Demography
            </h3>
            <Button
              size="sm"
              onClick={() => setDialog({ type: "add" })}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-1" /> Add District
            </Button>
          </div>
          <LoaderErrWrapper isLoading={isLoading} error={error}>
            {districts.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground bg-muted/10 border-b border-border">
                No districts configured yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <DemographyTable setDialog={setDialog} districts={districts} />
                <Pagination
                  page={page}
                  limit={limit}
                  totalPage={totalPages}
                  {...paginationProps}
                />
              </div>
            )}
          </LoaderErrWrapper>
        </div>

        {/* Modular UrbanLocalBodiesTable component */}
        <UrbanLocalBodiesTable districts={districts} />
      </div>

      {dialog && dialog.type === "delete" && (
        <DeleteDialog
          title={dialog.item.name}
          onDelete={handleSave}
          onClose={() => setDialog(null)}
          deleting={deleteMutation.isPending}
        />
      )}
      {dialog && dialog.type !== "delete" && (
        <EditDialog
          title={
            dialog.type === "add"
              ? "Add District"
              : `Edit ${dialog.item?.name || "Record"}`
          }
          onClose={() => setDialog(null)}
          onSave={handleSave}
          saving={postMutation.isPending || putMutation.isPending}
        >
          <DemographyForm
            errors={errors}
            formData={formData}
            setErrors={setErrors}
            setFormData={setFormData}
          />
        </EditDialog>
      )}
    </>
  );
}
