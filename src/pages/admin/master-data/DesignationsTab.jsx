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

export default function DesignationsTab() {
  const { data, isLoading, isFetching, isRefetching, error } = useGetRoles();
  const designations = data?.data?.docs || [];
  const queryClient = useQueryClient();

  const [dialog, setDialog] = useState(null); // { type: "add"|"edit"|"delete", item? }
  const [formData, setFormData] = useState({
    designationEnglish: "",
    designationHindi: "",
    level: "L1",
  });
  const [errors, setErrors] = useState({
    designationEnglish: "",
    designationHindi: "",
  });

  useEffect(() => {
    if (dialog) {
      setErrors({ designationEnglish: "", designationHindi: "" });
      if (dialog.type === "edit") {
        setFormData({
          designationEnglish: dialog.item?.designationEnglish || "",
          designationHindi: dialog.item?.designationHindi || "",
          level: dialog.item?.level || "L1",
        });
      } else if (dialog.type === "add") {
        setFormData({
          designationEnglish: "",
          designationHindi: "",
          level: "L1",
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({ designationEnglish: "", designationHindi: "" });

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
        <LoaderErrWrapper
          isLoading={isLoading}
          error={error}
        >
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Designation (English)</th>
                <th className="px-4 py-2 font-medium">पदनाम (Hindi)</th>
                <th className="px-4 py-2 font-medium">Level</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {designations.map((d, i) => (
                <tr key={d._id || i} className="hover:bg-muted/30">
                  <td className="px-4 py-2.5 font-medium">
                    {d.designationEnglish}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {d.designationHindi}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant="outline" className="text-xs">
                      {d.level}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDialog({ type: "edit", item: d })}
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setDialog({ type: "delete", item: d })}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <div>
            <Label className="mb-1.5 block">Designation (English) *</Label>
            <Input
              value={formData.designationEnglish}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  designationEnglish: e.target.value,
                }));
                if (errors.designationEnglish) {
                  setErrors((prev) => ({ ...prev, designationEnglish: "" }));
                }
              }}
              required
              placeholder="e.g., Municipal Commissioner"
            />
            {errors.designationEnglish && (
              <p className="text-red-500 text-xs mt-1">{errors.designationEnglish}</p>
            )}
          </div>
          <div>
            <Label className="mb-1.5 block">पदनाम (Hindi) *</Label>
            <Input
              value={formData.designationHindi}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  designationHindi: e.target.value,
                }));
                if (errors.designationHindi) {
                  setErrors((prev) => ({ ...prev, designationHindi: "" }));
                }
              }}
              required
              placeholder="उदा. नगर आयुक्त"
            />
            {errors.designationHindi && (
              <p className="text-red-500 text-xs mt-1">{errors.designationHindi}</p>
            )}
          </div>
          <div>
            <Label className="mb-1.5 block">Level *</Label>
            <Select
              value={formData.level}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, level: val }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["L1", "L2", "Zone", "ULB", "Division", "SUDA"].map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </EditDialog>
      )}
    </>
  );
}
