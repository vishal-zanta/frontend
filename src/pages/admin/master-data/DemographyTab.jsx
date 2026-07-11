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
import { ULBS } from "@/lib/biharData";
import { useGetDemographics } from "./hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postDemographic, putDemographic, deleteDemographic } from "./api";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import UrbanLocalBodiesTable from "./UrbanLocalBodiesTable";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";

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
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-4 py-2.5 font-medium">District</th>
                      <th className="px-4 py-2.5 font-medium">Hindi</th>
                      <th className="px-4 py-2.5 font-medium">Division</th>
                      <th className="px-4 py-2.5 font-medium">Zone</th>
                      <th className="px-4 py-2.5 font-medium text-right">
                        Population
                      </th>
                      <th className="px-4 py-2.5 font-medium text-center">
                        Urban
                      </th>
                      <th className="px-4 py-2.5 text-center font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {districts.map((d) => (
                      <tr key={d._id} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{d.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {d.nameHindi || "—"}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {d.division}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {d.zone}
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold">
                          {d.population.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {d.urban ? "✅" : "—"}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-1 justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                setDialog({ type: "edit", item: d })
                              }
                            >
                              <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                setDialog({ type: "delete", item: d })
                              }
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

        {/* Modular UrbanLocalBodiesTable component */}
        <UrbanLocalBodiesTable ulbs={ULBS} districts={districts} />
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
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">District Name (English) *</Label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder="e.g., Patna"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <Label className="mb-1.5 block">जिला (Hindi) *</Label>
              <Input
                value={formData.nameHindi}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    nameHindi: e.target.value,
                  }));
                  if (errors.nameHindi)
                    setErrors((prev) => ({ ...prev, nameHindi: "" }));
                }}
                placeholder="उदा. पटना"
                required
              />
              {errors.nameHindi && (
                <p className="text-red-500 text-xs mt-1">{errors.nameHindi}</p>
              )}
            </div>
            <div>
              <Label className="mb-1.5 block">Division *</Label>
              <Input
                value={formData.division}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    division: e.target.value,
                  }));
                  if (errors.division)
                    setErrors((prev) => ({ ...prev, division: "" }));
                }}
                placeholder="e.g., Patna"
                required
              />
              {errors.division && (
                <p className="text-red-500 text-xs mt-1">{errors.division}</p>
              )}
            </div>
            <div>
              <Label className="mb-1.5 block">Zone *</Label>
              <Select
                value={formData.zone}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, zone: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="South Bihar">South Bihar</SelectItem>
                  <SelectItem value="North Bihar">North Bihar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Population *</Label>
              <Input
                
                value={formData.population}
                onChange={(e) => {

                  if (!isValidNumber(e.target.value, 0)) return;

                  setFormData((prev) => ({
                    ...prev,
                    population: e.target.value,
                  }));
                  if (errors.population)
                    setErrors((prev) => ({ ...prev, population: "" }));
                }}
                placeholder="e.g., 2442383"
                required
              />
              {errors.population && (
                <p className="text-red-500 text-xs mt-1">{errors.population}</p>
              )}
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Urban</Label>
                <p className="text-xs text-muted-foreground">
                  Classified as an urban administrative area
                </p>
              </div>
              <Switch
                checked={formData.urban}
                onCheckedChange={(val) =>
                  setFormData((prev) => ({ ...prev, urban: val }))
                }
              />
            </div>
          </div>
        </EditDialog>
      )}
    </>
  );
}
