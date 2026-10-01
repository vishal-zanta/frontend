import React from "react";
import { Search, ShieldCheck, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";

export default function CallHistoryFilters({
  search,
  onSearchChange,
  agents = [],
  agentFilter,
  onAgentFilterChange,
  callTypeFilter = "all",
  onCallTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  evidenceOnly,
  onEvidenceOnlyToggle,
  onResetFilters,
}) {
  const { t } = useLanguage();

  const hasActiveFilters =
    search ||
    agentFilter !== "all" ||
    callTypeFilter !== "all" ||
    statusFilter !== "all" ||
    evidenceOnly;

  return (
    <div className="bg-card rounded-xl border border-border p-3 xs:p-4 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-2.5 sm:gap-3">
      {/* Search Bar */}
      <div className="relative w-full xs:w-auto flex-1 min-w-[200px] max-w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t(
            "Search call ID, complaint, mobile...",
            "कॉल आईडी, शिकायत या मोबाइल द्वारा खोजें..."
          )}
          className="pl-8 w-full h-9 text-xs"
        />
      </div>

      {/* Call Type Filter */}
      <Select value={callTypeFilter} onValueChange={onCallTypeFilterChange}>
        <SelectTrigger className="w-full xs:w-32 sm:w-36 h-9 text-xs bg-background">
          <SelectValue placeholder={t("Call Type", "कॉल प्रकार")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("All Types", "सभी प्रकार")}</SelectItem>
          <SelectItem value="Outbound">{t("Outbound", "आउटबाउंड")}</SelectItem>
          <SelectItem value="Inbound">{t("Inbound", "इनबाउंड")}</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full xs:w-32 sm:w-36 h-9 text-xs bg-background">
          <SelectValue placeholder={t("Status", "स्थिति")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("All Status", "सभी स्थिति")}</SelectItem>
          <SelectItem value="Initiated">{t("Initiated", "आरंभ किया गया")}</SelectItem>
          <SelectItem value="In Progress">{t("In Progress", "प्रगति पर")}</SelectItem>
          <SelectItem value="Completed">{t("Completed", "पूर्ण")}</SelectItem>
          <SelectItem value="Resolved">{t("Resolved", "समाधान की गई")}</SelectItem>
          <SelectItem value="Missed">{t("Missed", "मिस्ड कॉल")}</SelectItem>
          <SelectItem value="Failed">{t("Failed", "असफल")}</SelectItem>
        </SelectContent>
      </Select>

      {/* Agent Filter (Dynamic from real calls) */}
      {agents.length > 0 && (
        <Select value={agentFilter} onValueChange={onAgentFilterChange}>
          <SelectTrigger className="w-full xs:w-36 sm:w-40 h-9 text-xs bg-background">
            <SelectValue placeholder={t("Agent", "एजेंट")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("All Agents", "सभी एजेंट")}</SelectItem>
            {agents.map((ag) => (
              <SelectItem key={ag} value={ag}>
                {ag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Evidence Only Button */}
      <Button
        variant={evidenceOnly ? "default" : "outline"}
        size="sm"
        onClick={onEvidenceOnlyToggle}
        className="w-full xs:w-auto h-9 text-xs"
      >
        <ShieldCheck className="w-4 h-4 mr-1 text-purple-500" />
        {evidenceOnly
          ? t("Showing Evidence Only", "केवल साक्ष्य")
          : t("Evidence Only", "केवल साक्ष्य")}
      </Button>

      {/* Reset Filter Button */}
      {hasActiveFilters && onResetFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="h-9 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          {t("Reset", "रीसेट")}
        </Button>
      )}
    </div>
  );
}
