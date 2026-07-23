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

export default function Filter({ filters = {}, setFilters, filterOptions = [] }) {
  const { t } = useLanguage();

  const hasActiveFilters = Object.values(filters).some(
    (val) => val !== undefined && val !== ""
  );

  const handleSelectFilter = (key, value) => {
    if (setFilters) {
      const next = { ...filters };
        if (value === undefined || value === "") {
          delete next[key];
        } else {
          next[key] = value;
        }
      setFilters(next);
    }
  };

  const handleClearAll = () => {
    if (setFilters) {
      setFilters({});
    }
  };

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
          <span>{t("Filter", "फ़िल्टर")}</span>
          {hasActiveFilters && (
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48 bg-card border border-border">
        {filterOptions.map((opt) => (
          <DropdownMenuSub key={opt.filterKey}>
            <DropdownMenuSubTrigger className="cursor-pointer flex items-center justify-between text-xs py-1.5">
              <span className="flex items-center gap-1.5">
                {t(opt.label, opt.label)}
                {filters[opt.filterKey] && (
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-44 bg-card border border-border">
              <DropdownMenuItem
                onClick={() => handleSelectFilter(opt.filterKey, undefined)}
                className={`cursor-pointer text-xs py-1.5 ${
                  !filters[opt.filterKey]
                    ? "font-semibold bg-accent text-accent-foreground"
                    : ""
                }`}
              >
                {t("All", "सभी")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {opt.options.map((subOpt) => {
                const isSelected = filters[opt.filterKey] === subOpt.value;
                return (
                  <DropdownMenuItem
                    key={subOpt.value}
                    onClick={() => handleSelectFilter(opt.filterKey, subOpt.value)}
                    className={`cursor-pointer text-xs py-1.5 ${
                      isSelected
                        ? "font-semibold bg-accent text-accent-foreground"
                        : ""
                    }`}
                  >
                    {subOpt.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}

        {hasActiveFilters && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleClearAll}
              className="text-destructive focus:text-destructive cursor-pointer text-xs py-1.5 font-medium"
            >
              {t("Clear All", "सभी साफ़ करें")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
