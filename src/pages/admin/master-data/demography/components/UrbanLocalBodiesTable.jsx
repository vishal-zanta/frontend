import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { getErrorToast, getSuccessToast, isValidNumber } from "@/utils/helpers";
import { useGetUlbs } from "../../hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postUlb, putUlb, deleteUlb } from "../../api";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import UrbanLocalBodiesForm from "./UrbanLocalBodiesForm";

export default function UrbanLocalBodiesTable({ districts = [] }) {
  const queryClient = useQueryClient();
  const { page, limit, ...paginationProps } = usePagination();
  const {
    data: ulbsData,
    isLoading: ulbsLoading,
    error: ulbsError,
  } = useGetUlbs([page, limit], { page, limit });
  const ulbs = ulbsData?.data?.data?.docs || [];
  const totalPages = ulbsData?.data?.data?.pagination?.totalPages || 1;

  const [dialog, setDialog] = useState(null); // { type: "add"|"edit"|"delete", item? }
  const [formData, setFormData] = useState({
    name: "",
    nameHindi: "",
    wards: 0,
    district: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    nameHindi: "",
    wards: "",
    district: "",
  });

  useEffect(() => {
    if (dialog) {
      setErrors({ name: "", nameHindi: "", wards: "", district: "" });
      if (dialog.type === "edit") {
        setFormData({
          name: dialog.item?.name || "",
          nameHindi: dialog.item?.nameHindi || "",
          wards: dialog.item?.wards || 0,
          district:
            typeof dialog.item?.district === "object"
              ? dialog.item?.district?._id
              : dialog.item?.district || "",
        });
      } else if (dialog.type === "add") {
        setFormData({
          name: "",
          nameHindi: "",
          wards: 0,
          district: districts[0]?._id || "",
        });
      }
    }
  }, [dialog, districts]);

  const postMutation = useMutation({
    mutationFn: postUlb,
    onSuccess: () => {
      getSuccessToast("ULB added successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ULBS] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const putMutation = useMutation({
    mutationFn: putUlb,
    onSuccess: () => {
      getSuccessToast("ULB updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ULBS] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUlb,
    onSuccess: () => {
      getSuccessToast("ULB deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ULBS] });
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
      newErrors.name = "ULB name (English) is required";
    }
    if (!formData.nameHindi.trim()) {
      newErrors.nameHindi = "ULB name (Hindi) is required";
    }
    if (
      !formData.wards ||
      isNaN(Number(formData.wards)) ||
      Number(formData.wards) <= 0
    ) {
      newErrors.wards = "Valid wards count is required";
    }
    if (!formData.district) {
      newErrors.district = "District is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({ name: "", nameHindi: "", wards: "", district: "" });

    const payload = {
      name: formData.name,
      nameHindi: formData.nameHindi,
      wards: Number(formData.wards),
      district: formData.district,
    };

    if (dialog.type === "add") {
      postMutation.mutate(payload);
    } else {
      putMutation.mutate({
        ulbId: dialog.item._id,
        ulb: {
          ...dialog.item,
          ...payload,
        },
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">
              Urban Local Bodies (ULBs)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure and manage municipal corporations and town councils
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setDialog({ type: "add" })}
            className="bg-primary hover:bg-primary/90 animate-fade-in"
          >
            <Plus className="w-4 h-4 mr-1" /> Add ULB
          </Button>
        </div>
        <LoaderErrWrapper isLoading={ulbsLoading} error={ulbsError}>
          {ulbs.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground bg-muted/10 border-b border-border">
              No ULBs configured yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">ULB Name</th>
                    <th className="px-4 py-2.5 font-medium">Hindi</th>
                    <th className="px-4 py-2.5 font-medium">District</th>
                    <th className="px-4 py-2.5 font-medium text-right">
                      Wards
                    </th>
                    <th className="px-4 py-2.5 font-medium text-right">
                      Population
                    </th>
                    <th className="px-4 py-2.5 text-center font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ulbs.map((u) => {
                    const districtObj =
                      typeof u.district === "object"
                        ? u.district
                        : districts.find(
                            (d) => d._id === u.district || d.id === u.district,
                          );
                    const districtName = districtObj?.name || "—";
                    const districtPopulation = districtObj?.population;

                    return (
                      <tr key={u._id} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{u.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {u.nameHindi || "—"}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground capitalize">
                          {districtName}
                        </td>
                        <td className="px-4 py-2.5 text-right">{u.wards}</td>
                        <td className="px-4 py-2.5 text-right font-semibold">
                          {districtPopulation
                            ? districtPopulation.toLocaleString("en-IN")
                            : "—"}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-1 justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                setDialog({ type: "edit", item: u })
                              }
                            >
                              <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                setDialog({ type: "delete", item: u })
                              }
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
              ? "Add ULB"
              : `Edit ${dialog.item?.name || "Record"}`
          }
          onClose={() => setDialog(null)}
          onSave={handleSave}
          saving={postMutation.isPending || putMutation.isPending}
        >
          <UrbanLocalBodiesForm
            errors={errors}
            formData={formData}
            setErrors={setErrors}
            setFormData={setFormData}
            districts={districts}
          />
        </EditDialog>
      )}
    </>
  );
}
