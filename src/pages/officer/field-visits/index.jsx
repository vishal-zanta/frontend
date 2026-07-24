import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import {
  FIELD_VISIT_DATA,
  FieldVisitDetailDialog,
} from "@/components/ComplaintDetailDialog";
import FieldVisitCards from "./components/FieldVisitCards";
import FieldVisitTable from "./components/FieldVisitTable";

import SearchDebounced from "@/components/debounced/SearchDebounced";
import SelectDebounced from "@/components/debounced/SelectDebounced";
import Pagination from "@/components/Pagination";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import usePagination from "@/hooks/usePagination";
import { useGetFieldVisits } from "@/hooks/query/useGetFieldVisits";
import { FIELD_VISIT_STATUS } from "@/utils/constants";

import EditDialog from "@/components/EditDialog";
import RhfWrapper from "@/components/RhfWrapper";
import FieldVisitForm from "./components/FieldVisitForm";
import { fieldVisitSchema } from "./components/schema";
import { getSuccessToast, getErrorToast } from "@/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putFieldVisit } from "@/api/complaint.api";
import { useLanguage } from "@/context/LanguageContext";

export default function FieldVisits() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [editVisit, setEditVisit] = useState(null);
  const [viewVisit, setViewVisit] = useState(null);

  const { page, limit, ...pageProps } = usePagination();
  const queryClient = useQueryClient();

  // Fetch paginated field visit data from API
  const {
    data: visitsApiData,
    isLoading,
    error,
  } = useGetFieldVisits({
    search,
    status: statusFilter === "all" ? undefined : statusFilter,
    page,
    limit,
  });

  // Update field visit mutation added directly in index.jsx
  const updateMutation = useMutation({
    mutationFn: putFieldVisit,
    onSuccess: () => {
      getSuccessToast(t("Field visit updated successfully", "फील्ड विजिट सफलतापूर्वक अपडेट किया गया"));
      queryClient.invalidateQueries({ queryKey: ["field-visits"] });
      setEditVisit(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const fieldVisits = visitsApiData?.data?.data?.docs;
  const totalPages = visitsApiData?.data?.data?.pagination?.totalPages ?? 1;

  return (
    <PortalLayout role="officer">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("Field Visits", "फील्ड विजिट")}</h1>
          <p className="text-sm text-muted-foreground">
            {t(
              "Track all scheduled, in-progress, and completed field visits with geo-tagged photo evidence.",
              "भू-टैग की गई फोटो साक्ष्य के साथ सभी निर्धारित, प्रगति-पर और पूर्ण फील्ड विजिट को ट्रैक करें।"
            )}
          </p>
        </div>

        <FieldVisitCards data={[]} />

        <div className="flex gap-3">
          <SearchDebounced
            handleDebouncedChange={(val) => {
              setSearch(val);
              pageProps.setPage(1);
            }}
            delay={500}
            className="flex-1"
            placeholder={t("Search by visit ID ...", "विजिट आईडी द्वारा खोजें ...")}
          />

          <SelectDebounced
            initialValue={statusFilter}
            handleInstantChange={(val) => {
              setStatusFilter(val);
              pageProps.setPage(1);
            }}
            options={FIELD_VISIT_STATUS}
            placeholder={t("Select Status", "स्थिति चुनें")}
            isAll={true}
            allLabel={t("All Status", "सभी स्थिति")}
          />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <LoaderErrWrapper isLoading={isLoading} error={error}>
            <FieldVisitTable
              filtered={fieldVisits || []}
              onEdit={(fv) => setEditVisit(fv)}
              onView={(fv) => setViewVisit(fv)}
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

        {viewVisit && (
          <FieldVisitDetailDialog
            open={!!viewVisit}
            onClose={() => setViewVisit(null)}
            visit={viewVisit}
          />
        )}

        {/* Edit Visit Dialog */}
        {editVisit && (
          <EditDialog
            isHideFooter
            title={t("Edit Field Visit", "फील्ड विजिट संपादित करें")}
            onClose={() => setEditVisit(null)}
          >
            <RhfWrapper
              initialValues={{
                status: editVisit.status || "PENDING",
                schedule: (editVisit.schedule || editVisit.scheduledDate)
                  ? new Date(editVisit.schedule || editVisit.scheduledDate)
                      .toISOString()
                      .split("T")[0]
                  : "",
                remarks: editVisit.remarks || "",
              }}
              isValidation
              validationSchema={fieldVisitSchema}
              onSubmit={(formData) => {
                updateMutation.mutate({
                  id: editVisit._id,
                  data: {
                    status: formData.status,
                    schedule:
                      formData.status === "CANCELLED"
                        ? undefined
                        : formData.schedule,
                    remarks:
                      formData.status === "COMPLETED"
                        ? formData.remarks
                        : undefined,
                  },
                });
              }}
            >
              <FieldVisitForm
                onCancel={() => setEditVisit(null)}
                isLoading={updateMutation.isPending}
                fieldVisit={editVisit}
              />
            </RhfWrapper>
          </EditDialog>
        )}
      </div>
    </PortalLayout>
  );
}
