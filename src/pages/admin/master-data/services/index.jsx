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
import Filter from "@/components/Filter";
import { useLanguage } from "@/context/LanguageContext";

export default function ServicesTab() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({});
  const { page, limit, ...paginationProps } = usePagination();
  const {
    data: servicesData,
    isLoading,
    error,
  } = useGetServices([page, limit, filters.department], {
    page,
    limit,
    department: filters.department,
  });
  const services = servicesData?.data?.data?.docs || [];
  const totalPages = servicesData?.data?.data?.pagination?.totalPages || 1;
  const [subServiceDialog, setSubServiceDialog] = useState(null);
  const [serviceDialog, setServiceDialog] = useState(null);

  const { data: departmentApiData } = useGetDepartments([1, 500], {
    page: 1,
    limit: MAX_LIMIT,
  });
  const departmentOptions = (departmentApiData?.data?.data?.docs || []).map(
    (d) => ({
      label: d.title || d.name || "",
      value: d._id,
    }),
  );

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
    const finalSla =
      formData.slaType === "days"
        ? Number(formData.sla) * 24
        : Number(formData.sla);

    const payload = {
      ...formData,
      sla: finalSla,
      slaType: formData.slaType || "hrs",
      geoTagged: Boolean(formData.geoTagged),
      fieldVisit: Boolean(formData.fieldVisit),
    };

    if (serviceDialog.type === "add") {
      postServiceMutation.mutate(payload);
    } else {
      putServiceMutation.mutate({
        serviceId: serviceDialog.item._id,
        service: {
          ...serviceDialog.item,
          ...payload,
        },
      });
    }
  };

  const slaType = serviceDialog?.item?.slaType ?? "hrs";
  const initialValues = {
    title: serviceDialog?.item?.title || "",
    titleHindi: serviceDialog?.item?.titleHindi || "",
    department:
      serviceDialog?.item?.department?._id ||
      serviceDialog?.item?.department ||
      "",
    departmentObj: serviceDialog?.item?.department || {},
    sla:
      serviceDialog?.item?.sla !== undefined && serviceDialog?.item?.sla !== null
        ? slaType === "days"
          ? serviceDialog.item.sla / 24
          : serviceDialog.item.sla
        : 24,
    slaType: slaType,
    geoTagged: Boolean(serviceDialog?.item?.geoTagged ?? false),
    fieldVisit: Boolean(serviceDialog?.item?.fieldVisit ?? false),
  };

  const isSaving =
    postServiceMutation.isPending || putServiceMutation.isPending;

  return (
    <>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-0">
          <h3 className="font-bold text-foreground ">{t("Services", "सेवाएं")}</h3>
          <div className="flex items-center gap-2">
            <Filter
              filters={filters}
              setFilters={(val) => {
                setFilters(val);
                paginationProps.setPage(1);
              }}
              filterOptions={[
                {
                  label: t("Department", "विभाग"),
                  filterKey: "department",
                  options: departmentOptions,
                },
              ]}
            />
            <Button
              size="sm"
              onClick={() => setServiceDialog({ type: "add" })}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-1" /> {t("Add Service", "सेवा जोड़ें")}
            </Button>
          </div>
        </div>
        <LoaderErrWrapper isLoading={isLoading} error={error}>
          <div className="overflow-x-auto">
            <ServiceTable
              services={services}
              setServiceDialog={setServiceDialog}
              subServiceDialog={subServiceDialog}
              setSubServiceDialog={setSubServiceDialog}
            />
          </div>
          <Pagination
            page={page}
            limit={limit}
            totalPage={totalPages}
            isLoading={isLoading}
            {...paginationProps}
          />
        </LoaderErrWrapper>
      </div>

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
