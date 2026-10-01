import React, { useState, useMemo } from "react";
import PortalLayout from "@/components/PortalLayout";
import ExportButton from "@/components/ExportButton";
import { SectionTitle } from "@/components/ChartCard";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { getCalls } from "@/api/calling.api";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import moment from "moment";

import CallHistoryStats from "./components/CallHistoryStats";
import CallHistoryFilters from "./components/CallHistoryFilters";
import CallHistoryTable from "./components/CallHistoryTable";
import CallHistoryBulkBar from "./components/CallHistoryBulkBar";
import CallDetailDialog from "./components/CallDetailDialog";
import MarkEvidenceDialog from "./components/MarkEvidenceDialog";

function calculateAvgDuration(docs = []) {
  if (!docs || docs.length === 0) return "—";
  let totalSec = 0;
  let count = 0;
  docs.forEach((c) => {
    const durStr = c.duration || c.recordingDuration;
    if (!durStr) return;
    let sec = 0;
    const mMatch = String(durStr).match(/(\d+)\s*m/i);
    const sMatch = String(durStr).match(/(\d+)\s*s/i);
    if (mMatch) sec += parseInt(mMatch[1], 10) * 60;
    if (sMatch) sec += parseInt(sMatch[1], 10);
    if (!mMatch && !sMatch && !isNaN(Number(durStr))) sec += Number(durStr);
    if (sec > 0) {
      totalSec += sec;
      count++;
    }
  });
  if (count === 0) return "—";
  const avg = Math.round(totalSec / count);
  const m = Math.floor(avg / 60);
  const s = avg % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function CallHistoryLog() {
  const { t } = useLanguage();

  // Pagination hook
  const { page, limit, setPage, setLimit, limitOptions } = usePagination(1, [
    10, 20, 50, 100,
  ]);

  // Filters state
  const [search, setSearch] = useState("");
  const [agentFilter, setAgentFilter] = useState("all");
  const [callTypeFilter, setCallTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [evidenceOnly, setEvidenceOnly] = useState(false);
  const [selected, setSelected] = useState([]);
  const [evidenceDialogCall, setEvidenceDialogCall] = useState(null);
  const [viewCall, setViewCall] = useState(null);
  const [taggedOverrides, setTaggedOverrides] = useState({});

  // Fetch real calls from GET /calls
  const {
    data: callsData,
    error: callsError,
    isLoading,
  } = useQuery({
    queryKey: [
      "calls",
      page,
      limit,
      search,
      statusFilter,
      callTypeFilter,
      evidenceOnly,
    ],
    queryFn: () =>
      getCalls({
        page,
        limit,
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        callType: callTypeFilter !== "all" ? callTypeFilter : undefined,
        evidenceTagged: evidenceOnly ? true : undefined,
      }),
  });

  const rawDocs = useMemo(() => {
    return callsData?.data?.data?.docs || callsData?.data?.docs || [];
  }, [callsData]);

  const pagination =
    callsData?.data?.data?.pagination || callsData?.data?.pagination;
  const totalPages = pagination?.totalPages || pagination?.totalPage || 1;
  const totalDocs =
    pagination?.totalDocs ?? pagination?.total ?? rawDocs.length;

  // Merge server data with optimistic local tagged overrides
  const calls = useMemo(() => {
    return rawDocs.map((c) => {
      const id = c.callId || c._id;
      if (taggedOverrides[id]) {
        return { ...c, ...taggedOverrides[id] };
      }
      return c;
    });
  }, [rawDocs, taggedOverrides]);

  // Unique agents list from real calls for filter dropdown
  const uniqueAgents = useMemo(() => {
    const set = new Set();
    calls.forEach((c) => {
      const name =
        c.agent?.name || (typeof c.agent === "string" ? c.agent : null);
      if (name) set.add(name);
    });
    return Array.from(set);
  }, [calls]);

  // Client-side fallback filter
  const filteredCalls = useMemo(() => {
    return calls.filter((c) => {
      const callId = (c.callId || c._id || "").toLowerCase();
      const compId = (
        c.complaintIdString ||
        c.complaintId?.grievanceId ||
        (typeof c.complaintId === "string" ? c.complaintId : "")
      ).toLowerCase();
      const mobile = (c.citizenMobile || "").toLowerCase();
      const agent = (
        c.agent?.name || (typeof c.agent === "string" ? c.agent : "")
      ).toLowerCase();

      if (
        search &&
        !callId.includes(search.toLowerCase()) &&
        !compId.includes(search.toLowerCase()) &&
        !mobile.includes(search.toLowerCase()) &&
        !agent.includes(search.toLowerCase())
      ) {
        return false;
      }
      if (
        agentFilter !== "all" &&
        (c.agent?.name || (typeof c.agent === "string" ? c.agent : "")) !==
          agentFilter
      ) {
        return false;
      }
      if (
        statusFilter !== "all" &&
        (c.status || "").toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false;
      }
      if (
        callTypeFilter !== "all" &&
        (c.callType || "").toLowerCase() !== callTypeFilter.toLowerCase()
      ) {
        return false;
      }
      if (evidenceOnly && !c.evidenceTagged) {
        return false;
      }
      return true;
    });
  }, [calls, search, agentFilter, statusFilter, callTypeFilter, evidenceOnly]);

  const exportColumns = useMemo(
    () => [
      { key: (r) => r.callId || r._id, label: t("Call ID", "कॉल आईडी") },
      { key: (r) => r.callType || "Outbound", label: t("Type", "प्रकार") },
      {
        key: (r) =>
          r.createdAt && moment(r.createdAt).isValid()
            ? moment(r.createdAt).format("DD MMM YYYY, hh:mm A")
            : r.createdAt || "—",
        label: t("Date/Time", "दिनांक/समय"),
      },
      {
        key: (r) => r.citizenMobile || "—",
        label: t("Citizen Mobile", "नागरिक मोबाइल"),
      },
      {
        key: (r) =>
          r.agent?.name || (typeof r.agent === "string" ? r.agent : "—"),
        label: t("Agent", "एजेंट"),
      },
      {
        key: (r) => r.duration || r.recordingDuration || "—",
        label: t("Duration", "अवधि"),
      },
      {
        key: (r) =>
          r.complaintIdString ||
          r.complaintId?.grievanceId ||
          (typeof r.complaintId === "string" ? r.complaintId : "—"),
        label: t("Complaint ID", "शिकायत आईडी"),
      },
      { key: (r) => r.disposition || "—", label: t("Disposition", "निपटान") },
      { key: (r) => r.status || "—", label: t("Status", "स्थिति") },
      {
        key: (r) =>
          r.evidenceTagged
            ? t("Yes", "हाँ") + " - " + (r.evidenceReason || "")
            : t("No", "नहीं"),
        label: t("Evidence Tagged", "साक्ष्य चिह्नित"),
      },
    ],
    [t]
  );

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const visibleIds = filteredCalls.map((c) => c.callId || c._id);
    if (selected.length === visibleIds.length && visibleIds.length > 0) {
      setSelected([]);
    } else {
      setSelected(visibleIds);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setAgentFilter("all");
    setCallTypeFilter("all");
    setStatusFilter("all");
    setEvidenceOnly(false);
    setPage(1);
  };

  const evidenceCount = useMemo(
    () => calls.filter((c) => c.evidenceTagged).length,
    [calls]
  );

  const missedCount = useMemo(
    () =>
      calls.filter(
        (c) =>
          c.status?.toLowerCase() === "missed" ||
          c.status?.toLowerCase() === "failed" ||
          c.disposition?.toLowerCase().includes("missed")
      ).length,
    [calls]
  );

  const avgDuration = useMemo(() => calculateAvgDuration(calls), [calls]);

  const selectedExportData = useMemo(() => {
    return selected.length > 0
      ? filteredCalls.filter((c) => selected.includes(c.callId || c._id))
      : filteredCalls;
  }, [selected, filteredCalls]);

  return (
    <PortalLayout role="crm">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <SectionTitle
            title={t("Call History Log", "कॉल इतिहास लॉग")}
            subtitle={t(
              "Complete call archive with recording playback, metadata, bulk export, and evidence tagging.",
              "रिकॉर्डिंग प्लेबैक, मेटाडेटा, थोक निर्यात और साक्ष्य टैगिंग के साथ पूर्ण कॉल संग्रह।"
            )}
          />
          <ExportButton
            data={filteredCalls}
            columns={exportColumns}
            filename="call_history_log"
            label={t("Export", "निर्यात")}
          />
        </div>

        {/* Real Stats */}
        <CallHistoryStats
          totalCalls={totalDocs}
          evidenceCount={evidenceCount}
          missedCount={missedCount}
          avgDuration={avgDuration}
        />

        {/* Real Filters */}
        <CallHistoryFilters
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          agents={uniqueAgents}
          agentFilter={agentFilter}
          onAgentFilterChange={(val) => {
            setAgentFilter(val);
            setPage(1);
          }}
          callTypeFilter={callTypeFilter}
          onCallTypeFilterChange={(val) => {
            setCallTypeFilter(val);
            setPage(1);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
          evidenceOnly={evidenceOnly}
          onEvidenceOnlyToggle={() => {
            setEvidenceOnly((prev) => !prev);
            setPage(1);
          }}
          onResetFilters={handleResetFilters}
        />

        {/* Call history table / cards wrapped with LoaderErrWrapper */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <LoaderErrWrapper isLoading={isLoading} error={callsError}>
            <CallHistoryTable
              calls={filteredCalls}
              selected={selected}
              onToggleSelect={toggleSelect}
              onToggleAll={toggleAll}
              onOpenEvidenceDialog={setEvidenceDialogCall}
              onViewCall={setViewCall}
              pagination={
                <Pagination
                  page={page}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                  totalPage={totalPages}
                  limitOptions={limitOptions}
                  isLoading={isLoading}
                />
              }
            />
          </LoaderErrWrapper>
        </div>

        {/* Bulk actions bar */}
        <CallHistoryBulkBar
          selectedCount={selected.length}
          exportData={selectedExportData}
          exportColumns={exportColumns}
        />
      </div>

      {/* View Call Details & Audio Playback Dialog */}
      <CallDetailDialog
        call={viewCall}
        onClose={() => setViewCall(null)}
        onOpenEvidenceDialog={setEvidenceDialogCall}
      />

      {/* Mark Single Call as Evidence Dialog */}
      <MarkEvidenceDialog
        call={evidenceDialogCall}
        onClose={() => setEvidenceDialogCall(null)}
        onSuccess={({ callId, evidenceReason }) => {
          setTaggedOverrides((prev) => ({
            ...prev,
            [callId]: {
              evidenceTagged: true,
              evidenceReason,
              taggedDate: moment().format("DD MMM YYYY"),
            },
          }));
        }}
      />
    </PortalLayout>
  );
}