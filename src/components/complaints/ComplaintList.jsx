import React, { useEffect, useMemo, useRef, useState } from "react";
import { Filter, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { StatusBadge } from "@/components/Badges";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import SearchDebounced from "../debounced/SearchDebounced";

export default function ComplaintList({
  selected,
  onSelect,
  setStatusUpdate,
  onStatsChange,
  useGetComplaintsOfOfiicer,
}) {
  const [search, setSearch] = useState("");
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetComplaintsOfOfiicer({ limit: 10, search });
  // console.log({selected})
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
    if (complaints.length > 0 && !selected) {
      onSelect(complaints[0]);
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
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2">
          <SearchDebounced
            placeholder="Search by id ..."
            handleDebouncedChange={(val) => setSearch(val)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin max-h-[600px] divide-y divide-border">
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
