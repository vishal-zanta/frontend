import React, { useState, useEffect } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { getErrorToast, getSuccessToast, isValidNumber } from "@/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSubservice, putSubservice, deleteSubservice } from "../../api";
import { useGetSubservices } from "../../hooks";
import { QUERY_KEYS } from "@/utils/constants";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import SubServiceForm from "./SubServiceForm";

export default function SubServicesTable({ service, dialog, setDialog }) {
  const { page, limit, ...paginationProps } = usePagination();
  const [subservices, setSubservices] = useState(service.subservices || []);
  const [anyMutationDone, setAnyMutationDone] = useState(false);
  const { data: subservicesData , isLoading} = useGetSubservices(
    [page, limit],
    { serviceId: service?._id, page, limit },
    anyMutationDone,
  );
  const totalPages = subservicesData?.data?.data?.pagination?.totalPages || 1;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!anyMutationDone) {
      setSubservices(service.subservices || []);
    }
  }, [service.subservices, anyMutationDone]);

  useEffect(() => {
    if (anyMutationDone && subservicesData?.data?.data?.docs) {
      const allSub = subservicesData?.data?.data?.docs || [];

      setSubservices(allSub);
    }
  }, [subservicesData, anyMutationDone, service]);

  const [formData, setFormData] = useState({
    title: "",
    titleHindi: "",
    sla: 24,
    geoTagged: false,
    fieldVisit: false,
  });
  const [errors, setErrors] = useState({
    title: "",
    titleHindi: "",
    sla: "",
  });

  useEffect(() => {
    if (dialog) {
      setErrors({ title: "", titleHindi: "", sla: "" });
      if (dialog.type === "edit") {
        setFormData({
          title: dialog.item?.title || "",
          titleHindi: dialog.item?.titleHindi || "",
          sla: dialog.item?.sla || 24,
          geoTagged: !!dialog.item?.geoTagged,
          fieldVisit: !!dialog.item?.fieldVisit,
        });
      } else if (dialog.type === "add") {
        setFormData({
          title: "",
          titleHindi: "",
          sla: 24,
          geoTagged: false,
          fieldVisit: false,
        });
      }
    }
  }, [dialog]);

  const postMutation = useMutation({
    mutationFn: postSubservice,
    onSuccess: () => {
      getSuccessToast("Sub-service added successfully");
      setAnyMutationDone(true);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUBSERVICES] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const putMutation = useMutation({
    mutationFn: putSubservice,
    onSuccess: () => {
      getSuccessToast("Sub-service updated successfully");
      setAnyMutationDone(true);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUBSERVICES] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubservice,
    onSuccess: () => {
      getSuccessToast("Sub-service deleted successfully");
      setAnyMutationDone(true);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUBSERVICES] });
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
      newErrors.title = "Sub-service name (English) is required";
    }
    if (!formData.titleHindi.trim()) {
      newErrors.titleHindi = "उप-सेवा का नाम (Hindi) is required";
    }
    if (
      !formData.sla ||
      isNaN(Number(formData.sla)) ||
      Number(formData.sla) <= 0
    ) {
      newErrors.sla = "Valid SLA hours are required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({ title: "", titleHindi: "", sla: "" });

    if (dialog.type === "add") {
      postMutation.mutate({
        ...formData,
        sla: Number(formData.sla),
        service: dialog.item._id,
      });
    } else {
      putMutation.mutate({
        subserviceId: dialog.item._id,
        subservice: {
          ...dialog.item,
          ...formData,
          sla: Number(formData.sla),
        },
      });
    }
  };

  const isDialogActive =
    dialog &&
    (dialog.type === "add"
      ? dialog.item?._id === service._id
      : dialog.item?.service?._id === service._id ||
        dialog.item?.service === service._id);

  return (
    <>
      {subservices.length === 0 ? (
        <div className="text-center py-6 text-sm text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border">
          No sub-services configured for this service yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-3 py-2.5 font-medium">
                  Sub-Service (English)
                </th>
                <th className="px-3 py-2.5 font-medium">उप-सेवा (Hindi)</th>
                <th className="px-3 py-2.5 font-medium text-center">
                  SLA (hrs)
                </th>
                <th className="px-3 py-2.5 font-medium text-center">
                  Geo-Tagged
                </th>
                <th className="px-3 py-2.5 font-medium text-center">
                  Field Visit
                </th>
                <th className="px-3 py-2.5 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subservices.map((ss) => (
                <tr key={ss._id} className="hover:bg-muted/30">
                  <td className="px-3 py-2.5 font-medium">{ss.title}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {ss.titleHindi || "-"}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <Badge
                      variant="outline"
                      className="text-xs bg-amber-50 text-amber-700 font-semibold border-amber-200"
                    >
                      {ss.sla}h
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {ss.geoTagged ? "✅" : "-"}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {ss.fieldVisit ? "✅" : "-"}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1 justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setDialog({ type: "edit", item: ss })}
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDialog({ type: "delete", item: ss })}
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
            isLoading={isLoading}
            {...paginationProps}
          />
        </div>
      )}

      {isDialogActive && dialog && dialog.type === "delete" && (
        <DeleteDialog
          title={dialog.item.title}
          onDelete={handleSave}
          onClose={() => setDialog(null)}
          deleting={deleteMutation.isPending}
        />
      )}

      {isDialogActive && dialog && dialog.type !== "delete" && (
        <EditDialog
          title={
            dialog.type === "add"
              ? "Add Sub-service"
              : `Edit ${dialog.item?.title || "Record"}`
          }
          onClose={() => setDialog(null)}
          onSave={handleSave}
          saving={postMutation.isPending || putMutation.isPending}
        >
          <SubServiceForm
            errors={errors}
            formData={formData}
            setFormData={setFormData}
            service={service}
            setErrors={setErrors}
            key={"sub-service-form"}
          />
        </EditDialog>
      )}
    </>
  );
}
