import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { useGetServices, useGetDepartments } from "../hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService, putService, deleteService } from "../api";
import { MAX_LIMIT, QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import Pagination from "@/components/Pagination";
import usePagination from "@/hooks/usePagination";
import ServiceTable from "./components/ServiceTable";
import ServiceForm from "./components/ServiceForm";

export default function ServicesTab() {
  const queryClient = useQueryClient();
  const { page, limit, ...paginationProps } = usePagination();
  const { data: servicesData, isLoading, error } = useGetServices([page, limit], { page, limit });
  const services = servicesData?.data?.data?.docs || [];
  const totalPages = servicesData?.data?.data?.pagination?.totalPages || 1;
  const [subServiceDialog, setSubServiceDialog] = useState(null);
  const [serviceDialog, setServiceDialog] = useState(null);

  const { data: departmentApiData } = useGetDepartments([1, 500], { page: 1, limit: MAX_LIMIT });
  const departmentOptions = (departmentApiData?.data?.data?.docs || []).map(d => ({
    label: d.title,
    value: d._id
  }));

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

  const handleSubmitService = (formData) => {
    if (serviceDialog.type === "add") {
      postServiceMutation.mutate(formData);
    } else {
      putServiceMutation.mutate({
        serviceId: serviceDialog.item._id,
        service: {
          ...serviceDialog.item,
          ...formData,
        },
      });
    }
  };

  const initialValues = {
    title: serviceDialog?.item?.title || "",
    titleHindi: serviceDialog?.item?.titleHindi || "",
    department: serviceDialog?.item?.department?._id || serviceDialog?.item?.department || "",
  };

  const isSaving = postServiceMutation.isPending || putServiceMutation.isPending;

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
        <Pagination
          page={page}
          limit={limit}
          totalPage={totalPages}
          isLoading={isLoading}
          {...paginationProps}
        />
      </LoaderErrWrapper>

      {serviceDialog && serviceDialog.type === "delete" && (
        <DeleteDialog
          title={serviceDialog.item.title}
          onDelete={() => deleteServiceMutation.mutate(serviceDialog.item._id)}
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
          isHideFooter={true}
        >
          <ServiceForm
            initialValues={initialValues}
            handleSubmit={handleSubmitService}
            onClose={() => setServiceDialog(null)}
            saving={isSaving}
            departmentOptions={departmentOptions}
          />
        </EditDialog>
      )}
    </>
  );
}
