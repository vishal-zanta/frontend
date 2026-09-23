import React, { useState, useMemo } from "react";
import {
  Clock,
  Calendar,
  Search,
} from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { SectionTitle } from "@/components/ChartCard";
import MyTable from "@/components/MyTable";
import Pagination from "@/components/Pagination";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import usePagination from "@/hooks/usePagination";
import useIsMobile from "@/hooks/useIsMobile";
import { useGetMyBreaks } from "./hooks";
import MyBreaksCards from "./components/MyBreaksCards";

export default function MyBreaks() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { page, limit, ...paginationProps } = usePagination(1, [10, 20, 50]);

  // Query my breaks list
  const {
    data: myBreaksData,
    isLoading,
    error,
  } = useGetMyBreaks({
    page,
    limit,
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: search || undefined,
  });

  const responseData = myBreaksData?.data?.data || myBreaksData?.data || {};
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

  // Format breaks list with duration calculations
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

  // Client-side search & filter fallback
  const filtered = useMemo(() => {
    return formattedBreaks.filter((b) => {
      if (statusFilter === "active" && !b.isOngoing) return false;
      if (statusFilter === "completed" && b.isOngoing) return false;
      if (search) {
        const query = search.toLowerCase();
        const dateStr = b.startTime
          ? new Date(b.startTime).toLocaleDateString()
          : "";
        const idStr = String(b._id || b.id || "");
        const numStr = String(b.breakNumber || "");
        if (
          !dateStr.toLowerCase().includes(query) &&
          !idStr.toLowerCase().includes(query) &&
          !numStr.includes(query)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [formattedBreaks, statusFilter, search]);

  // Table headers & body for MyTable
  const tableHeaders = [
    { id: "number", label: t("Break #", "ब्रेक #") },
    { id: "date", label: t("Date", "दिनांक") },
    { id: "startTime", label: t("Start Time", "शुरू होने का समय") },
    { id: "endTime", label: t("End Time", "समाप्ति समय") },
    { id: "duration", label: t("Duration", "अवधि") },
  ];

  const tableBody = filtered.map((b) => ({
    number: {
      value: `#${b.breakNumber}`,
      className: "font-semibold text-foreground",
    },
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
    <PortalLayout role="crm">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Page Title */}
        <SectionTitle
          title={t("My Breaks", "मेरे ब्रेक")}
          subtitle={t(
            "Track your break sessions and duration history.",
            "अपने ब्रेक सत्र और ब्रेक अवधि का इतिहास देखें।"
          )}
        />

        {/* Filter Bar */}
        {/* <div className="bg-card rounded-xl border border-border p-3 xs:p-4 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3 flex-1">
            <div className="relative w-full xs:w-auto flex-1 max-w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t(
                  "Search by date or break #...",
                  "दिनांक या ब्रेक # द्वारा खोजें..."
                )}
                className="pl-8 w-full h-9 text-xs"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full xs:w-36 bg-background h-9 text-xs">
                <SelectValue placeholder={t("Status", "स्थिति")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("All Statuses", "सभी स्थितियाँ")}
                </SelectItem>
                <SelectItem value="active">
                  {t("Active Break", "सक्रिय ब्रेक")}
                </SelectItem>
                <SelectItem value="completed">
                  {t("Completed", "पूर्ण")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div> */}

        {/* Table / Mobile Cards */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <LoaderErrWrapper isLoading={isLoading} error={error}>
            {isMobile ? (
              <MyBreaksCards breaks={filtered} />
            ) : (
              <MyTable
                tableHeaders={tableHeaders}
                tableBody={tableBody}
                emptyText={t(
                  "No break records found.",
                  "कोई ब्रेक रिकॉर्ड नहीं मिला।"
                )}
              />
            )}
            <Pagination
              page={page}
              limit={limit}
              totalPage={totalPages}
              isLoading={isLoading}
              {...paginationProps}
            />
          </LoaderErrWrapper>
        </div>
      </div>
    </PortalLayout>
  );
}
