import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { useGetServices } from "../hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService, putService, deleteService } from "../api";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import SubServicesTable from "./components/SubServicesTable";
import Pagination from "@/components/Pagination";
import usePagination from "@/hooks/usePagination";
import ServiceTable from "./components/ServiceTable";
import ServiceForm from "./components/ServiceForm";

export default function ServicesTab() {
  const queryClient = useQueryClient();
  const { page, limit, ...paginationProps } = usePagination();
  const { data: servicesData, isLoading, error } = useGetServices([page, limit], {page, limit});
  const services = servicesData?.data?.data?.docs || [];
  const totalPages = servicesData?.data?.data?.pagination?.totalPages || 1
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
       <ServiceTable
        services={services}
        setServiceDialog={setServiceDialog}
        subServiceDialog={subServiceDialog}
        setSubServiceDialog={setSubServiceDialog}
       />
        <Pagination page={page} limit={limit}
        totalPage={totalPages}
        {...paginationProps} />
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
        <ServiceForm
        serviceErrors={serviceErrors}
        serviceFormData={serviceFormData}
        setServiceFormData={setServiceFormData}
        setServiceErrors={setServiceErrors}
        />
        </EditDialog>
      )}
    </>
  );
}
