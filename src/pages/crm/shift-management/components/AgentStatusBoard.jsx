import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useGetShifts } from "../hooks";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import Pagination from "@/components/Pagination";
import usePagination from "@/hooks/usePagination";
import { useLanguage } from "@/context/LanguageContext";
import { Pencil } from "lucide-react";
import EditShiftDialog from "./EditShiftDialog";
import MyTable from "@/components/MyTable";
import useIsMobile from "@/hooks/useIsMobile";
import AgentStatusBoardCards from "./AgentStatusBoardCards";

export default function AgentStatusBoard({
  isSupervisor = false,
  setAgentView = () => {},
}) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const pageProps = usePagination();
  const { data, isLoading, error } = useGetShifts({
    page: pageProps.page,
    limit: pageProps.limit,
  });

  const [editingAgent, setEditingAgent] = useState(null);

  const shiftsData = data?.data?.data?.docs || [];
  const totalPages = data?.data?.data?.pagination?.totalPages;

  const formatShift = (shift) => {
    if (!shift) return "-";
    let datePart = "";
    if (shift.date) {
      const d = new Date(shift.date);
      if (!isNaN(d.getTime())) {
        datePart = d.toLocaleDateString("en-IN");
      } else {
        datePart = shift.date;
      }
    }
    const timePart = shift.time || "";
    if (datePart && timePart) return `${datePart} | ${timePart}`;
    return datePart || timePart || "-";
  };

  useEffect(() => {
    if (data?.data?.data?.myShift) {
      setAgentView(data?.data?.data?.myShift);
    }
  }, [data?.data?.data?.myShift]);

  const tableHeaders = [
    { id: "agent", label: t("Agent", "एजेंट") },
    { id: "role", label: t("Role", "भूमिका") },
    { id: "shift", label: t("Shift", "शिफ्ट") },
    { id: "callsToday", label: t("Calls Today", "आज की कॉल") },
    ...(isSupervisor
      ? [
          { id: "resolvedToday", label: t("Resolved", "हल की गई") },
          { id: "avgTalkTime", label: t("Avg Talk Time", "औसत बात करने का समय") },
          { id: "csat", label: t("CSAT", "सीएसएटी") },
        ]
      : []),
    { id: "status", label: t("Status", "स्थिति") },
    ...(isSupervisor
      ? [
          {
            id: "actions",
            label: t("Actions", "कार्रवाई"),
            className: "text-center sticky right-0 bg-[#F4F7FA] dark:bg-[#172033] z-10",
          },
        ]
      : []),
  ];

  const tableBody = shiftsData.map((a) => {
    const initials = a.name
      ? a.name
          .split(" ")
          .map((n) => n[0])
          .join("")
      : "?";

    const formattedShiftVal = formatShift(a?.shift);

    return {
      agent: {
        render: () => (
          <div className="font-medium flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold capitalize shrink-0">
              {initials}
            </div>
            <span>{a.name || "N/A"}</span>
          </div>
        ),
      },
      role: {
        value: a.role?.level || a.role?.designationEnglish || "N/A",
        className: "text-muted-foreground",
      },
      shift: {
        value: formattedShiftVal === "-" ? "N/A" : formattedShiftVal,
        className: "text-muted-foreground",
      },
      callsToday: {
        value: a?.callsToday != null ? a.callsToday : "N/A",
      },
      resolvedToday: {
        value: a?.resolvedToday != null ? a.resolvedToday : "N/A",
      },
      avgTalkTime: {
        value: a?.avgTalkTime && a.avgTalkTime !== "-" ? a.avgTalkTime : "N/A",
        className: "text-muted-foreground",
      },
      csat: {
        render: () => (
          <span className="text-amber-600 font-medium">
            ★ {a?.csat && a.csat !== "-" ? a.csat : "N/A"}
          </span>
        ),
      },
      status: {
        render: () => (
          <Badge
            variant="outline"
            className={`text-xs ${
              a?.status === "On Call"
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                : a?.status === "Available"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : a?.status === "Break"
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                    : "bg-muted/50 text-muted-foreground border-border"
            }`}
          >
            {a?.status === "On Call"
              ? t("On Call", "कॉल पर")
              : a?.status === "Available"
                ? t("Available", "उपलब्ध")
                : a?.status === "Break"
                  ? t("Break", "ब्रेक")
                  : a?.status || "N/A"}
          </Badge>
        ),
      },
      actions: {
        className: "text-center sticky right-0 bg-white dark:bg-[#0f1729] z-10",
        render: () => (
          <button
            onClick={() => setEditingAgent(a)}
            className="p-1.5 hover:bg-muted rounded text-muted-foreground cursor-pointer"
            title={t("Edit Shift", "शिफ्ट संपादित करें")}
          >
            <Pencil className="w-4 h-4" />
          </button>
        ),
      },
    };
  });

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="font-bold text-foreground">
          {isSupervisor
            ? t("Agent Status Board", "एजेंट स्थिति बोर्ड")
            : t(
                "Agent Status Board (Read-Only)",
                "एजेंट स्थिति बोर्ड (केवल-पठन)",
              )}
        </h3>
      </div>
      <LoaderErrWrapper isLoading={isLoading} error={error}>
        {isMobile ? (
          <AgentStatusBoardCards
            shiftsData={shiftsData}
            isSupervisor={isSupervisor}
            setEditingAgent={setEditingAgent}
            formatShift={formatShift}
          />
        ) : (
          <MyTable
            tableHeaders={tableHeaders}
            tableBody={tableBody}
            pagination={<Pagination {...pageProps} totalPage={totalPages} />}
          />
        )}
      </LoaderErrWrapper>

      {editingAgent && (
        <EditShiftDialog
          agent={editingAgent}
          onClose={() => setEditingAgent(null)}
          t={t}
        />
      )}
    </div>
  );
}
