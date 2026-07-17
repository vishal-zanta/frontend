import React, { useEffect, useMemo, useRef, useState } from "react";
import { Filter, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/Badges";
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
import { STATUS_ACTIONS } from "@/utils/constants";

export default function ComplaintList({
  selected,
  onSelect,
  setStatusUpdate,
  onStatsChange,
  useGetComplaintsOfOfiicer,
}) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState("");
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
  });
  // console.log({selected})
  const complaints = useMemo(() => {
    return (
      data?.pages?.flatMap(
        (page) => page?.data?.docs || page?.data || page?.docs || [],
      ) || []
    );
  }, [data]);

  const lastStatsRef = useRef(null);

  // Automatically select the first complaint when the list loads or when current selection is filtered out
  useEffect(() => {
    if (complaints.length > 0) {
      const isSelectedInList = complaints.some(
        (c) => (c._id || c.id) === (selected?._id || selected?.id)
      );
      if (!selected || !isSelectedInList) {
        onSelect(complaints[0]);
      }
    } else {
      onSelect(null);
    }
  }, [complaints, selected, onSelect]);

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

      // Shallow equality check to prevent infinite loop on stats callback
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

  return (
    <div className="bg-white rounded-xl border border-border sticky top-20 min-h-0 flex flex-col w-full">
      <div className="px-4 py-3 border-b border-border ">
        <div className="flex items-center justify-between shrink-0">
          <h3 className="font-bold text-foreground text-sm">
            My Complaints ({complaints.length})
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0 cursor-pointer">
                <Filter className="w-4 h-4" />
                {(selectedStatus || selectedFeedback !== "") && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Status</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-40">
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("")}
                    className={!selectedStatus ? "font-semibold bg-accent text-accent-foreground" : ""}
                  >
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {STATUS_ACTIONS.map((action) => {
                    const isSelected = selectedStatus === action.value;
                    return (
                      <DropdownMenuItem
                        key={action.value}
                        onClick={() => setSelectedStatus(action.value)}
                        className={isSelected ? "font-semibold bg-accent text-accent-foreground" : ""}
                      >
                        {action.badgeLabel || action.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Feedback</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-44">
                  <DropdownMenuItem
                    onClick={() => setSelectedFeedback("")}
                    className={selectedFeedback === "" ? "font-semibold bg-accent text-accent-foreground" : ""}
                  >
                    All
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setSelectedFeedback("true")}
                    className={selectedFeedback === "true" ? "font-semibold bg-accent text-accent-foreground" : ""}
                  >
                    Feedback Done
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedFeedback("false")}
                    className={selectedFeedback === "false" ? "font-semibold bg-accent text-accent-foreground" : ""}
                  >
                    Feedback Left
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              {(selectedStatus || selectedFeedback !== "") && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => { setSelectedStatus(""); setSelectedFeedback(""); }}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    Clear Filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-2">
          <SearchDebounced
            placeholder="Search by id ..."
            handleDebouncedChange={(val) => setSearch(val)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin max-h-[600px] divide-y divide-border overscroll-contain">
        <LoaderErrWrapper isLoading={isLoading} error={error?.message || error}>
          {complaints.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No complaints assigned to you.
            </div>
          ) : (
            <>
              {complaints.map((c, i) => {
                const id = c._id || c.id;
                const isSelected = selected?._id == id;
                // console.log({selected : selected?._id, id, isSelected})
                return (
                  <button
                    key={id || i}
                    onClick={() => {
                      onSelect(c);
                      setStatusUpdate(null);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                      isSelected ? "bg-blue-50 border-l-4 border-blue-600" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {/* <ComplaintId
                        id={c.grievanceId || c.id}
                        className="text-xs font-semibold"
                      /> */}
                      <h2 className="text-xs font-bold text-primary font-mono">
                        {c.grievanceId || c.id}
                      </h2>

                      <StatusBadge status={c.status} />
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
                    className="w-full text-xs"
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
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
