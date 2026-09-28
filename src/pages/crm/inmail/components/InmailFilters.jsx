import React from "react";
import SearchDebounced from "@/components/debounced/SearchDebounced";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import TimeRangeFilter from "@/components/TimeRangeFilter";

export default function InmailFilters({
  search,
  onSearchChange,
  period,
  setPeriod,
  dateRange,
  setDateRange,
  filters = {},
  setFilters,
  filterOptions = [],
  activeTab,
  onReset,
}) {
  const { t } = useLanguage();

  const hasActiveFilters =
    Boolean(search) ||
    (period && period !== "monthly") ||
    Boolean(dateRange?.from) ||
    Object.values(filters || {}).some(
      (val) => val !== undefined && val !== "" && val !== "all",
    ) ||
    (activeTab && activeTab !== "all");

  return (
    <div className="p-3 sm:p-4 border-b border-border bg-muted/20 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      <SearchDebounced
        initialValue={search}
        handleDebouncedChange={onSearchChange}
        placeholder={t(
          "Search by sender, email, subject...",
          "प्रेषक, ईमेल, विषय द्वारा खोजें...",
        )}
        className="w-full lg:w-80"
        inputClassName="h-9 text-xs"
      />

      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
        <TimeRangeFilter
          period={period}
          setPeriod={setPeriod}
          dateRange={dateRange}
          setDateRange={setDateRange}
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          boxClassName="flex-wrap sm:flex-nowrap"
          hidePreSetOptions={true}
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-destructive hover:text-destructive cursor-pointer"
            onClick={onReset}
          >
            {t("Reset", "रीसेट")}
          </Button>
        )}
      </div>
    </div>
  );
}
