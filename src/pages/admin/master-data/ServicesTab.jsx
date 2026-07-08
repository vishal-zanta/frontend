import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { useGetServices } from "./hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService, putService, deleteService } from "./api";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import SubServicesTable from "./SubServicesTable";

export default function ServicesTab() {
  const queryClient = useQueryClient();
  const { data: servicesData, isLoading, error } = useGetServices();
  const services = servicesData?.data?.data?.docs || [];
  const [subServiceDialog, setSubServiceDialog] = useState(null);
  const [serviceDialog, setServiceDialog] = useState(null);

  const [serviceFormData, setServiceFormData] = useState({
    title: "",
    titleHindi: "",
    department: "",
  });
  const [serviceErrors, setServiceErrors] = useState({
    title: "",
    titleHindi: "",
    department: "",
  });

  useEffect(() => {
    if (serviceDialog) {
      setServiceErrors({ title: "", titleHindi: "", department: "" });
      if (serviceDialog.type === "edit") {
        setServiceFormData({
          title: serviceDialog.item?.title || "",
          titleHindi: serviceDialog.item?.titleHindi || "",
          department: serviceDialog.item?.department || "",
        });
      } else if (serviceDialog.type === "add") {
        setServiceFormData({
          title: "",
          titleHindi: "",
          department: "",
        });
      }
    }
  }, [serviceDialog]);

  const postServiceMutation = useMutation({
    mutationFn: postService,
    onSuccess: () => {
      getSuccessToast("Service added successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICES] });
      setServiceDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const putServiceMutation = useMutation({
    mutationFn: putService,
    onSuccess: () => {
      getSuccessToast("Service updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICES] });
      setServiceDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      getSuccessToast("Service deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICES] });
      setServiceDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleSaveService = () => {
    if (serviceDialog.type === "delete") {
      deleteServiceMutation.mutate(serviceDialog.item._id);
      return;
    }

    const newErrors = {};
    if (!serviceFormData.title.trim()) {
      newErrors.title = "Service name (English) is required";
    }
    if (!serviceFormData.titleHindi.trim()) {
      newErrors.titleHindi = "सेवा का नाम (Hindi) is required";
    }
    if (!serviceFormData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setServiceErrors(newErrors);
      return;
    }

    setServiceErrors({ title: "", titleHindi: "", department: "" });

    if (serviceDialog.type === "add") {
      postServiceMutation.mutate(serviceFormData);
    } else {
      putServiceMutation.mutate({
        serviceId: serviceDialog.item._id,
        service: {
          ...serviceDialog.item,
          ...serviceFormData,
        },
      });
    }
  };

  return (
    <>
      <LoaderErrWrapper isLoading={isLoading} error={error}>
        <div className="flex justify-end mb-4">
          <Button
            size="sm"
            onClick={() => setServiceDialog({ type: "add" })}
            className="bg-primary hover:bg-primary/90 animate-fade-in"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Service
          </Button>
        </div>
        <div className="space-y-6">
          {services.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4 border-b border-border pb-3 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-lg text-foreground">
                      {s.title}
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      ({s.titleHindi})
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Department:{" "}
                    <span className="font-semibold text-primary">
                      {s.department}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setServiceDialog({ type: "edit", item: s })}
                    className="h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setServiceDialog({ type: "delete", item: s })}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSubServiceDialog({ type: "add", item: s })}
                    className="border-primary text-primary hover:bg-primary/5 hover:text-primary-foreground transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Sub-service
                  </Button>
                </div>
              </div>

              <SubServicesTable
                service={s}
                dialog={subServiceDialog}
                setDialog={setSubServiceDialog}
              />
            </div>
          ))}
        </div>
      </LoaderErrWrapper>

      {serviceDialog && serviceDialog.type === "delete" && (
        <DeleteDialog
          title={serviceDialog.item.title}
          onDelete={handleSaveService}
          onClose={() => setServiceDialog(null)}
          deleting={deleteServiceMutation.isPending}
        />
      )}

      {serviceDialog && serviceDialog.type !== "delete" && (
        <EditDialog
          title={
            serviceDialog.type === "add"
              ? "Add Service"
              : `Edit ${serviceDialog.item?.title || "Record"}`
          }
          onClose={() => setServiceDialog(null)}
          onSave={handleSaveService}
          saving={postServiceMutation.isPending || putServiceMutation.isPending}
        >
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Service Name (English) *</Label>
              <Input
                value={serviceFormData.title}
                onChange={(e) => {
                  setServiceFormData((prev) => ({ ...prev, title: e.target.value }));
                  if (serviceErrors.title)
                    setServiceErrors((prev) => ({ ...prev, title: "" }));
                }}
                placeholder="e.g., Public Works"
                required
              />
              {serviceErrors.title && (
                <p className="text-red-500 text-xs mt-1">{serviceErrors.title}</p>
              )}
            </div>
            <div>
              <Label className="mb-1.5 block">सेवा का नाम (Hindi) *</Label>
              <Input
                value={serviceFormData.titleHindi}
                onChange={(e) => {
                  setServiceFormData((prev) => ({
                    ...prev,
                    titleHindi: e.target.value,
                  }));
                  if (serviceErrors.titleHindi)
                    setServiceErrors((prev) => ({ ...prev, titleHindi: "" }));
                }}
                placeholder="उदा. सार्वजनिक कार्य"
                required
              />
              {serviceErrors.titleHindi && (
                <p className="text-red-500 text-xs mt-1">{serviceErrors.titleHindi}</p>
              )}
            </div>
            <div>
              <Label className="mb-1.5 block">Department *</Label>
              <Input
                value={serviceFormData.department}
                onChange={(e) => {
                  setServiceFormData((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }));
                  if (serviceErrors.department)
                    setServiceErrors((prev) => ({ ...prev, department: "" }));
                }}
                placeholder="e.g., PWD"
                required
              />
              {serviceErrors.department && (
                <p className="text-red-500 text-xs mt-1">{serviceErrors.department}</p>
              )}
            </div>
          </div>
        </EditDialog>
      )}
    </>
  );
}
