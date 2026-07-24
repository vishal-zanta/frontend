import React, { useState, useEffect } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";

import EscalationFlow from "./components/EscalationFlow";
import WorkflowTable from "./components/WorkflowTable";
import { useGetWorkflowByDepartment } from "./hooks";
import useGetRoles from "@/hooks/query/useGetRoles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postWorkflowLevel } from "./api";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { MAX_LIMIT, QUERY_KEYS, USER_ROLES_EXECULDED } from "@/utils/constants";
import usePagination from "@/hooks/usePagination";
import WorkflowRules from "./components/WorkflowRules";
import WorkflowForm from "./components/WorkflowForm";
import WorkflowFilter from "./components/WorkflowFilter";
import { useGetDepartments } from "../master-data/hooks";
import DeleteDialog from "@/components/DeleteDialog";
import EditDialog from "@/components/EditDialog";

export default function WorkflowConfig() {
  const [dialog, setDialog] = useState(null); // { type: "add"|"edit", item? }
  const [reOrderDialog, setReOrderDialog] = useState(null);
  const [workflowList, setWorkflowList] = useState([]);
  const [editLevel, setEditLevel] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [filter, setFilter] = useState({
    department: "",
  });

  const { page, limit } = usePagination();
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
    if (depts.length > 0 && !filter.department) {
      setFilter({ department: depts[0].value });
    }
  }, [depts, filter.department]);

  // 1. Fetch workflow levels by department
  const {
    data: workflowApiData,
    isLoading: isWorkflowLoading,
    error: workflowError,
  } = useGetWorkflowByDepartment(
    [page, limit, filter.department],
    {
      page,
      limit,
      department: filter.department,
    },
    !!filter.department,
  );

  // 2. Fetch roles
  const { data: rolesApiData } = useGetRoles(
    [filter.department],
    { page: 1, limit: MAX_LIMIT, department: filter.department },
    !!filter.department,
  );

  const postMutation = useMutation({
    mutationFn: postWorkflowLevel,
    onSuccess: () => {
      getSuccessToast("Workflow updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKFLOW_LEVELS] });
      setDialog(null);
      setEditLevel(null);
      setDeleteRecord(null);
      setReOrderDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleEdit = (level) => {
    setEditLevel(level);
    setDialog({
      type: "edit",
      item: level,
    });
  };

  const handleDelete = (level) => {
    setDeleteRecord(level);
  };

  const handleConfirmDelete = () => {
    if (deleteRecord) {
      const updated = workflowList.filter(
        (lvl) => lvl._id !== deleteRecord._id,
      );
      const payloadLevels = updated.map((lvl, index) => ({
        role: lvl.role?._id || lvl.role,
        order: index + 1,
        description: lvl.description || "",
      }));

      postMutation.mutate({
        department: filter.department,
        levels: payloadLevels,
      });
    }
  };

  const handleSaveLevel = (formData) => {
    let updated;
    if (editLevel) {
      // Edit level
      updated = workflowList.map((lvl) => {
        if (lvl._id === editLevel._id) {
          return {
            ...lvl,
            role: formData.role,
            description: formData.description,
          };
        }
        return lvl;
      });
    } else {
      // Add level
      const payloadOrder =
        workflowList.reduce((max, d) => Math.max(max, d.order || 0), 0) + 1;
      const newLvl = {
        role: formData.role,
        order: payloadOrder,
        description: formData.description,
      };
      updated = [...workflowList, newLvl];
    }

    const payloadLevels = updated.map((lvl, index) => ({
      role: lvl.role?._id || lvl.role,
      order: index + 1,
      description: lvl.description || "",
    }));

    postMutation.mutate({
      department: filter.department,
      levels: payloadLevels,
    });
  };

  const handleOrderChange = (oldIndex, newIndex, isPopupConfirmed = false, oldWorkFlowList = null) => {
    if (oldIndex === newIndex) return;
    // console.log({workflowList, oldWorkFlowList, isPopupConfirmed});

    if (!isPopupConfirmed) {
      setReOrderDialog({
        oldIndex,
        newIndex,
        workflowList : [...workflowList],
      });
      return;
    }
    let newWorkflowList = oldWorkFlowList ?? workflowList;
    // console.log({workflowList, oldWorkFlowList, isPopupConfirmed, newWorkflowList});

    const reordered = Array.from(newWorkflowList);
    const [removed] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, removed);

    const updated = reordered.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    // Update local state for responsiveness
    setWorkflowList(updated);

    const payloadLevels = updated.map((lvl) => ({
      role: lvl.role?._id || lvl.role,
      order: lvl.order,
      description: lvl.description || "",
    }));

    postMutation.mutate({
      department: filter.department,
      levels: payloadLevels,
    });
  };

  const allRoleOptions = (rolesApiData?.data?.docs || [])
    .filter((r) => !USER_ROLES_EXECULDED.includes(r?.designationEnglish))
    .map((r) => ({
      label: r.designationEnglish,
      value: r._id,
    }));

  const roleOptions = editLevel
    ? allRoleOptions
    : allRoleOptions.filter(
        (opt) =>
          !workflowList.some((w) => (w.role?._id || w.role) === opt.value),
      );

  useEffect(() => {
    if (workflowApiData?.data?.data) {
      const levelsArray = workflowApiData.data.data.levels || [];
      const deptObj = workflowApiData.data.data.department;
      const mapped = levelsArray.map((lvl) => ({
        ...lvl,
        id: lvl._id || lvl.id,
        department: deptObj,
      }));
      setWorkflowList(mapped);
    } else {
      setWorkflowList([]);
    }
  }, [workflowApiData?.data?.data]);

  const initialValues = {
    role: dialog?.item?.role?._id || dialog?.item?.role || "",
    description: dialog?.item?.description || "",
  };
  // console.log({ editLevel });
  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <SectionTitle title="Workflow Configuration" subtitle="" />

        {/* Visual workflow */}
        <EscalationFlow levels={workflowList} />

        {/* Config table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mt-6">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-foreground">Workflow Levels</h3>
            <div className="flex items-center gap-2">
              <LoaderErrWrapper isLoading={deptLoading}>
                <WorkflowFilter
                  filterOptions={[
                    {
                      label: "Departments",
                      options: depts,
                      filterKey: "department",
                    },
                  ]}
                  filter={filter}
                  setFilter={setFilter}
                />
              </LoaderErrWrapper>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  setEditLevel(null);
                  setDialog({ type: "add" });
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Level
              </Button>
            </div>
          </div>

          <LoaderErrWrapper
            isLoading={isWorkflowLoading || deptLoading}
            error={workflowError || deptError}
          >
            <WorkflowTable
              docs={workflowList}
              setDocs={setWorkflowList}
              onEdit={handleEdit}
              onDelete={handleDelete}
              handleOrderChange={handleOrderChange}
            />
          </LoaderErrWrapper>
        </div>

        {/* Rules */}
        <WorkflowRules />

        {/* Add/Edit Dialog */}
        {dialog && (
          <div
            style={{
              marginTop: 0,
            }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 "
            onClick={() => setDialog(null)}
          >
            <WorkflowForm
              editLevel={editLevel}
              roleOptions={roleOptions}
              initialValues={initialValues}
              handleSubmit={handleSaveLevel}
              onClose={() => setDialog(null)}
              isPending={postMutation.isPending}
            />
          </div>
        )}
        {reOrderDialog && (
          <EditDialog
            onSave={() =>
              handleOrderChange(
                reOrderDialog.oldIndex,
                reOrderDialog.newIndex,
                true,
                reOrderDialog.workflowList
              )
            }
            onClose={() => {
              reOrderDialog.workflowList &&
                setWorkflowList(reOrderDialog.workflowList);
              setReOrderDialog(null);
            }}
            title="Reorder Workflow Level"
            saving={postMutation.isPending}
          >
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="text-foreground font-medium">
                Are you sure you want to change the sequence of this escalation level?
              </p>

            

             
            </div>
          </EditDialog>
        )}

        {/* Delete Dialog */}
        {deleteRecord && (
          <DeleteDialog
            onClose={() => setDeleteRecord(null)}
            onDelete={handleConfirmDelete}
            title={`Level ${deleteRecord.order}`}
            deleting={postMutation.isPending}
          />
        )}
      </div>
    </PortalLayout>
  );
}
