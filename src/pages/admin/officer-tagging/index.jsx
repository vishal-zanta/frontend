import React, { useState } from "react";
import { Plus } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import SearchDebounced from "@/components/debounced/SearchDebounced";
import OfficerTagAnalytics from "./components/OfficerTagAnalytics";
import OfficerTagTable from "./components/OfficerTagTable";
import QuickTagOfficer from "./components/QuickTagOfficer";
import Form from "./components/Form";

import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import RhfWrapper from "@/components/RhfWrapper";

import { useGetOfficerTag } from "./hooks";
import { useGetSubservices } from "../master-data/hooks";
import { useGetUsers } from "../user-management/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postOfficerTagging,
  putOfficerTagging,
  deleteOfficerTagging,
} from "./api";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { QUERY_KEYS } from "@/utils/constants";

export default function OfficerTagging() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const { page, limit, ...pageProps } = usePagination();
  const queryClient = useQueryClient();

  const {
    data: taggingsApiData,
    isLoading,
    error,
  } = useGetOfficerTag([search, page, limit], {
    search,
    page,
    limit,
  });
  const docs = taggingsApiData?.data?.data?.docs || [];
  const totalPages = taggingsApiData?.data?.data?.pagination?.totalPages || 1;

  const { data: subservicesData } = useGetSubservices(
    [1, 100],
    { page: 1, limit: 100 },
    true,
  );
  const subservicesOptions = (subservicesData?.data?.data?.docs || []).map(
    (s) => ({
      label: s.title || s.name || "",
      value: s._id,
    }),
  );

  const { data: usersApiDataUntagged} = useGetUsers([1, 100, "untagged"], {
    page: 1,
    limit: 100,
    untagged: true,
  });
  const userOptionsUnTagged = (usersApiDataUntagged?.data?.data?.docs || []).map((u) => ({
    label: `${u.name} (${u.role?.designationEnglish || ""})`,
    value: u._id,
  }));
    const { data: usersApiData } = useGetUsers([1, 100], {
    page: 1,
    limit: 100,
    // untagged: true,
  });
  const userOptions = (usersApiData?.data?.data?.docs || []).map((u) => ({
    label: `${u.name} (${u.role?.designationEnglish || ""})`,
    value: u._id,
  }));


  const filtered = docs.filter(
    (t) =>
      !search || t.officer?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const postMutation = useMutation({
    mutationFn: postOfficerTagging,
    onSuccess: () => {
      getSuccessToast("Officer tagging added successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.OFFICER_TAGGINGS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
        refetchType: "active"
      })
      setDialogOpen(false);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const putMutation = useMutation({
    mutationFn: putOfficerTagging,
    onSuccess: () => {
      getSuccessToast("Officer tagging updated successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.OFFICER_TAGGINGS],
      });
      setDialogOpen(false);
      setEditItem(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOfficerTagging,
    onSuccess: () => {
      getSuccessToast("Officer tagging deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.OFFICER_TAGGINGS],
      });
      setDeleteRecord(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleQuickSave = (data) => {
    postMutation.mutate(data);
  };

  const handleFormSubmit = (formData) => {
    const payload = {
      officer: formData.officer,
      services: formData.services,
      wards: formData.wards
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean),
    };

    if (editItem) {
      putMutation.mutate({
        id: editItem._id,
        tagging: payload,
      });
    } else {
      postMutation.mutate(payload);
    }
  };

  const handleDelete = (item) => {
    setDeleteRecord(item);
  };

  const handleConfirmDelete = () => {
    if (deleteRecord) {
      deleteMutation.mutate(deleteRecord._id);
    }
  };

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <SectionTitle
          title="Officer Tagging"
          subtitle="Tag officers to multiple services and multiple wards — manually assigned due to location restriction"
        />

        <OfficerTagAnalytics
          tagging={docs}
          officers={userOptions.map((o) => ({
            designation: o.label.includes("L1") ? "l1-officer" : "l2-officer",
          }))}
        />

        {/* Search + Add */}
        <div className="flex gap-3">
          <SearchDebounced
            handleDebouncedChange={(val) => {
              setSearch(val);
              pageProps.setPage(1);
            }}
            delay={500}
            className="flex-1"
            placeholder="Search officer by name..."
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setEditItem(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1" /> Tag New Officer
          </Button>
        </div>

        {/* Tagging table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <LoaderErrWrapper isLoading={isLoading} error={error}>
            <OfficerTagTable
              tagging={filtered}
              setEditItem={(item) => {
                setEditItem(item);
                setDialogOpen(true);
              }}
              setDialog={() => {}}
              handleDelete={handleDelete}
            />
          </LoaderErrWrapper>
          <Pagination
            page={page}
            limit={limit}
            totalPage={totalPages}
            {...pageProps}
          />
        </div>

        {/* Add tagging form */}
        <QuickTagOfficer
          officers={userOptionsUnTagged}
          subservices={subservicesOptions}
          handleSaveTagging={handleQuickSave}
        />

        {/* Add/Edit Dialog */}
        {dialogOpen && (
          <EditDialog
            isHideFooter
            onClose={() => {
              setDialogOpen(false);
              setEditItem(null);
            }}
            title={editItem ? "Edit Tagging" : "Tag New Officer"}
          >
            <RhfWrapper
              initialValues={
                editItem
                  ? {
                      officer: editItem.officer?._id || editItem.officer || "",
                      services: (editItem.services || []).map(
                        (s) => s._id || s,
                      ),
                      wards: (editItem.wards || []).join(", "),
                    }
                  : {
                      officer: "",
                      services: [],
                      wards: "",
                    }
              }
              onSubmit={handleFormSubmit}
            >
              <Form
                isEdit={!!editItem}
                isLoading={postMutation.isPending || putMutation.isPending}
                userOptions={userOptions}
                subservicesOptions={subservicesOptions}
                onCancel={() => {
                  setDialogOpen(false);
                  setEditItem(null);
                }}
              />
            </RhfWrapper>
          </EditDialog>
        )}

        {/* Delete Dialog */}
        {deleteRecord && (
          <DeleteDialog
            onClose={() => setDeleteRecord(null)}
            onDelete={handleConfirmDelete}
            title="Remove Officer Tagging"
            message={`Are you sure you want to remove the tagging for "${deleteRecord.officer?.name || "this officer"}"?`}
          />
        )}

        {/* Rules */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h4 className="font-bold text-amber-800 mb-2 text-sm">
            ⚠ Officer Tagging Rules
          </h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>
              • A single officer can be tagged to multiple services and multiple
              wards
            </li>
            <li>
              • Every SLA must have at least 1 officer — or the ticket will not
              be visible
            </li>
            <li>
              • Officers can only be added manually due to location restriction
            </li>
            <li>
              • If a ticket remains unassigned, it can be reassigned later
            </li>
          </ul>
        </div>
      </div>
    </PortalLayout>
  );
}
