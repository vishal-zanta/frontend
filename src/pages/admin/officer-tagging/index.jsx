import React, { useState, useEffect } from "react";
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
import { officerTaggingSchema } from "./schema";

import { useGetOfficerTag } from "./hooks";
import { useGetDepartments } from "../master-data/hooks";
import { useGetUsers } from "../user-management/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postOfficerTagging,
  putOfficerTagging,
  deleteOfficerTagging,
} from "./api";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { MAX_LIMIT, QUERY_KEYS, USER_ROLES_EXECULDED } from "@/utils/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function OfficerTagging() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const {
    data: taggingsApiData,
    isLoading,
    error,
  } = useGetOfficerTag(
    [search, page, limit, selectedDept],
    {
      search,
      page,
      limit,
      department: selectedDept,
    },
    !!selectedDept,
  );
  const docs = taggingsApiData?.data?.data?.docs || [];
  const totalPages = taggingsApiData?.data?.data?.pagination?.totalPages || 1;



  const { data: usersApiDataUntagged } = useGetUsers(
    [1, MAX_LIMIT, "untagged", selectedDept],
    {
      page: 1,
      limit: MAX_LIMIT,
      untagged: true,
      department: selectedDept,
    },
    !!selectedDept,
  );
  const userOptionsUnTagged = (usersApiDataUntagged?.data?.data?.docs || [])
    .filter(
      (u) => !USER_ROLES_EXECULDED.includes(u.role?.designationEnglish || ""),
    )
    .map((u) => ({
      label: `${u.name} (${u.role?.designationEnglish || ""})`,
      value: u._id,
    }));
  const { data: usersApiData } = useGetUsers(
    [1, MAX_LIMIT, selectedDept],
    {
      page: 1,
      limit: MAX_LIMIT,
      department: selectedDept,
    },
    !!selectedDept,
  );
  const userOptions = (usersApiData?.data?.data?.docs || [])
    .filter(
      (u) => !USER_ROLES_EXECULDED.includes(u.role?.designationEnglish || ""),
    )
    .map((u) => ({
      label: `${u.name} (${u.role?.designationEnglish || ""})`,
      value: u._id,
      apiData: u,
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
        refetchType: "active",
      });
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
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
        refetchType: "active",
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
      divisions: formData.divisions,
      subdivisions: formData.subdivisions,
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
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <SectionTitle
          title={t("Officer Tagging", "अधिकारी मैपिंग")}
          subtitle={t(
            "Tag officers to multiple services and multiple subdivisions - manually assigned due to location restriction",
            "स्थान प्रतिबंध के कारण अधिकारियों को कई सेवाओं और कई अनुमंडलों से मैप करें",
          )}
        />

        <OfficerTagAnalytics
          tagging={docs}
          officers={userOptions.map((o) => ({
            designation: o.label.includes("L1") ? "l1-officer" : "l2-officer",
          }))}
        />

        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch xs:items-center flex-1">
            <SearchDebounced
              handleDebouncedChange={(val) => {
                setSearch(val);
                pageProps.setPage(1);
              }}
              delay={500}
              className="w-full xs:flex-1"
              placeholder={t(
                "Search officer by name...",
                "नाम से अधिकारी खोजें...",
              )}
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
                  className="text-xs h-8 w-full xs:w-auto rounded-md border border-input bg-background px-2.5 py-1 font-medium text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-muted/50"
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
              setDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />{" "}
            {t("Tag New Officer", "नया अधिकारी मैप करें")}
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
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
            isLoading={isLoading}
            {...pageProps}
          />
        </div>

        {/* Add tagging form */}
        <QuickTagOfficer
          officers={userOptionsUnTagged}
          handleSaveTagging={handleQuickSave}
          isLoading={postMutation.isPending}
          department={selectedDept}
        />

        {/* Add/Edit Dialog */}
        {dialogOpen && (
          <EditDialog
            isHideFooter
            onClose={() => {
              setDialogOpen(false);
              setEditItem(null);
            }}
            title={editItem ? t("Edit Tagging", "मैपिंग संपादित करें") : t("Tag New Officer", "नया अधिकारी मैप करें")}
          >
            <RhfWrapper
              isValidation={true}
              validationSchema={officerTaggingSchema}
              className={"max-h-[450px] "}
              initialValues={
                editItem
                  ? {
                      officer:
                        editItem.officer?._id || editItem.officer || "",
                      services: (editItem.services || []).map(
                        (s) => s._id || s,
                      ),
                      divisions: (
                        editItem.divisions ||
                        (editItem.division ? [editItem.division] : [])
                      ).map((d) => d._id || d),
                      subdivisions: (
                        editItem.subdivisions ||
                        editItem.subDivisions ||
                        editItem.wards ||
                        []
                      ).map((s) => s._id || s),
                    }
                  : {
                      officer: "",
                      services: [],
                      divisions: [],
                      subdivisions: [],
                    }
              }
              onSubmit={handleFormSubmit}
            >
              <Form
                isEdit={!!editItem}
                isLoading={postMutation.isPending || putMutation.isPending}
                userOptions={userOptions}
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
            title={t("Remove Officer Tagging", "अधिकारी मैपिंग हटाएं")}
            message={t(
              `Are you sure you want to remove the tagging for "${deleteRecord.officer?.name || "this officer"}"?`,
              `क्या आप "${deleteRecord.officer?.name || "इस अधिकारी"}" के लिए मैपिंग हटाना चाहते हैं?`,
            )}
            deleting={deleteMutation.isPending}
          />
        )}

        {/* Rules */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
          <h4 className="font-bold text-amber-800 mb-2 text-sm">
            ⚠ {t("Officer Tagging Rules", "अधिकारी मैपिंग नियम")}
          </h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>
              • {t("A single officer can be tagged to multiple services and multiple subdivisions", "एक अधिकारी को कई सेवाओं और कई अनुमंडलों से मैप किया जा सकता है")}
            </li>
            <li>
              • {t("Every SLA must have at least 1 officer - or the ticket will not be visible", "प्रत्येक SLA में कम से कम 1 अधिकारी होना चाहिए - अन्यथा शिकायत दिखाई नहीं देगी")}
            </li>
            <li>
              • {t("Officers can only be added manually due to location restriction", "स्थान प्रतिबंध के कारण अधिकारियों को केवल मैन्युअल रूप से जोड़ा जा सकता है")}
            </li>
            <li>
              • {t("If a ticket remains unassigned, it can be reassigned later", "यदि कोई शिकायत आवंटित नहीं रहती है, तो उसे बाद में पुनः आवंटित किया जा सकता है")}
            </li>
          </ul>
        </div>
      </div>
    </PortalLayout>
  );
}
