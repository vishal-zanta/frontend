import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import SearchDebounced from "@/components/debounced/SearchDebounced";
import { StatusBadge } from "@/components/Badges";
import { SLATimer } from "@/components/complaints/ComplaintDetailHeader";
import {
  useGetComplaintsOfOfiicer,
  useGetComplaintsForCCEandAdminInfinite,
} from "@/hooks/query/useGetComplaints";
import { Button } from "@/components/ui/button";

const SearchComplaints = () => {
  const { t } = useLanguage();
  const { profiledata } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  const isOfficer = profiledata?.isOfficer;

  // Officer infinite query
  const {
    data: officerData,
    isLoading: officerLoading,
    hasNextPage: officerHasNext,
    fetchNextPage: officerFetchNext,
    isFetchingNextPage: officerFetchingNext,
  } = useGetComplaintsOfOfiicer(
    { search, limit: 10 },
    { enabled: isOfficer && !!search },
  );

  // CRM/Admin infinite query
  const {
    data: crmData,
    isLoading: crmLoading,
    hasNextPage: crmHasNext,
    fetchNextPage: crmFetchNext,
    isFetchingNextPage: crmFetchingNext,
  } = useGetComplaintsForCCEandAdminInfinite(
    { search, limit: 10 },
    { enabled: !isOfficer && !!search },
  );

  const isLoading = isOfficer ? officerLoading : crmLoading;
  const hasNextPage = isOfficer ? officerHasNext : crmHasNext;
  const fetchNextPage = isOfficer ? officerFetchNext : crmFetchNext;
  const isFetchingNextPage = isOfficer ? officerFetchingNext : crmFetchingNext;
  const data = isOfficer ? officerData : crmData;

  const complaints = useMemo(() => {
    return (
      data?.pages?.flatMap(
        (page) => page?.data?.docs || page?.data?.data?.docs || page?.data || page?.docs || [],
      ) || []
    );
  }, [data]);

  // Show popover when search has value
  useEffect(() => {
    if (search) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [search]);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Infinite scroll on popover
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - 40) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSelect = (complaint) => {
    setIsOpen(false);
    setSearch("");
    if (isOfficer) {
      navigate(`/officer/complaints?complaint=${complaint.grievanceId}`, {
        state: { grievanceId: complaint.grievanceId }, replace: true,
      });
    } else {
      navigate(`/crm/track-complaint?complaint=${complaint.grievanceId}`, {
        state: { grievanceId: complaint.grievanceId }, replace: true,
      });
    }
  };

  return (
    <div ref={containerRef} className="hidden md:block relative">
      <SearchDebounced
        placeholder={t("Search complaints...", "शिकायतें खोजें...")}
        handleDebouncedChange={(val) => setSearch(val)}
        delay={500}
        className="w-48 lg:w-64"
        inputClassName="h-9 bg-muted border-none text-sm"
      />

      {/* Results Popover */}
      {isOpen && search && (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute top-full left-0 right-0 mt-1 z-[999] bg-card border border-border rounded-xl shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto scrollbar-thin"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("Searching...", "खोज रहे हैं...")}
            </div>
          ) : complaints.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              {t("No complaints found.", "कोई शिकायत नहीं मिली।")}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {complaints.map((c, i) => {
                const id = c._id || c.id;
                return (
                  <button
                    key={id || i}
                    onClick={() => handleSelect(c)}
                    className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xs font-bold text-primary font-mono">
                          {c.grievanceId || c.id}
                        </h2>
                        <StatusBadge status={c.status} />
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        <SLATimer
                          createdAt={c.createdAt}
                          slaHours={
                            c.classification?.subService?.sla || c.slaHours
                          }
                        />
                        {!!c.assignedAt && (
                          <SLATimer
                            createdAt={c.assignedAt}
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
                      {`${c.address?.villageOrWard || c.ward || "-"}, ${c.address?.district?.name || "-"}, ${c.address?.state || "-"}`.replaceAll(
                        "-,",
                        "",
                      )}
                    </div>
                  </button>
                );
              })}

              {isFetchingNextPage && (
                <div className="flex items-center justify-center gap-2 px-4 py-3 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {t("Loading more...", "और लोड हो रहा है...")}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComplaints;
