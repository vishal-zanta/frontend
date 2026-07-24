import React, { useEffect, useMemo, useRef, useState } from "react";
import { Filter, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/Badges";
import { SLATimer } from "./ComplaintDetailHeader";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import SearchDebounced from "../debounced/SearchDebounced";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { STATUS_ACTIONS, PRIORITY_ACTIONS } from "@/utils/constants";
import { useLanguage } from "@/context/LanguageContext";
import { useLocation, useSearchParams } from "react-router-dom";

export default function ComplaintList({
  selected,
  onSelect,
  setStatusUpdate,
  onStatsChange,
  useGetComplaintsOfOfiicer,
  autoSelect = true,
}) {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const {state} = useLocation();
  const [search, setSearch] = useState("");
const isChangedOnce = useRef(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetComplaintsOfOfiicer({
    limit: 10,
    search,
    status: selectedStatus || undefined,
    feedback: selectedFeedback !== "" ? selectedFeedback : undefined,
    priority: selectedPriority || undefined,
  });

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
    if (!autoSelect) return;
    if (complaints.length > 0) {
      const isSelectedInList = complaints.some(
        (c) => (c._id || c.id) === (selected?._id || selected?.id),
      );
      if (!selected || !isSelectedInList) {
        onSelect(complaints[0], true);
      }
    } else {
      onSelect(null);
    }
  }, [complaints, selected, onSelect, autoSelect]);

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
  useEffect(()=> {
    if(!!searchParams.get("complaint")){
      setSearch(searchParams.get("complaint"));
    }
  },[searchParams.get("complaint")])

  return (
    <div className="bg-card rounded-xl border border-border sticky top-20 min-h-0 flex flex-col w-full overflow-hidden">
      <div className="px-4 py-3 border-b border-border ">
        <div className="flex items-center justify-between shrink-0">
          <h3 className="font-bold text-foreground text-sm">
            {t("My Complaints", "मेरी शिकायतें")} ({complaints.length})
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-8 w-8 p-0 cursor-pointer"
              >
                <Filter className="w-4 h-4" />
                {(selectedStatus || selectedFeedback !== "" || selectedPriority) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <span>{t("Status", "स्थिति")}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-40 bg-card">
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("")}
                    className={`cursor-pointer ${!selectedStatus ? "font-semibold bg-accent text-accent-foreground" : ""}`}
                  >
                    {t("All Statuses", "सभी स्थितियाँ")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {STATUS_ACTIONS.map((action) => {
                    const isSelected = selectedStatus === action.value;
                    return (
                      <DropdownMenuItem
                        key={action.value}
                        onClick={() => setSelectedStatus(action.value)}
                        className={`cursor-pointer ${isSelected ? "font-semibold bg-accent text-accent-foreground" : ""}`}
                      >
                        {action.badgeLabel || action.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <span>{t("Feedback", "प्रतिक्रिया")}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-44 bg-card">
                  <DropdownMenuItem
                    onClick={() => setSelectedFeedback("")}
                    className={`cursor-pointer ${selectedFeedback === "" ? "font-semibold bg-accent text-accent-foreground" : ""}`}
                  >
                    {t("All", "सभी")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setSelectedFeedback("true")}
                    className={`cursor-pointer ${selectedFeedback === "true" ? "font-semibold bg-accent text-accent-foreground" : ""}`}
                  >
                    {t("Feedback Done", "प्रतिक्रिया समाप्त")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedFeedback("false")}
                    className={`cursor-pointer ${selectedFeedback === "false" ? "font-semibold bg-accent text-accent-foreground" : ""}`}
                  >
                    {t("Feedback Left", "प्रतिक्रिया शेष")}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <span>{t("Priority", "प्राथमिकता")}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-40 bg-card">
                  <DropdownMenuItem
                    onClick={() => setSelectedPriority("")}
                    className={`cursor-pointer ${!selectedPriority ? "font-semibold bg-accent text-accent-foreground" : ""}`}
                  >
                    {t("All Priorities", "सभी प्राथमिकताएं")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {PRIORITY_ACTIONS.map((action) => {
                    const isSelected = selectedPriority === action.value;
                    return (
                      <DropdownMenuItem
                        key={action.value}
                        onClick={() => setSelectedPriority(action.value)}
                        className={`cursor-pointer ${isSelected ? "font-semibold bg-accent text-accent-foreground" : ""}`}
                      >
                        {action.badgeLabel || action.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              {(selectedStatus || selectedFeedback !== "" || selectedPriority) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedStatus("");
                      setSelectedFeedback("");
                      setSelectedPriority("");
                    }}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    {t("Clear Filters", "फ़िल्टर हटाएं")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-2">
          <SearchDebounced
            placeholder={t("Search by id ...", "आईडी द्वारा खोजें ...")}
            handleDebouncedChange={(val) => setSearch(val)}
            initialValue={searchParams.get("complaint") || ""}

          />
        </div>
      </div>

      <div
        style={{
          maxHeight: window.innerWidth < 768 ? "600px" : "calc(100vh - 385px)",
          minHeight:"380px !important"
        }}
        className="flex-1 overflow-y-auto scrollbar-thin   min-h-[360px] divide-y divide-border "
      >
        <LoaderErrWrapper isLoading={isLoading} error={error?.message || error}>
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
                  <button
                    key={id || i}
                    onClick={() => {
                      onSelect(c);
                      setStatusUpdate(null);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-l-4 border-primary"
                        : "bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                      <div className="flex items-center flex-wrap gap-2">
                        <h2 className="text-xs font-bold text-primary font-mono">
                          {c.grievanceId || c.id}
                        </h2>
                        <StatusBadge status={c.status} />
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        <SLATimer
                          createdAt={c.createdAt}
                          slaHours={c.classification?.subService?.sla || c.slaHours}
                        />
                        { (
                          <SLATimer
                            createdAt={c?.assignedAt || null}
                            slaHours={c.slaHours}
                            customText="Officer SLA"
                          />
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-foreground truncate">
                      {c.classification?.subService?.title ||
                        c.subserviceName ||
                        c.serviceName ||
                        "-"}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3 h-3" />{" "}
                      {`  ${c.address?.villageOrWard || c.ward || "-"}, 
                      ${c.address?.district?.name || "-"},
                      ${c.address?.state || "-"}`.replaceAll("-,", "")}
                    </div>
                  </button>
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
      </div>
    </div>
  );
}
