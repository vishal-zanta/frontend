import React, { useEffect, useState } from "react";
import { Plus, X, Check } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MySelect from "@/components/inputs/MySelect";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";

import EscalationFlow from "./workflow-levels/EscalationFlow";
import WorkflowTable from "./workflow-levels/WorkflowTable";
import { useGetWorkflow } from "./workflow-levels/hooks";
import useGetRoles from "@/hooks/query/useGetRoles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postWorkflowLevel,
  putWorkflowLevel,
  deleteWorkflowLevel,
  reorderWorkflowLevels,
} from "./workflow-levels/api";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { QUERY_KEYS } from "@/utils/constants";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";


export default function WorkflowConfig() {
  const [dialog, setDialog] = useState(null);
  const [workflowList, setWorkflowList] = useState([]);
  const [editLevel, setEditLevel] = useState(null);

  const { page, limit, ...pageProps } = usePagination();
  const queryClient = useQueryClient();

  // 1. Fetch workflow levels
  const {
    data: workflowApiData,
    isLoading: isWorkflowLoading,
    error: workflowError,
  } = useGetWorkflow([page, limit], { page, limit });
  const docs = workflowApiData?.data?.data?.docs || [];
  const totalPages = workflowApiData?.data?.data?.pagination?.totalPages || 1;

  // 2. Fetch roles
  const { data: rolesApiData } = useGetRoles([], { page: 1, limit: 100 });

  const postMutation = useMutation({
    mutationFn: postWorkflowLevel,
    onSuccess: () => {
      getSuccessToast("Workflow level added successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKFLOW_LEVELS] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const putMutation = useMutation({
    mutationFn: putWorkflowLevel,
    onSuccess: () => {
      getSuccessToast("Workflow level updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKFLOW_LEVELS] });
      setDialog(null);
      setEditLevel(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWorkflowLevel,
    onSuccess: () => {
      getSuccessToast("Workflow level deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKFLOW_LEVELS] });
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderWorkflowLevels,
    onSuccess: () => {
      getSuccessToast("Workflow levels reordered successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKFLOW_LEVELS] });
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleEdit = (level) => {
    setEditLevel(level);
    setDialog({
      role: level.role?._id || level.role || "",
      description: level.description || "",
    });
  };

  const handleDelete = (level) => {
    if (
      confirm(
        `Are you sure you want to delete Level ${level.order} (${
          level.role?.designationEnglish || "this level"
        })?`,
      )
    ) {
      deleteMutation.mutate(level._id);
    }
  };

  const handleSaveLevel = () => {
    if (!dialog.role) {
      getErrorToast({ message: "Please specify a Role" });
      return;
    }

    if (editLevel) {
      putMutation.mutate({
        id: editLevel._id,
        level: {
          role: dialog.role,
          description: dialog.description,
        },
      });
    } else {
      const payloadOrder =
        docs.reduce((max, d) => Math.max(max, d.order || 0), 0) + 1;
      const selectedRole = (rolesApiData?.data?.docs || []).find(
        (r) => r._id === dialog.role,
      );
      const levelName = selectedRole
        ? selectedRole.designationEnglish
        : `Level ${payloadOrder}`;

      const payload = {
        level: levelName,
        order: payloadOrder,
        role: dialog.role,
        description: dialog.description,
        active: true,
      };
      postMutation.mutate(payload);
    }
  };

  const handleOrderChange = (oldIndex, newIndex) => {
    if (oldIndex === newIndex) return;
    const reordered = Array.from(workflowList);
    const [removed] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, removed);

    // Optimistically update local state for a smooth UI transition
    setWorkflowList(reordered);

    const updates = reordered.map((item, index) => ({
      id: item._id,
      order: index + 1,
    }));

    reorderMutation.mutate(updates);
  };

  const roleOptions = (rolesApiData?.data?.docs || []).map((r) => ({
    label: r.designationEnglish,
    value: r._id,
  }));

  useEffect(() => {
    if (workflowApiData?.data) {
      const items = (workflowApiData?.data?.data?.docs || []).map((doc) => ({
        ...doc,
        id: doc._id,
      }));
      setWorkflowList(items);
    }
  }, [workflowApiData?.data?.data?.docs]);


  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <SectionTitle
          title="Workflow Configuration"
          subtitle="Define escalation hierarchy: Complaint Initiator → L1 → L2 → Zone → ULB → Division → SUDA"
        />

        {/* Visual workflow */}
        {/* <LoaderErrWrapper isLoading={isWorkflowLoading} error={workflowError}> */}
        <EscalationFlow levels={docs} />
        {/* </LoaderErrWrapper> */}

        {/* Config table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden mt-6">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-foreground">Workflow Levels</h3>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setEditLevel(null);
                setDialog({ role: "", description: "" });
              }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Level
            </Button>
          </div>

          <LoaderErrWrapper isLoading={isWorkflowLoading} error={workflowError}>
            <WorkflowTable
              docs={workflowList}
              setDocs={setWorkflowList}
              onEdit={handleEdit}
              onDelete={handleDelete}
              handleOrderChange={handleOrderChange}
            />
          </LoaderErrWrapper>

          <Pagination
            page={page}
            limit={limit}
            totalPage={totalPages}
            {...pageProps}
          />
        </div>

        {/* Rules */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h4 className="font-bold text-amber-800 mb-2 text-sm">
            ⚠ Workflow Rules
          </h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>
              • If action not taken within SLA time, ticket auto-escalates to
              next level with SMS notification
            </li>
            <li>
              • Every SLA level must have at least 1 officer assigned — or the
              ticket will not be visible
            </li>
            <li>
              • Officers can only be added manually due to location restriction
            </li>
            <li>
              • If a ticket remains unassigned, it can be reassigned later by
              the admin
            </li>
            <li>• Complaints can be transferred department-to-department</li>
          </ul>
        </div>

        {/* Add/Edit Dialog */}
        {dialog && (
          <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setDialog(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h3 className="font-bold text-foreground">
                  {editLevel ? "Edit Level" : "Add Workflow Level"}
                </h3>
                <button
                  onClick={() => setDialog(null)}
                  className="p-1.5 hover:bg-muted rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <Label className="mb-1.5 block">Role *</Label>
                  <MySelect
                    options={roleOptions}
                    value={dialog.role || ""}
                    onValueChange={(val) => setDialog({ ...dialog, role: val })}
                    placeholder="Select Role..."
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Description</Label>
                  <Input
                    value={dialog.description || ""}
                    onChange={(e) =>
                      setDialog({ ...dialog, description: e.target.value })
                    }
                    placeholder="Description..."
                  />
                </div>
              </div>
              <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDialog(null)}>
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleSaveLevel}
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
