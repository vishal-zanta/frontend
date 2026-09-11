import React from "react";
import SearchDebounced from "@/components/debounced/SearchDebounced";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";

export default function InmailFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  activeTab,
  onReset,
}) {
  const { t } = useLanguage();

  return (
    <div className="p-3 sm:p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
      <SearchDebounced
        initialValue={search}
        handleDebouncedChange={onSearchChange}
        placeholder={t(
          "Search by sender, email, subject...",
          "प्रेषक, ईमेल, विषय द्वारा खोजें...",
        )}
        className="w-full sm:w-80"
        inputClassName="h-9 text-xs"
      />

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="w-40">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue
                placeholder={t("All Statuses", "सभी स्थितियाँ")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("All Statuses", "सभी स्थितियाँ")}
              </SelectItem>
              <SelectItem value="PENDING">
                {t("Pending", "लंबित")}
              </SelectItem>
              <SelectItem value="CONVERTED">
                {t("Converted", "शिकायत दर्ज")}
              </SelectItem>
              <SelectItem value="REJECTED">
                {t("Rejected", "अस्वीकृत")}
              </SelectItem>
              <SelectItem value="CLOSED">{t("Closed", "बंद")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(search || statusFilter !== "all" || activeTab !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-xs text-destructive hover:text-destructive cursor-pointer"
            onClick={onReset}
          >
            {t("Reset", "रीसेट")}
          </Button>
        )}
      </div>
    </div>
  );
}
