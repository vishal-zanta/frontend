import React, { useMemo, useEffect } from "react";
import { Clock, Activity, TrendingUp, BarChart3 } from "lucide-react";
import StatCard from "@/components/StatCard";
import SlaComplianceChart from "./components/SlaComplianceChart";
import ExportButton from "@/components/ExportButton";
import { useLanguage } from "@/context/LanguageContext";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import { getDepartmentSlaServices, computeSlaStats } from "./dummyData";

const slaExportColumns = [
  { key: "service", label: "Service" },
  { key: "departmentName", label: "Department" },
  { key: "withinSLA", label: "Within SLA" },
  { key: "beyondSLA", label: "Beyond SLA" },
  { key: "compliance", label: "Compliance %" },
];

export default function SlaPerformanceTab({
  filters = {},
  pd,
  departmentData = [],
  dateRange = null,
}) {
  const { t } = useLanguage();
  const limitOptions = [10, 25, 50, 100];
  const { page, limit, setPage, setLimit } = usePagination(1, limitOptions);

  // Department-specific services based on filter & period scaling
  const servicesData = useMemo(() => {
    return getDepartmentSlaServices(
      filters?.department,
      pd,
      departmentData,
      dateRange,
    );
  }, [filters?.department, pd, departmentData, dateRange]);

  // Aggregate stats dynamically computed from the current data
  const stats = useMemo(() => {
    return computeSlaStats(servicesData);
  }, [servicesData]);

  // Reset pagination to first page whenever department filter or limit changes
  useEffect(() => {
    setPage(1);
  }, [filters?.department, limit, setPage]);

  // Active department display title
  const activeDepartment = useMemo(() => {
    if (!filters?.department || filters.department === "all") return null;
    const match = servicesData[0];
    if (!match) return null;
    return {
      title: t(
        match.departmentName,
        match.departmentHindi || match.departmentName,
      ),
      raw: match.departmentName,
    };
  }, [filters?.department, servicesData, t]);

  // Chart data: displays services ordered by lowest compliance (worst performing services first)
  const chartData = useMemo(() => {
    const list = servicesData.slice(0, 10);

    return list.map((s) => ({
      ...s,
      service: t(
        s.shortName || s.service,
        s.shortNameHindi || s.serviceHindi || s.shortName || s.service,
      ),
    }));
  }, [servicesData, t]);

  // Pagination calculation
  const totalRecords = servicesData.length;
  const totalPage = Math.ceil(totalRecords / limit) || 1;
  const paginatedData = servicesData.slice((page - 1) * limit, page * limit);

  // Worst service label and display
  const worstServiceDisplay = useMemo(() => {
    if (!stats.worstService) return t("None", "कोई नहीं");
    const label = t(
      stats.worstService.shortName || stats.worstService.service,
      stats.worstService.shortNameHindi ||
        stats.worstService.serviceHindi ||
        stats.worstService.shortName,
    );
    return `${label} (${Number(stats.worstService.compliance).toFixed(1)}%)`;
  }, [stats.worstService, t]);

  return (
    <div className="space-y-6">
      {/* Dynamic Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label={t("Within SLA", "एसएलए के भीतर")}
          value={stats.withinSLA.toLocaleString("en-IN")}
          color="green"
          trend="up"
          trendValue={pd?.sub ? `+2.4% (${pd.sub})` : "+2.4%"}
        />
        <StatCard
          icon={Activity}
          label={t("Beyond SLA", "एसएलए से बाहर")}
          value={stats.beyondSLA.toLocaleString("en-IN")}
          color="red"
          trend="down"
          trendValue={pd?.sub ? `-1.1% (${pd.sub})` : "-1.1%"}
        />
        <StatCard
          icon={TrendingUp}
          label={t("Compliance Rate", "अनुपालन दर")}
          value={`${Number(stats.complianceRate).toFixed(1)}%`}
          color={
            Number(stats.complianceRate) >= 95
              ? "green"
              : Number(stats.complianceRate) >= 90
                ? "blue"
                : "amber"
          }
          sublabel={t("Target: 95%", "लक्ष्य: 95%")}
          trend={Number(stats.complianceRate) >= 95 ? "up" : "down"}
          trendValue={
            Number(stats.complianceRate) >= 95
              ? `+${(Number(stats.complianceRate) - 95).toFixed(1)}% (${pd?.sub || t("target", "लक्ष्य")})`
              : `-${(95 - Number(stats.complianceRate)).toFixed(1)}% (${pd?.sub || t("target", "लक्ष्य")})`
          }
        />
        <StatCard
          icon={BarChart3}
          label={t("Worst Service", "न्यूनतम सेवा")}
          value={worstServiceDisplay}
          sublabel={
            stats.worstService
              ? `${stats.worstService.beyondSLA.toLocaleString("en-IN")} ${t("breached", "उल्लंघन")}`
              : undefined
          }
          color="amber"
        />
      </div>

      {/* SLA Compliance Graph */}
      <SlaComplianceChart
        data={chartData}
        xKey="service"
        title={
          activeDepartment
            ? `${t("SLA Compliance", "एसएलए अनुपालन")} - ${activeDepartment.title}`
            : t("SLA Compliance by Service", "सेवा द्वारा एसएलए अनुपालन")
        }
        subtitle={
          activeDepartment
            ? t(
                "Within vs beyond SLA for departmental services",
                "विभागीय सेवाओं के लिए एसएलए के भीतर बनाम बाहर",
              )
            : t(
                "Within vs beyond SLA per service category",
                "प्रत्येक सेवा श्रेणी में एसएलए के भीतर बनाम बाहर",
              )
        }
      />

      {/* SLA Performance Detail Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div>
            <h3 className="font-bold text-foreground">
              {t("SLA Performance Detail", "एसएलए प्रदर्शन विवरण")}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeDepartment
                ? `${activeDepartment.title} (${totalRecords} ${t("services", "सेवाएं")})`
                : `${t("All Departments", "सभी विभाग")} (${totalRecords} ${t("services", "सेवाएं")})`}
            </p>
          </div>
          <ExportButton
            data={servicesData}
            columns={slaExportColumns}
            filename={
              activeDepartment
                ? `sla_${activeDepartment.raw.toLowerCase().replace(/[^a-z0-9]/g, "_")}`
                : "sla_performance"
            }
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">
                  {t("Service", "सेवा")}
                </th>
                <th className="px-4 py-2 font-medium text-right">
                  {t("Within SLA", "एसएलए के भीतर")}
                </th>
                <th className="px-4 py-2 font-medium text-right">
                  {t("Beyond SLA", "एसएलए से बाहर")}
                </th>
                <th className="px-4 py-2 font-medium text-right">
                  {t("Compliance %", "अनुपालन %")}
                </th>
                <th className="px-4 py-2 font-medium text-right">
                  {t("Benchmark", "मानक")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.map((s, i) => (
                <tr
                  key={s.id || i}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-foreground">
                      {t(s.service, s.serviceHindi || s.service)}
                    </div>
                    {!activeDepartment && s.departmentName && (
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {t(
                          s.departmentName,
                          s.departmentHindi || s.departmentName,
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right text-emerald-600 font-semibold">
                    {s.withinSLA.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-2.5 text-right text-red-600 font-semibold">
                    {s.beyondSLA.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span
                      className={`font-bold inline-block px-1.5 py-0.5 rounded text-xs ${
                        s.compliance >= 95
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : s.compliance >= 90
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                            : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                      }`}
                    >
                      {Number(s.compliance).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs text-muted-foreground">
                    {t("Target: 95%", "लक्ष्य: 95%")} |{" "}
                    {s.compliance >= 95 ? (
                      <span className="text-emerald-600 font-medium">
                        {t("✓ Met", "✓ पूरा हुआ")}
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium">
                        {Math.max(0, 95 - s.compliance).toFixed(1)}%{" "}
                        {t("below", "कम")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground text-sm"
                  >
                    {t(
                      "No services found for selected department.",
                      "चयनित विभाग के लिए कोई सेवा नहीं मिली।",
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          totalPage={totalPage}
          limitOptions={limitOptions}
        />
      </div>
    </div>
  );
}
