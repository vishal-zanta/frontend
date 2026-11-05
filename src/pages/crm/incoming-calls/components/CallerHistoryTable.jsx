import React, { useState } from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import { useLanguage } from "@/context/LanguageContext";
import { useCall } from "@/context/CallContext";
import { useQuery } from "@tanstack/react-query";
import { getCalls } from "@/api/calling.api";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import CallDetailDialog from "@/pages/crm/call-history-log/components/CallDetailDialog";
import { formatPhoneNumber } from "../helpers";
import moment from "moment";
import clsx from "clsx";

export default function CallerHistoryTable() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { callState, callDetails } = useCall();
  const [viewCall, setViewCall] = useState(null);
  // console.log({ callState, callDetails });

  const isActiveCall =
    (callState === "connected" || callState === "ringing") &&
    Boolean(callDetails);
  const searchPhone = formatPhoneNumber(callDetails?.callerId);

  // Pagination hook
  const { page, limit, setPage, setLimit, limitOptions } = usePagination(
    1,
    [10, 20, 50, 100],
  );

  // Fetch calls only when callState === "connected" && !!callDetails
  const {
    data: callsData,
    error: callsError,
    isLoading,
  } = useQuery({
    queryKey: ["callerHistory", page, limit, searchPhone],
    queryFn: () =>
      getCalls({
        page,
        limit,
        search: searchPhone || undefined,
      }),
    enabled: isActiveCall && Boolean(searchPhone),
  });

  const calls = callsData?.data?.data?.docs || callsData?.data?.docs || [];
  const pagination =
    callsData?.data?.data?.pagination || callsData?.data?.pagination;
  const totalPages = pagination?.totalPages || pagination?.totalPage || 1;

  if (!isActiveCall) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-bold text-foreground">
            {t(
              "Caller History - Previous Interactions",
              "कॉलर इतिहास - पिछला संवाद",
            )}
          </h3>
        </div>
        <div className="p-8 text-center text-sm text-muted-foreground">
          {t("No active call is present.", "कोई सक्रिय कॉल मौजूद नहीं है।")}
        </div>
      </div>
    );
  }

  const tableHeaders = [
    { id: "callId", label: t("Call ID", "कॉल आईडी") },
    { id: "type", label: t("Type", "प्रकार") },
    { id: "time", label: t("Date / Time", "दिनांक / समय") },
    { id: "agent", label: t("Agent", "एजेंट") },
    { id: "duration", label: t("Duration", "अवधि") },
    { id: "complaint", label: t("Complaint ID", "शिकायत आईडी") },
    { id: "status", label: t("Status", "स्थिति") },
  ];

  const tableBody = calls.map((c) => {
    const id = c.callId || c._id || "-";
    const isOutbound = c.callType === "Outbound";
    const complaintCode =
      c.complaintIdString ||
      c.complaintId?.grievanceId ||
      (typeof c.complaintId === "string" ? c.complaintId : null);
    const agentName =
      c.agent?.name || (typeof c.agent === "string" ? c.agent : "-");
    const formattedTime = c.createdAt
      ? moment(c.createdAt).isValid()
        ? moment(c.createdAt).format("DD MMM YYYY, hh:mm A")
        : c.createdAt
      : "-";

    return {
      callId: {
        render: () => (
          <button
            type="button"
            onClick={() => setViewCall(c)}
            className="font-mono text-xs font-bold text-primary hover:underline cursor-pointer block text-left"
          >
            {id}
          </button>
        ),
      },
      type: {
        render: () => (
          <Badge
            variant="outline"
            className={clsx(
              "text-[10px] px-1.5 py-0 whitespace-nowrap",
              isOutbound
                ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                : "bg-primary/10 text-primary border-primary/20",
            )}
          >
            {isOutbound ? t("Outbound", "आउटबाउंड") : t("Inbound", "इनबाउंड")}
          </Badge>
        ),
      },
      time: {
        value: formattedTime,
        className: "text-muted-foreground text-xs whitespace-nowrap",
      },
      agent: {
        value: agentName,
        className: "text-xs font-medium",
      },
      duration: {
        render: () => (
          <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground/70" />
            {c.duration || c.recordingDuration || "-"}
          </span>
        ),
      },
      complaint: {
        render: () =>
          complaintCode ? (
            <span className="font-mono text-xs font-semibold text-primary">
              {complaintCode}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">-</span>
          ),
      },
      status: {
        render: () => (
          <Badge
            variant="outline"
            className={clsx(
              "text-xs whitespace-nowrap",
              c.status === "Resolved" || c.status === "Completed"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : c.status === "Missed" || c.status === "Failed"
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
            )}
          >
            {c.status || t("Initiated", "आरंभ")}
          </Badge>
        ),
      },
    };
  });

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-bold text-foreground">
            {t(
              "Caller History - Previous Interactions",
              "कॉलर इतिहास - पिछला संवाद",
            )}
          </h3>
        </div>
        {searchPhone && (
          <span className="text-xs font-mono text-muted-foreground">
            {t("Caller", "कॉलर")}: {searchPhone}
          </span>
        )}
      </div>

      <LoaderErrWrapper isLoading={isLoading} error={callsError}>
        {isMobile ? (
          <div className="flex flex-col">
            {calls.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                {t("No previous calls found.", "कोई पिछला कॉल नहीं मिला।")}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
                {calls.map((c, i) => {
                  const id = c.callId || c._id || `CALL-${i + 1}`;
                  const isOutbound = c.callType === "Outbound";
                  const formattedTime = c.createdAt
                    ? moment(c.createdAt).isValid()
                      ? moment(c.createdAt).format("DD MMM YYYY, hh:mm A")
                      : c.createdAt
                    : "-";
                  const agentName =
                    c.agent?.name ||
                    (typeof c.agent === "string" ? c.agent : "-");
                  const complaintCode =
                    c.complaintIdString ||
                    c.complaintId?.grievanceId ||
                    (typeof c.complaintId === "string" ? c.complaintId : null);

                  return (
                    <div
                      key={c._id || id}
                      className="rounded-xl border border-border bg-card p-3.5 space-y-2.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setViewCall(c)}
                          className="font-mono text-xs font-bold text-primary hover:underline cursor-pointer truncate"
                        >
                          {id}
                        </button>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Badge
                            variant="outline"
                            className={clsx(
                              "text-[10px] px-1.5 py-0",
                              isOutbound
                                ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                                : "bg-primary/10 text-primary border-primary/20",
                            )}
                          >
                            {isOutbound
                              ? t("Outbound", "आउटबाउंड")
                              : t("Inbound", "इनबाउंड")}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={clsx(
                              "text-[10px] px-1.5 py-0",
                              c.status === "Resolved" ||
                                c.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : c.status === "Missed" || c.status === "Failed"
                                  ? "bg-destructive/10 text-destructive border-destructive/20"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                            )}
                          >
                            {c.status || t("Initiated", "आरंभ")}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                            {t("Date / Time", "दिनांक / समय")}
                          </span>
                          <span className="text-foreground text-xs block mt-0.5 truncate">
                            {formattedTime}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                            {t("Agent", "एजेंट")}
                          </span>
                          <span className="font-medium text-foreground text-xs block truncate mt-0.5">
                            {agentName}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                            {t("Duration", "अवधि")}
                          </span>
                          <span className="text-muted-foreground text-xs block mt-0.5">
                            {c.duration || c.recordingDuration || "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-medium">
                            {t("Complaint ID", "शिकायत आईडी")}
                          </span>
                          <span className="font-mono text-xs font-semibold text-primary block mt-0.5 truncate">
                            {complaintCode || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <Pagination
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              totalPage={totalPages}
              limitOptions={limitOptions}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div>
            <MyTable
              tableHeaders={tableHeaders}
              tableBody={tableBody}
              emptyText={t(
                "No previous calls found.",
                "कोई पिछला कॉल नहीं मिला।",
              )}
            />
            <Pagination
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              totalPage={totalPages}
              limitOptions={limitOptions}
              isLoading={isLoading}
            />
          </div>
        )}
      </LoaderErrWrapper>

      {/* View Call Details & Audio Playback Dialog */}
      <CallDetailDialog call={viewCall} onClose={() => setViewCall(null)} />
    </div>
  );
}
