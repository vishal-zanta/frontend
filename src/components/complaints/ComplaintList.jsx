import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/Badges";
import { SLATimer } from "./ComplaintDetailHeader";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import SearchDebounced from "../debounced/SearchDebounced";
import Filter from "@/components/Filter";
import { STATUS_ACTIONS, PRIORITY_ACTIONS, MAX_LIMIT } from "@/utils/constants";
import { useLanguage } from "@/context/LanguageContext";
import { useLocation, useSearchParams } from "react-router-dom";
import MySelect from "@/components/inputs/MySelect";
import ExternalDepartmentList from "./department-list";
import { useGetComplaintSources } from "@/pages/admin/master-data/hooks";
import { getEntityLabel } from "@/utils/helpers";

export default function ComplaintList({
  selected,
  onSelect,
  setStatusUpdate,
  onStatsChange,
  useGetComplaintsOfOfiicer,
  autoSelect = true,
  isCCE = false,
  externalDeptProps,
}) {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const complaintId = searchParams.get("complaint") ?? "";
  const { state } = useLocation();
  const [search, setSearch] = useState(complaintId);
  // console.log({complaintId, search})
  const isChangedOnce = useRef(false);
  const [filters, setFilters] = useState({});

  const API_PARAMS = useMemo(
    () => ({
      page: 1,
      limit: MAX_LIMIT,
      select: "title,titleHindi,name,nameHindi",
    }),
    [],
  );
  const { data: complaintSourcesData, isLoading: complaintSourcesLoading } =
    useGetComplaintSources([API_PARAMS], API_PARAMS);

  const channelOptions = useMemo(() => {
    const docs = complaintSourcesData?.data?.data?.docs ?? [];
    return docs.map((v) => ({
      label: lang === "hi" && v.titleHindi ? v.titleHindi : v.title,
      value: v?._id,
    }));
  }, [complaintSourcesData, lang]);

  const filterOptions = useMemo(
    () => [
      {
        label: t("Status", "स्थिति"),
        filterKey: "status",
        options: STATUS_ACTIONS.map((action) => ({
          label: action.badgeLabel || action.label,
          value: action.value,
        })),
        isMultiple : true
      },
      {
        label: t("Feedback", "प्रतिक्रिया"),
        filterKey: "feedback",
        options: [
          { label: t("Feedback Done", "प्रतिक्रिया समाप्त"), value: "true" },
          { label: t("Feedback Left", "प्रतिक्रिया शेष"), value: "false" },
        ],
        isMultiple : true

      },
      {
        label: t("Priority", "प्राथमिकता"),
        filterKey: "priority",
        options: PRIORITY_ACTIONS.map((action) => ({
          label: action.badgeLabel || action.label,
          value: action.value,
        })),
        isMultiple : true

      },
      {
        label: t("Mode of Complaint", "शिकायत का माध्यम"),
        filterKey: "channel",
        options: channelOptions,
        isMultiple : true

      },
    ],
    [t, channelOptions],
  );

  const { dept, setDept, selectedDept, departmentsList, isExternalDepartment } =
    externalDeptProps || {};
  // console.log({dept, isExternalDepartment});

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetComplaintsOfOfiicer(
    {
      limit: 10,
      search,
      status: filters.status || undefined,
      feedback:
        filters.feedback !== undefined && filters.feedback !== ""
          ? filters.feedback
          : undefined,
      priority: filters.priority || undefined,
      channel: filters.channel || undefined,
    },
    {
      enabled: !isExternalDepartment,
    },
  );

  const complaints = useMemo(() => {
    return (
      data?.pages?.flatMap(
        (page) => page?.data?.docs || page?.data || page?.docs || [],
      ) || []
    );
  }, [data]);

  const lastStatsRef = useRef(null);

  // Automatically select the first complaint when the list loads
  useEffect(() => {
    if (!autoSelect || isExternalDepartment) return;
    if (complaints.length > 0) {
      const isSelectedInList = complaints.some(
        (c) => (c._id || c.id) === (selected?._id || selected?.id),
      );
      if (!selected || !isSelectedInList) {
        onSelect(complaints[0], true);
      }
    } else {
      // console.log("Selected NULL")
      onSelect(null);
    }
  }, [complaints, selected, onSelect, autoSelect, isExternalDepartment]);

  // Compute and report stats up
  useEffect(() => {
    if (complaints.length > 0 && onStatsChange) {
      const totalAssigned = complaints.length;
      const pendingAction = complaints.filter(
        (c) => !["Resolved", "Closed"].includes(c.status),
      ).length;
      const resolved = complaints.filter((c) =>
        ["Resolved", "Closed"].includes(c.status),
      ).length;
      const slaBreachRisk = complaints.filter(
        (c) => c.status === "Escalated",
      ).length;

      const currentStats = {
        totalAssigned,
        pendingAction,
        resolved,
        slaBreachRisk,
      };

      const hasChanged =
        !lastStatsRef.current ||
        lastStatsRef.current.totalAssigned !== currentStats.totalAssigned ||
        lastStatsRef.current.pendingAction !== currentStats.pendingAction ||
        lastStatsRef.current.resolved !== currentStats.resolved ||
        lastStatsRef.current.slaBreachRisk !== currentStats.slaBreachRisk;

      if (hasChanged) {
        lastStatsRef.current = currentStats;
        onStatsChange(currentStats);
      }
    }
  }, [complaints, onStatsChange]);
  // useEffect(() => {
  //   if (!!searchParams.get("complaint")) {
  //     setSearch(searchParams.get("complaint"));
  //   }
  // }, [searchParams.get("complaint")]);

  return (
    <div className="bg-card rounded-xl border border-border sticky top-20 min-h-0 flex flex-col w-full overflow-hidden">
      <div className="px-4 py-3 border-b border-border ">
        <div className="flex items-center justify-between shrink-0 h-8">
          <h3 className="font-bold text-foreground text-sm">
            {t("My Complaints", "मेरी शिकायतें")} ({complaints.length})
          </h3>
          {!isExternalDepartment && (
            <Filter
              filters={filters}
              setFilters={setFilters}
              filterOptions={filterOptions}
            />
          )}
        </div>

        {isCCE && (
          <div className="mt-2 flex items-center gap-2 ">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap shrink-0">
              {t("Ext. Dept", "विभाग")}
            </p>
            <div className="flex-1 min-w-0">
              <MySelect
                placeholder={t("Select Department", "विभाग चुनें")}
                options={departmentsList.map((d) => ({
                  label: d.name,
                  value: d.key,
                }))}
                value={dept}
                onValueChange={(key) => {
                  setDept(key, true);
                  onSelect(null);
                  setSearch("");
                }}
                nonClearable
              />
            </div>
          </div>
        )}
        <div className="mt-2">
          <SearchDebounced
            placeholder={t("Search by id ...", "आईडी द्वारा खोजें ...")}
            handleDebouncedChange={(val) => {
              val !== search &&
                setSearchParams(
                  (p) => {
                    const params = new URLSearchParams(p);

                    if (val) {
                      params.set("complaint", val);
                    } else {
                      params.delete("complaint");
                    }

                    return params;
                  },
                  { replace: true },
                );
              // }
              setSearch(val);
            }}
            initialValue={complaintId}
            isClearable={true}
            delay={500}
            isLog={true}
          />
        </div>
      </div>

      <div
        style={{
          maxHeight: window.innerWidth < 768 ? "600px" : "calc(100vh - 385px)",
          minHeight: "380px !important",
        }}
        className="flex-1 md:overflow-y-auto scrollbar-thin   min-h-[360px] divide-y divide-border "
      >
        {isExternalDepartment ? (
          <ExternalDepartmentList
            selectedDept={selectedDept}
            onSelect={onSelect}
            autoSelect={autoSelect}
            selected={selected}
            params={{
              search,
            }}
          />
        ) : (
          <LoaderErrWrapper
            isLoading={isLoading}
            error={error?.message || error}
          >
            {complaints.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                {t(
                  "No complaints assigned to you.",
                  "आपको कोई शिकायत नहीं सौंपी गई है।",
                )}
              </div>
            ) : (
              <>
                {complaints.map((c, i) => {
                  const id = c._id || c.id;
                  const isSelected = selected?._id == id;
                  return (
                    <ComplaintListCard
                      c={c}
                      onClick={(c) => {
                        onSelect(c);
                        setStatusUpdate(null);
                      }}
                      isSelected={isSelected}
                    />
                  );
                })}

                {hasNextPage && (
                  <div className="p-3 bg-muted/10 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="w-full text-xs cursor-pointer"
                    >
                      {isFetchingNextPage
                        ? t("Loading more...", "और लोड हो रहा है...")
                        : t("Load More", "और लोड करें")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </LoaderErrWrapper>
        )}
      </div>
    </div>
  );
}

export const ComplaintListCard = ({ c, onClick, isSelected }) => {
  const { t } = useLanguage();
  const excludedStatus = ["RESOLVED", "CLOSED"];

  const loc = c.location || {};
  const isUrban = Boolean(loc.isUrban ?? false);

  const districtName = getEntityLabel(loc.district, t) || "";

  const urbanPanchayatName = getEntityLabel(loc.urbanPanchayat, t) || "";

  const wardName = getEntityLabel(loc.ward, t) || "";

  const villageName = getEntityLabel(loc.village, t) || "";

  const panchayatName = getEntityLabel(loc.panchayat, t) || "";

  const blockName = getEntityLabel(loc.block, t) || "";

  const subdivisionName = getEntityLabel(loc.subdivision, t) || "";

  const pincode = loc.pincode || loc.pinCode;

  const locationParts = (
    isUrban
      ? [blockName, districtName, pincode]
      : [
          // villageName,
          // panchayatName,
          blockName,
          districtName,
          pincode,
        ]
  ).filter(Boolean);

  const locationText =
    locationParts.length > 0
      ? locationParts.join(", ")
      : [
          // getEntityLabel(c.address?.villageOrWard || c.ward, t),
          // c.address?.city,
          // c.address?.state,
        ]
          .filter(Boolean)
          .join(", ") || "N/A";

  const serviceTitle = getEntityLabel(c.classification?.service, t) || "N/A";

  return (
    <button
      key={c?._id || c.id}
      onClick={() => {
        onClick(c);
      }}
      className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer ${
        isSelected ? "bg-primary/10 border-l-4 border-primary" : "bg-card"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
        <div className="flex items-center flex-wrap gap-2">
          <h2 className="text-xs font-bold text-primary font-mono">
            {c.grievanceId || c.id}
          </h2>
          <StatusBadge status={c.status} />
        </div>
        {!excludedStatus.includes(c.status) && (
          <div className="flex items-center gap-1 flex-wrap">
            <SLATimer
              createdAt={c.createdAt}
              slaHours={
                c.classification?.service?.sla ||
                c.classification?.subService?.sla ||
                null
              }
              resolvedAt={c.status == "RESOLVED" ? c?.resolvedAt || null : null}
            />

            <SLATimer
              createdAt={c?.assignedAt || null}
              slaHours={c?.slaHours || null}
              customText="Officer SLA"
              resolvedAt={c.status == "RESOLVED" ? c?.resolvedAt || null : null}
            />
          </div>
        )}
      </div>
      <div className="text-sm text-foreground truncate">{serviceTitle}</div>
      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate">
        <MapPin className="w-3 h-3 shrink-0" />{" "}
        <span className="truncate">{locationText}</span>
      </div>
    </button>
  );
};
