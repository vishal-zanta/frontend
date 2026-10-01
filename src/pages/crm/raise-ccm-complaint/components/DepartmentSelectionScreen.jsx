import React from "react";
import { ArrowLeft, Search, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import PortalLayout from "@/components/PortalLayout";
import { useLanguage } from "@/context/LanguageContext";

export default function DepartmentSelectionScreen({
  role,
  searchQuery,
  setSearchQuery,
  filteredDepartments,
  departmentsLoading,
  onSelectDept,
  onBack,
}) {
  const { t, lang } = useLanguage();

  return (
    <PortalLayout role={role}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title={t("Back", "पीछे जाएं")}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {t("Register Complaint", "शिकायत दर्ज करें")}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {t(
                  "Currently, complaints can be registered for the following departments",
                  "वर्तमान में निम्न विभागों से संबंधित शिकायत दर्ज कर सकते है",
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Search department...", "विभाग खोजें...")}
            className="pl-10 h-11 rounded-xl bg-card border-border shadow-xs"
          />
        </div>

        {/* Departments Grid Boxes */}
        {departmentsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 animate-pulse"
              />
            ))}
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/50">
            <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground font-medium">
              {t("No departments found", "कोई विभाग नहीं मिला")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredDepartments.map((dept) => {
              const label =
                lang === "hi" && dept.nameHindi ? dept.nameHindi : dept.name;

              return (
                <button
                  key={dept.key}
                  type="button"
                  onClick={() => onSelectDept(dept.key)}
                  className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 shadow-xs hover:shadow-md text-left cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary hover:-translate-y-0.5 min-h-[72px]"
                >
                  <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary-foreground transition-colors line-clamp-2 leading-snug capitalize">
                    {t(label, dept.nameHindi)}
                  </h3>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
