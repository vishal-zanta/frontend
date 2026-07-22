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
import { useGetSubservices, useGetDepartments } from "../master-data/hooks";
import useGetRoles from "@/hooks/query/useGetRoles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSlaConfig, putSlaConfig, deleteSlaConfig } from "./api";
import { getErrorToast, getSuccessToast  } from "@/utils/helpers";
import { MAX_LIMIT, QUERY_KEYS, USER_ROLES_EXECULDED } from "@/utils/constants";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import SearchDebounced from "@/components/debounced/SearchDebounced";
import clsx from "clsx";

export default function SLAConfig() {
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [selectedDept, setSelectedDept] = useState("");

  const { page, limit, ...pageProps } = usePagination();
  const queryClient = useQueryClient();

  const { data: deptApiData, isLoading: deptLoading, error: deptError } = useGetDepartments([], {
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
  } = useGetSlaconfig([search, page, limit, selectedDept], {
    search,
    page,
    limit,
    department: selectedDept,
  }, !!selectedDept);
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
    !!selectedDept
  );
  const roles = (rolesApiData?.data?.docs || []).filter(
    (r) => !USER_ROLES_EXECULDED.includes(r.designationEnglish)
  );

  // 3. Fetch subservices for selection dropdown
  const { data: subservicesData } = useGetSubservices(
    [selectedDept],
    { page: 1, limit: MAX_LIMIT, department: selectedDept },
    !!selectedDept,
  );
  const subservices = subservicesData?.data?.data?.docs || [];

  // Filter available subservices for the SLA config select dropdown
  const availableSubservices = subservices.filter((ss) => {
    if (
      editItem &&
      (editItem.subService?._id || editItem.subService) === ss._id
    ) {
      return true;
    }
    return !docs.some(
      (doc) => (doc.subService?._id || doc.subService) === ss._id,
    );
  });

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
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const filtered = docs.filter((c) => {
    const title =
      c.subService?.title || c.subService?.name || c.subService || "";
    return !search || title.toLowerCase().includes(search.toLowerCase());
  });

  const handleEdit = (item) => {
    setEditItem(item);
    setDialog({
      subService: item.subService?._id || item.subService,
      escalations: (item.escalations || []).map((e) => ({
        role: e.role?._id || e.role,
        slaHours: e.slaHours,
      })),
      officer: !!item.officer,
      active: !!item.active,
    });
  };

  const handleDelete = (item) => {
    if (
      confirm(
        `Are you sure you want to delete the SLA config for "${
          item.subService?.title || "this sub-service"
        }"?`,
      )
    ) {
      deleteMutation.mutate(item._id);
    }
  };

    const subServiceOptions = availableSubservices.map((ss) => ({
    label: ss.title || ss.name || "",
    value: ss._id,
    sla : ss.sla
  }));

  const handleSaveItem = () => {
    if (!dialog.subService) {
      getErrorToast({ message: "Please select a sub-service" });
      return;
    }

    const cleanedEscalations = (dialog.escalations || []).filter(
      (e) =>
        e.slaHours !== "" && e.slaHours !== undefined && e.slaHours !== null,
    );
    let sum = 0;
    cleanedEscalations.forEach((e) => {
      sum += e.slaHours;
    });
    const ss = subServiceOptions.find(s=>s.value == dialog.subService)?.sla || 24
    if (sum > ss) {
      getErrorToast({ message: `SLA hours sum cannot exceed ${ss} hrs` });
      return;
    }

    const payload = {
      subService: dialog.subService,
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
      <div className="p-6 space-y-6">
        <SectionTitle
          title="SLA Configuration"
          subtitle="Define SLA timeline per level for each sub-service - breach triggers auto-escalation"
        />

        {/* <LoaderErrWrapper isLoading={isSlaLoading || isRolesLoading} error={slaError || rolesError}> */}
        <SlaAnalytics docs={docs} rolesCount={roles.length} />
        {/* </LoaderErrWrapper> */}

        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:items-center">
         

          <SearchDebounced
            handleDebouncedChange={(val) => {
              setSearch(val);
              pageProps.setPage(1);
            }}
            delay={500}
            className="flex-1"
            placeholder="Search sub-service..."
          />
          <LoaderErrWrapper isLoading={deptLoading}>

         
           <div className="flex items-center gap-1.5 shrink-0">
            <label className="text-xs font-semibold text-muted-foreground">
              Department:
            </label>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                pageProps.setPage(1);
              }}
              className="text-xs h-8 rounded-md border border-input bg-background px-2.5 py-1 font-medium text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-muted/50"
            >
              {depts.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
           </LoaderErrWrapper>
          <Button
            className="bg-primary hover:bg-primary/90"
            disabled={!selectedDept}
            onClick={() => {
              setEditItem(null);
              setDialog({
                subService: "",
                escalations: [],
                officer: true,
                active: true,
              });
            }}
          >
            <Plus className="w-4 h-4 mr-1" /> Add SLA Config
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
              <AlertTriangle className="w-3.5 h-3.5" /> Sub-services without an
              assigned officer will not be visible to citizens
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
                  {editItem ? "Edit SLA Config" : "Add SLA Config"}
                </h3>
                <button
                  onClick={() => setDialog(null)}
                  className="p-1.5 hover:bg-muted rounded-lg"
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
                  subServiceOptions={subServiceOptions}
                />
              </div>
              <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDialog(null)}>
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleSaveItem}
                  disabled={postMutation.isPending || putMutation.isPending}
                >
                  <Check className="w-4 h-4 mr-1" /> Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
