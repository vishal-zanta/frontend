import React, { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Coffee } from "lucide-react";
import EditDialog from "@/components/EditDialog";
import MyTable from "@/components/MyTable";
import Pagination from "@/components/Pagination";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import usePagination from "@/hooks/usePagination";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { getUserBreaks } from "@/api/breaks.api";

export default function UserBreaksDialog({ user, onClose }) {
  const { t } = useLanguage();
  const userId = user?.id || user?._id || user?.apiData?._id;

  const { page, limit, ...paginationProps } = usePagination(1, [10, 20, 50]);

  const {
    data: breaksData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userBreaks", userId, page, limit],
    queryFn: () => getUserBreaks(userId, { page, limit }),
    enabled: Boolean(userId),
  });

  useEffect(() => {
    if (breaksData) {
      console.log("CCE Breaks API Response for user", userId, ":", breaksData);
    }
  }, [breaksData, userId]);

  const responseData = breaksData?.data?.data || breaksData?.data || {};
  const rawBreaks = Array.isArray(responseData?.breaks)
    ? responseData.breaks
    : Array.isArray(responseData?.docs)
      ? responseData.docs
      : Array.isArray(responseData)
        ? responseData
        : [];

  const pagination = responseData?.pagination || {};
  const totalPages =
    pagination?.totalPages ||
    responseData?.totalPages ||
    Math.ceil((pagination?.total || rawBreaks.length || 1) / limit) ||
    1;

  const totalDocs =
    pagination?.total ??
    responseData?.totalDocs ??
    rawBreaks.length ??
    0;

  const formattedBreaks = useMemo(() => {
    return rawBreaks.map((b, idx) => {
      const isOngoing = !b.endTime;

      let durationSec = b.durationSeconds || b.duration;
      if (typeof durationSec !== "number" && b.startTime && b.endTime) {
        durationSec = Math.max(
          0,
          Math.floor(
            (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / 1000
          )
        );
      }

      let durationFormatted = b.durationFormatted || b.durationText;
      if (!durationFormatted && typeof durationSec === "number" && durationSec >= 0) {
        const h = Math.floor(durationSec / 3600);
        const m = Math.floor((durationSec % 3600) / 60);
        const s = durationSec % 60;
        const parts = [];
        if (h > 0) parts.push(`${h}h`);
        if (m > 0 || h > 0) parts.push(`${m}m`);
        parts.push(`${s}s`);
        durationFormatted = parts.join(" ");
      }

      const breakNum = b.breakNumber || (page - 1) * limit + idx + 1;

      return {
        ...b,
        breakNumber: breakNum,
        isOngoing,
        durationSec: durationSec || 0,
        durationFormatted: isOngoing
          ? t("In progress...", "प्रक्रियाधीन...")
          : durationFormatted || "0s",
      };
    });
  }, [rawBreaks, page, limit, t]);

  const tableHeaders = [
    { id: "date", label: t("Date", "दिनांक") },
    { id: "startTime", label: t("Start Time", "शुरू होने का समय") },
    { id: "endTime", label: t("End Time", "समाप्ति समय") },
    { id: "duration", label: t("Duration", "अवधि") },
  ];

  const tableBody = formattedBreaks.map((b) => ({
    date: {
      value: b.startTime
        ? new Date(b.startTime).toLocaleDateString([], {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "N/A",
      className: "text-muted-foreground",
    },
    startTime: {
      value: b.startTime
        ? new Date(b.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        : "N/A",
      className: "font-medium text-foreground",
    },
    endTime: {
      value: b.endTime ? (
        new Date(b.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      ) : b.isOngoing ? (
        <span className="text-amber-600 dark:text-amber-400 font-medium">
          {t("Ongoing...", "प्रक्रियाधीन...")}
        </span>
      ) : (
        "N/A"
      ),
      className: "text-muted-foreground",
    },
    duration: {
      value: b.durationFormatted,
      className: "font-semibold text-foreground",
    },
  }));

  return (
    <EditDialog
      isHideFooter
      onClose={onClose}
      title={`${t("CCE Breaks History", "CCE ब्रेक इतिहास")} - ${user?.name || "Agent"}`}
      bodyClassname="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground pb-2">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-primary" />
            <span>
              {t("Total Breaks Logged:", "कुल लॉग किए गए ब्रेक:")}{" "}
              <strong className="text-foreground">{totalDocs}</strong>
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <LoaderErrWrapper isLoading={isLoading} error={error}>
            <MyTable
              tableHeaders={tableHeaders}
              tableBody={tableBody}
              emptyText={t(
                "No break records found for this agent.",
                "इस एजेंट के लिए कोई ब्रेक रिकॉर्ड नहीं मिला।"
              )}
            />
            <Pagination
              page={page}
              limit={limit}
              totalPage={totalPages}
              isLoading={isLoading}
              {...paginationProps}
            />
          </LoaderErrWrapper>
        </div>

        <div className="flex justify-end pt-2 pb-4">
          <Button variant="outline" onClick={onClose} className="px-5">
            {t("Close", "बंद करें")}
          </Button>
        </div>
      </div>
    </EditDialog>
  );
}
