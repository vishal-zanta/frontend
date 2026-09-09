import React, { useState, useEffect } from "react";
import { Plus, X, Check, AlertTriangle } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";

import SlaAnalytics from "./components/SlaAnalytics";
import SlaTable from "./components/SlaTable";
import Form from "./components/Form";
import { useGetSlaconfig } from "./hooks";
import {
  useGetDepartments,
  useGetServices,
} from "../master-data/hooks";
import useGetRoles from "@/hooks/query/useGetRoles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSlaConfig, putSlaConfig, deleteSlaConfig } from "./api";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { MAX_LIMIT, QUERY_KEYS, USER_ROLES_EXECULDED } from "@/utils/constants";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import SearchDebounced from "@/components/debounced/SearchDebounced";
import clsx from "clsx";
import DeleteDialog from "@/components/DeleteDialog";
import { useLanguage } from "@/context/LanguageContext";

export default function SLAConfig() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [selectedDept, setSelectedDept] = useState("");

  const { page, limit, ...pageProps } = usePagination();
  const queryClient = useQueryClient();

  const {
    data: deptApiData,
    isLoading: deptLoading,
    error: deptError,
  } = useGetDepartments([], {
    page: 1,
    limit: MAX_LIMIT,
  });
  const depts = (deptApiData?.data?.data?.docs || []).map((d) => ({
    label: d.title,
    value: d._id,
  }));

  useEffect(() => {
    if (depts.length > 0 && !selectedDept) {
      setSelectedDept(depts[0].value);
    }
  }, [depts, selectedDept]);

  // 1. Fetch SLA configs
  const {
    data: slaApiData,
    isLoading: isSlaLoading,
    error: slaError,
  } = useGetSlaconfig(
    [search, page, limit, selectedDept],
    {
      search,
      page,
      limit,
      department: selectedDept,
    },
    !!selectedDept,
  );
  const docs = slaApiData?.data?.data?.docs || [];
  const totalPages = slaApiData?.data?.data?.pagination?.totalPages || 1;

  // 2. Fetch roles
  const {
    data: rolesApiData,
    isLoading: isRolesLoading,
    error: rolesError,
  } = useGetRoles(
    [selectedDept],
    { page: 1, limit: MAX_LIMIT, department: selectedDept },
    !!selectedDept,
  );
  const roles = (rolesApiData?.data?.docs || []).filter(
    (r) => !USER_ROLES_EXECULDED.includes(r.designationEnglish),
  );

  // 3. Fetch services for selection dropdown
  const {
    data: servicesData,
    isLoading: isServicesLoading,
    isPending: isServicesPending,
  } = useGetServices(
    [selectedDept],
    { page: 1, limit: MAX_LIMIT, department: selectedDept },
    !!selectedDept,
  );
  const allServices = servicesData?.data?.data?.docs || [];

  // Filter available services for the SLA config select dropdown
  const availableServices = allServices.filter((s) => {
    if (
      editItem &&
      ((editItem.service?._id || editItem.service) === s._id ||
        (editItem.subService?._id || editItem.subService) === s._id)
    ) {
      return true;
    }
    return !docs.some(
      (doc) =>
        (doc.service?._id || doc.service) === s._id ||
        (doc.subService?._id || doc.subService) === s._id,
    );
  });

  const serviceOptions = availableServices.map((s) => ({
    label: s.title || s.name || "",
    value: s._id,
    sla: s.sla,
  }));

  const postMutation = useMutation({
    mutationFn: postSlaConfig,
    onSuccess: () => {
      getSuccessToast("SLA config created successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SLA_CONFIGS] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const putMutation = useMutation({
    mutationFn: putSlaConfig,
    onSuccess: () => {
      getSuccessToast("SLA config updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SLA_CONFIGS] });
      setDialog(null);
      setEditItem(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSlaConfig,
    onSuccess: () => {
      getSuccessToast("SLA config deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SLA_CONFIGS] });
      setDeleteRecord(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const filtered = docs.filter((c) => {
    const title =
      c.service?.title ||
      c.service?.name ||
      c.subService?.title ||
      c.subService?.name ||
      c.service ||
      c.subService ||
      "";
    return !search || title.toLowerCase().includes(search.toLowerCase());
  });

  const handleEdit = (item) => {
    setEditItem(item);
    setDialog({
      service:
        item.service?._id ||
        item.service ||
        item.subService?.service?._id ||
        item.subService?.service ||
        item.subService?._id ||
        item.subService ||
        "",
      escalations: (item.escalations || []).map((e) => ({
        role: e.role?._id || e.role,
        slaHours:
          (e.slaType ?? "hrs") === "days" ? e.slaHours / 24 : e.slaHours,
        slaType: e.slaType ?? "hrs",
      })),
      officer: !!item.officer,
      active: !!item.active,
    });
  };

  const handleDelete = (item) => {
    setDeleteRecord(item);
  };

  const handleConfirmDelete = () => {
    if (deleteRecord) {
      deleteMutation.mutate(deleteRecord._id);
    }
  };

  const handleSaveItem = () => {
    if (!dialog.service) {
      getErrorToast({ message: "Please select a service" });
      return;
    }
    const cleanedEscalations = (dialog.escalations || [])
      .filter(
        (e) =>
          e.slaHours !== "" && e.slaHours !== undefined && e.slaHours !== null,
      )
      .map((s) => ({
        ...s,
        slaHours: s.slaType === "days" ? s.slaHours * 24 : s.slaHours,
      }));

    let sum = 0;
    cleanedEscalations.forEach((e) => {
      sum += e.slaHours;
    });

    const selectedServiceObj = allServices.find((s) => s._id === dialog.service);
    const serviceSla = selectedServiceObj?.sla || 24;
    if (sum > serviceSla) {
      getErrorToast({ message: `SLA hours sum cannot exceed ${serviceSla} hrs` });
      return;
    }

    const payload = {
      service: dialog.service,
      escalations: cleanedEscalations,
      officer: !!dialog.officer,
      active: true,
      department: selectedDept,
    };

    if (editItem) {
      putMutation.mutate({
        id: editItem._id,
        config: payload,
      });
    } else {
      postMutation.mutate(payload);
    }
  };

  return (
    <PortalLayout role="superadmin">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <SectionTitle
          title={t("SLA Configuration", "SLA कॉन्फ़िगरेशन")}
          subtitle={t(
            "Define SLA timeline per level for each service - breach triggers auto-escalation",
            "प्रत्येक सेवा के लिए स्तर अनुसार SLA समय सीमा परिभाषित करें - उल्लंघन पर स्वतः वृद्धि होती है",
          )}
        />

        {/* Analytics summary */}
        <SlaAnalytics docs={docs} rolesCount={roles.length} />

        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-6 sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center flex-1">
            <SearchDebounced
              handleDebouncedChange={(val) => {
                setSearch(val);
                pageProps.setPage(1);
              }}
              delay={500}
              className="w-full sm:flex-1"
              placeholder={t("Search service...", "सेवा खोजें...")}
            />
            <LoaderErrWrapper isLoading={deptLoading}>
              <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto">
                <label className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                  {t("Department:", "विभाग:")}
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    pageProps.setPage(1);
                  }}
                  className="text-xs h-8 w-full sm:w-auto rounded-md border border-input bg-background px-2.5 py-1 font-medium text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-muted/50"
                >
                  {depts.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </LoaderErrWrapper>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto shrink-0"
            disabled={!selectedDept}
            onClick={() => {
              setEditItem(null);
              setDialog({
                service: "",
                escalations: [],
                officer: true,
                active: true,
              });
            }}
          >
            <Plus className="w-4 h-4 mr-1" />{" "}
            {t("Add SLA Config", "SLA कॉन्फ़िगरेशन जोड़ें")}
          </Button>
        </div>

        {/* SLA Table */}
        <div
          className={clsx(
            "bg-card rounded-xl border border-border overflow-hidden mt-6",
            deleteMutation.isPending && "opacity-70 pointer-events-none",
          )}
        >
          <LoaderErrWrapper
            isLoading={isSlaLoading || isRolesLoading || deptLoading}
            error={slaError || rolesError || deptError?.message}
          >
            <SlaTable
              docs={filtered}
              roles={roles}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </LoaderErrWrapper>
          <Pagination
            page={page}
            limit={limit}
            totalPage={totalPages}
            isLoading={isSlaLoading}
            {...pageProps}
          />
          <div className="px-5 py-3 border-t border-border flex items-center justify-between">
            <div className="text-xs text-amber-600 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />{" "}
              {t(
                "Services without an assigned officer will not be visible to citizens",
                "बिना अधिकारी आवंटित सेवाएं नागरिकों को दिखाई नहीं देंगी",
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Dialog */}
        {dialog && (
          <div
            style={{
              margin: 0,
            }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setDialog(null)}
          >
            <div
              className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h3 className="font-bold text-foreground">
                  {editItem
                    ? t("Edit SLA Config", "SLA कॉन्फ़िगरेशन संपादित करें")
                    : t("Add SLA Config", "SLA कॉन्फ़िगरेशन जोड़ें")}
                </h3>
                <button
                  onClick={() => setDialog(null)}
                  className="p-1.5 hover:bg-muted rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5">
                <Form
                  editItem={editItem}
                  dialog={dialog}
                  setDialog={setDialog}
                  roles={roles}
                  serviceOptions={serviceOptions}
                  isServicesPending={isServicesPending || isServicesLoading}
                />
              </div>
              <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDialog(null)}>
                  {t("Cancel", "रद्द करें")}
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleSaveItem}
                  disabled={postMutation.isPending || putMutation.isPending}
                >
                  <Check className="w-4 h-4 mr-1" />{" "}
                  {postMutation.isPending || putMutation.isPending
                    ? t("Saving...", "सहेज रहा है...")
                    : t("Save", "सहेजें")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Dialog */}
        {deleteRecord && (
          <DeleteDialog
            onClose={() => setDeleteRecord(null)}
            onDelete={handleConfirmDelete}
            title={
              deleteRecord.service?.title ||
              deleteRecord.subService?.title ||
              "SLA Config"
            }
            deleting={deleteMutation.isPending}
          />
        )}
      </div>
    </PortalLayout>
  );
}
