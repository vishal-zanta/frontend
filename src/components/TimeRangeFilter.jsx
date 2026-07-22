import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
  const options = [
    { id: "daily", label: t("Today", "आज"), sub: "vs yesterday" },
    { id: "weekly", label: t("This Week", "इस सप्ताह"), sub: "vs last week" },
    { id: "monthly", label: t("This Month", "इस महीने"), sub: "vs last month" },
  ];

  const canSelectCustom = typeof setDateRange === "function";

  const handleSelect = (range) => {
    if (setDateRange) {
      setDateRange(range);
      if (range?.from) {
        setPeriod("custom");
      }
    }
  };

  const handleClear = () => {
    if (setDateRange) {
      setDateRange(undefined);
    }
    setPeriod("monthly");
    // setFilters({});
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
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  period === "custom"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted dark:hover:bg-muted/50"
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                {/* {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : ( */}
                <span>{t("Custom", "कस्टम")}</span>
                {/* )} */}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from || new Date()}
                selected={dateRange}
                onSelect={handleSelect}
                numberOfMonths={2}
              />
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
