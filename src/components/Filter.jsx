import React from "react";
import { Filter as FilterIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import useSyncSearchParams from "@/hooks/useSyncSearchParams";

export default function Filter({
  filters = {},
  setFilters,
  filterOptions = [],
  onReset,
}) {
  const { t } = useLanguage();
  useSyncSearchParams(filters, setFilters);
  const hasActiveFilters = Object.values(filters).some(
    (val) => val !== undefined && val !== "",
  );

  const handleSelectFilter = (key, value, isMultiple = false) => {
    if (setFilters) {
      setFilters((prev) => {
        const next = { ...prev };
        let finalValue = value;

        if (isMultiple && value !== undefined && value !== "") {
          const currentVals = next[key]
            ? String(next[key]).split(",").filter(Boolean)
            : [];
          const strVal = String(value);
          let updatedVals;
          if (currentVals.includes(strVal)) {
            updatedVals = currentVals.filter((v) => v !== strVal);
          } else {
            updatedVals = [...currentVals, strVal];
          }
          finalValue =
            updatedVals.length > 0 ? updatedVals.join(",") : undefined;
        }

        if (finalValue === undefined || finalValue === "") {
          delete next[key];
        } else {
          next[key] = finalValue;
        }

        return next;
      });
    }
  };

  const handleClearAll = () => {
    if (onReset) {
      onReset();
    } else if (setFilters) {
      setFilters({});
    }
  };

  const renderOptionItems = (opt) => (
    <>
      <DropdownMenuItem
        onClick={() =>
          handleSelectFilter(opt.filterKey, undefined, opt.isMultiple)
        }
        className={`cursor-pointer text-xs py-1.5 ${
          !filters[opt.filterKey]
            ? "font-semibold bg-accent text-accent-foreground"
            : ""
        }`}
      >
        {t("All", "सभी")}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      {opt.options?.map((subOpt) => {
        const currentValues =
          opt.isMultiple && filters[opt.filterKey]
            ? String(filters[opt.filterKey]).split(",").filter(Boolean)
            : [];
        const isSelected = opt.isMultiple
          ? currentValues.includes(String(subOpt.value))
          : filters[opt.filterKey] !== undefined &&
            filters[opt.filterKey] !== "" &&
            String(filters[opt.filterKey]) === String(subOpt.value);

        return (
          <DropdownMenuItem
            key={subOpt.value}
            onClick={() =>
              handleSelectFilter(opt.filterKey, subOpt.value, opt.isMultiple)
            }
            className={`cursor-pointer text-xs py-1.5 ${
              isSelected ? "font-semibold bg-accent text-accent-foreground" : ""
            }`}
          >
            {subOpt.label}
          </DropdownMenuItem>
        );
      })}
    </>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 cursor-pointer relative h-7 ${
            hasActiveFilters
              ? "bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-blue-400 font-semibold"
              : "text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-muted dark:hover:bg-muted/50"
          }`}
        >
          <FilterIcon className="w-3.5 h-3.5" />
          <span>
            {filterOptions?.length === 1
              ? t(filterOptions?.[0]?.label, filterOptions?.[0]?.labelHindi)
              : t("Filter", "फ़िल्टर")}
          </span>
          {hasActiveFilters && (
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={`${
          filterOptions?.length === 1 ? "w-56" : "w-48"
        } max-h-80 overflow-y-auto bg-card border border-border pb-0`}
      >
        {filterOptions?.length === 1
          ? renderOptionItems(filterOptions[0])
          : filterOptions?.map((opt) => (
              <DropdownMenuSub key={opt.filterKey}>
                <DropdownMenuSubTrigger className="cursor-pointer flex items-center justify-between text-xs py-1.5">
                  <span className="flex items-center gap-1.5">
                    {t(opt.label, opt.label)}
                    {filters[opt.filterKey] && (
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    )}
                  </span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-56 max-h-80  overflow-y-auto bg-card border border-border">
                  {renderOptionItems(opt)}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ))}

        {hasActiveFilters && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleClearAll}
              className="text-destructive focus:text-destructive cursor-pointer text-xs py-1.5 m-0 font-medium sticky bottom-0 bg-white pb-2"
            >
              {t("Clear All", "सभी साफ़ करें")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
