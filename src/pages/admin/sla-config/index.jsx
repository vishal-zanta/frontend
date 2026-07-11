import React, { useState } from "react";
import { Plus, X, Check, AlertTriangle } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";

import SlaAnalytics from "./components/SlaAnalytics";
import SlaTable from "./components/SlaTable";
import Form from "./components/Form";
import { useGetSlaconfig } from "./hooks";
import { useGetSubservices } from "../master-data/hooks";
import useGetRoles from "@/hooks/query/useGetRoles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSlaConfig, putSlaConfig, deleteSlaConfig } from "./api";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { QUERY_KEYS } from "@/utils/constants";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import SearchDebounced from "@/components/debounced/SearchDebounced";
import clsx from "clsx";

export default function SLAConfig() {
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const { page, limit, ...pageProps } = usePagination();
  const queryClient = useQueryClient();

  // 1. Fetch SLA configs
  const {
    data: slaApiData,
    isLoading: isSlaLoading,
    error: slaError,
  } = useGetSlaconfig([search, page, limit], {
    search,
    page,
    limit,
  });
  const docs = slaApiData?.data?.data?.docs || [];
  const totalPages = slaApiData?.data?.data?.pagination?.totalPages || 1;

  // 2. Fetch roles
  const {
    data: rolesApiData,
    isLoading: isRolesLoading,
    error: rolesError,
  } = useGetRoles([], { page: 1, limit: 100 });
  const roles = rolesApiData?.data?.docs || [];

  // 3. Fetch subservices for selection dropdown
  const { data: subservicesData } = useGetSubservices(
    [1, 100],
    { page: 1, limit: 100},
    true,
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
    if (sum > 24) {
      getErrorToast({ message: "SLA hours sum cannot exceed 24 hrs" });
      return;
    }

    const payload = {
      subService: dialog.subService,
      escalations: cleanedEscalations,
      officer: !!dialog.officer,
      active: true,
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

  const subServiceOptions = availableSubservices.map((ss) => ({
    label: ss.title || ss.name || "",
    value: ss._id,
  }));

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <SectionTitle
          title="SLA Configuration"
          subtitle="Define SLA timeline per level for each sub-service — breach triggers auto-escalation"
        />

        {/* <LoaderErrWrapper isLoading={isSlaLoading || isRolesLoading} error={slaError || rolesError}> */}
        <SlaAnalytics docs={docs} rolesCount={roles.length} />
        {/* </LoaderErrWrapper> */}

        {/* Search + Add */}
        <div className="flex gap-3 mt-6">
          <SearchDebounced
            handleDebouncedChange={(val) => {
              setSearch(val);
              pageProps.setPage(1);
            }}
            delay={500}
            className="flex-1"
            placeholder="Search sub-service..."
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700"
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
            "bg-white rounded-xl border border-border overflow-hidden mt-6",
            deleteMutation.isPending && "opacity-70 pointer-events-none",
          )}
        >
          <LoaderErrWrapper
            isLoading={isSlaLoading || isRolesLoading}
            error={slaError || rolesError}
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
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
