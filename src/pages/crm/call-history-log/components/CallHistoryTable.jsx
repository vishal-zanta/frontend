import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, PhoneCall, Loader2, Clock } from "lucide-react";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import CrmCallCards from "../../components/CrmCallCards";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMakeCall } from "@/api/calling.api";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { QUERY_KEYS } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import moment from "moment";
import clsx from "clsx";

export default function CallHistoryTable({
  calls = [],
  selected = [],
  onToggleSelect,
  onToggleAll,
  onOpenEvidenceDialog,
  onViewCall,
  pagination = null,
}) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { profiledata } = useAuth();
  const queryClient = useQueryClient();
  const [callingId, setCallingId] = useState(null);

  // Mutation to place call to citizen
  const makeCallMutation = useMutation({
    mutationFn: postMakeCall,
    onSuccess: (res) => {
      getSuccessToast(
        res?.data?.message ||
          t("Call initiated successfully", "कॉल सफलतापूर्वक शुरू की गई")
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_COMMUNICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: ["calls"],
      });
      setCallingId(null);
    },
    onError: (err) => {
      getErrorToast(err);
      setCallingId(null);
    },
  });

  const handleCallCitizen = (e, c) => {
    e.stopPropagation();
    e.preventDefault();
    const rawMobile = c.citizenMobile;
    if (!rawMobile || rawMobile === "N/A" || rawMobile === "-") return;

    const digitsOnly = String(rawMobile).replace(/\D/g, "");
    const cleanNumber =
      digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly || String(rawMobile).trim();

    const grievanceId = c.complaintIdString || c.complaintId?.grievanceId;
    const complaintDbId =
      c.complaintId?._id || (typeof c.complaintId === "string" ? c.complaintId : undefined);

    const callIdentifier = c.callId || c._id;
    setCallingId(callIdentifier);

    makeCallMutation.mutate({
      clientNumber: cleanNumber,
      ...(grievanceId ? { grievanceId } : {}),
      ...(complaintDbId ? { _id: complaintDbId } : {}),
    });
  };

  if (isMobile) {
    return (
      <div className="flex flex-col">
        <CrmCallCards
          calls={calls}
          selected={selected}
          toggleSelect={onToggleSelect}
          onOpenEvidenceDialog={onOpenEvidenceDialog}
          onViewCall={onViewCall}
          onCallCitizen={handleCallCitizen}
          callingId={callingId}
          isCallingPending={makeCallMutation.isPending}
          canCallCitizen={Boolean(profiledata?.isCCE)}
        />
        {pagination}
      </div>
    );
  }

  const isAllSelected = selected.length === calls.length && calls.length > 0;

  const tableHeaders = [
    {
      id: "checkbox",
      label: (
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={onToggleAll}
          className="rounded cursor-pointer"
        />
      ),
      className: "w-10 text-center",
    },
    { id: "callId", label: t("Call ID", "कॉल आईडी") },
    { id: "type", label: t("Type", "प्रकार") },
    { id: "time", label: t("Date / Time", "दिनांक / समय") },
    { id: "mobile", label: t("Citizen Mobile", "नागरिक मोबाइल") },
    { id: "agent", label: t("Agent", "एजेंट") },
    { id: "duration", label: t("Duration", "अवधि") },
    { id: "complaint", label: t("Complaint ID", "शिकायत आईडी") },
    { id: "status", label: t("Status", "स्थिति") },
    { id: "evidence", label: t("Evidence", "साक्ष्य") },
  ];

  const tableBody = calls.map((c) => {
    const id = c.callId || c._id;
    const isSelected = selected.includes(id);
    const isOutbound = c.callType === "Outbound";
    const complaintCode =
      c.complaintIdString ||
      c.complaintId?.grievanceId ||
      (typeof c.complaintId === "string" ? c.complaintId : null);
    const agentName =
      c.agent?.name || (typeof c.agent === "string" ? c.agent : "—");
    const formattedTime = c.createdAt
      ? moment(c.createdAt).isValid()
        ? moment(c.createdAt).format("DD MMM YYYY, hh:mm A")
        : c.createdAt
      : "—";

    const hasMobile =
      c.citizenMobile && c.citizenMobile !== "N/A" && c.citizenMobile !== "-";
    const isThisCalling = makeCallMutation.isPending && callingId === id;

    return {
      checkbox: {
        className: "text-center",
        render: () => (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(id)}
            className="rounded cursor-pointer"
          />
        ),
      },
      callId: {
        render: () => (
          <button
            type="button"
            onClick={() => onViewCall?.(c)}
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
              "text-[10px] px-1.5 py-0",
              isOutbound
                ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                : "bg-primary/10 text-primary border-primary/20"
            )}
          >
            {isOutbound
              ? t("Outbound", "आउटबाउंड")
              : t("Inbound", "इनबाउंड")}
          </Badge>
        ),
      },
      time: {
        value: formattedTime,
        className: "text-muted-foreground text-xs whitespace-nowrap",
      },
      mobile: {
        render: () => (
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            {profiledata?.isCCE && hasMobile && (
              <button
                type="button"
                disabled={makeCallMutation.isPending}
                onClick={(e) => handleCallCitizen(e, c)}
                className="p-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
                title={t("Call Citizen", "नागरिक को कॉल करें")}
              >
                {isThisCalling ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <PhoneCall className="w-3.5 h-3.5" />
                )}
              </button>
            )}
            <span className="font-mono text-xs font-medium">
              {c.citizenMobile || "—"}
            </span>
          </div>
        ),
      },
      agent: {
        render: () => (
          <div className="flex flex-col">
            <span className="font-medium text-xs text-foreground">
              {agentName}
            </span>
            {c.agent?.userCode && (
              <span className="font-mono text-[10px] text-muted-foreground">
                {c.agent.userCode}
              </span>
            )}
          </div>
        ),
      },
      duration: {
        render: () => (
          <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground/70" />
            {c.duration || c.recordingDuration || "—"}
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
            <span className="text-muted-foreground text-xs">—</span>
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
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            )}
          >
            {c.status || t("Initiated", "आरंभ")}
          </Badge>
        ),
      },
      evidence: {
        render: () =>
          c.evidenceTagged ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{t("Tagged", "चिह्नित")}</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenEvidenceDialog?.(c)}
                className="text-[11px] text-muted-foreground hover:text-purple-600 underline cursor-pointer"
                title={c.evidenceReason || ""}
              >
                {t("Edit", "संपादित")}
              </button>
            </div>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onOpenEvidenceDialog?.(c)}
              className="h-7 px-2 text-xs text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/10 cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t("Mark as evidence", "साक्ष्य चिह्नित करें")}</span>
            </Button>
          ),
      },
    };
  });

  return (
    <MyTable
      tableHeaders={tableHeaders}
      tableBody={tableBody}
      pagination={pagination}
      emptyText={t(
        "No calls match your filters.",
        "आपके फ़िल्टर से कोई कॉल मेल नहीं खाती।"
      )}
    />
  );
}
