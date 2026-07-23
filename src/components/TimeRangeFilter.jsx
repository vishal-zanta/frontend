import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/context/LanguageContext";
import Filter from "@/components/Filter";

export default function TimeRangeFilter({
  period,
  setPeriod,
  dateRange,
  setDateRange,
  filters, 
  setFilters,
  filterOptions
}) {
  const { t } = useLanguage();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tempRange, setTempRange] = useState(dateRange);

  useEffect(() => {
    setTempRange(dateRange);
  }, [dateRange, popoverOpen]);

  const options = [
    { id: "daily", label: t("Today", "आज"), sub: "vs yesterday" },
    { id: "weekly", label: t("This Week", "इस सप्ताह"), sub: "vs last week" },
    { id: "monthly", label: t("This Month", "इस महीने"), sub: "vs last month" },
  ];

  const canSelectCustom = typeof setDateRange === "function";

  const handleApply = () => {
    if (setDateRange) {
      setDateRange(tempRange);
      if (tempRange?.from) {
        setPeriod("custom");
      }
    }
    setPopoverOpen(false);
  };

  const handleClear = () => {
    if (setDateRange) {
      setDateRange(undefined);
    }
    setTempRange(undefined);
    setPeriod("monthly");
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-white dark:bg-card border border-border rounded-lg p-0.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => {
              setPeriod(opt.id);
              if (setDateRange) setDateRange(undefined);
            }}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${period === opt.id ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:bg-muted dark:hover:bg-muted/50"}`}
            title={`Trends compared ${opt.sub}`}
          >
            {opt.label}
          </button>
        ))}

        {canSelectCustom && (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  period === "custom"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted dark:hover:bg-muted/50"
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                <span>{t("Custom", "कस्टम")}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 flex flex-col gap-3" align="end">
              <Calendar
                mode="range"
                defaultMonth={tempRange?.from || dateRange?.from || new Date()}
                selected={tempRange}
                onSelect={(range) => setTempRange(range)}
                numberOfMonths={2}
              />
              <div className="flex items-center justify-end gap-2 border-t border-border pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    setTempRange(dateRange);
                    setPopoverOpen(false);
                  }}
                >
                  {t("Cancel", "रद्द करें")}
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs bg-primary hover:bg-primary/90"
                  disabled={!tempRange?.from}
                  onClick={handleApply}
                >
                  {t("Apply", "लागू करें")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {setFilters && filterOptions && filterOptions.length > 0 && (
          <>
            <div className="w-[1px] h-4 bg-border mx-1 self-center" />
            <Filter
              filters={filters}
              setFilters={setFilters}
              filterOptions={filterOptions}
            />
          </>
        )}
      </div>

      {canSelectCustom && dateRange?.from && (
        <button
          onClick={handleClear}
          className="text-xs text-destructive hover:underline font-medium px-2 py-1 cursor-pointer"
        >
          {t("Clear", "साफ करें")}
        </button>
      )}
    </div>
  );
}
