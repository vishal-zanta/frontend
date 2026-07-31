import React, { useState } from "react";
import {
  PERFORMANCE_DATA,
  ULB_INTELLIGENCE,
  ESCALATION_DATA,
  ESCALATION_BY_CATEGORY,
  AGING_ANALYSIS,
  OFFICER_RANKING,
} from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import StatCard from "@/components/StatCard";
import { ChartCard, SectionTitle } from "@/components/ChartCard";
import { BarChartCard, PieChartCard } from "@/components/Charts";
import { Award, TrendingUp, AlertTriangle, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TimeRangeFilter from "@/components/TimeRangeFilter";
import { MAX_LIMIT } from "@/utils/constants";
import useGetRoles from "@/hooks/query/useGetRoles";
import { useGetUsers } from "@/pages/admin/user-management/hooks";
import { useLanguage } from "@/context/LanguageContext";

export default function PerformanceDashboard() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState("daily");
  const [dateRange, setDateRange] = useState({});
  const [filters, setFilters] = useState({});

  const { data: rolesApiData } = useGetRoles([], { page: 1, limit: MAX_LIMIT });
  // const rolesList = ;
  const roleOptions = (rolesApiData?.data?.docs || [])
    .filter(
      (r) =>
        r.designationEnglish.startsWith("L1") ||
        r.designationEnglish.startsWith("L2"),
    )
    .map((r) => ({
      label: r.designationEnglish,
      value: r._id,
    }));
  const roleIds = roleOptions.map((r) => r.value).join(",");
  const { data: usersApiData } = useGetUsers(
    ["all-users-performance", roleIds],
    {
      page: 1,
      limit: MAX_LIMIT,
      role: roleIds,
    },
    !!roleIds
  );

  const usersList =
    usersApiData?.data?.data?.docs ||
    usersApiData?.data?.docs ||
    usersApiData?.docs ||
    [];

  const filterOptions = [
    {
      filterKey: "role",
      label: t("By Role", "भूमिका के अनुसार"),
      options: roleOptions,
    },
    {
      filterKey: "user",
      label: t("By User", "उपयोगकर्ता के अनुसार"),
      options: usersList.map((u) => ({
        label: u.name,
        value: u._id,
      })),
    },
  ];
  const sub =
    period === "daily"
      ? t("vs yesterday", "बनाम कल")
      : period === "weekly"
        ? t("vs last week", "बनाम पिछला सप्ताह")
        : t("vs last month", "बनाम पिछला महीना");

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SectionTitle
            title={t("Performance Dashboard", "प्रदर्शन डैशबोर्ड")}
            subtitle={t("Service-wise, district-wise, division-wise & ULB-wise performance analytics", "सेवा-वार, जिला-वार, प्रमंडल-वार और ULB-वार प्रदर्शन विश्लेषण")}
          />
          <TimeRangeFilter
            period={period}
            setPeriod={setPeriod}
            dateRange={dateRange}
            setDateRange={setDateRange}
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
          />
        </div>

        {/* Stats ON TOP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={TrendingUp}
            label={t("Avg SLA Compliance", "औसत SLA अनुपालन")}
            value="93.8%"
            color="green"
            trend="up"
            trendValue={`+1.2% (${sub})`}
            sublabel={t("Target: 95%", "लक्ष्य: 95%")}
          />
          <StatCard
            icon={AlertTriangle}
            label={t("Avg Breach Rate", "औसत उल्लंघन दर")}
            value="6.2%"
            color="red"
            trend="down"
            trendValue={`-0.8% (${sub})`}
            sublabel={t("Target: <5%", "लक्ष्य: <5%")}
          />
          <StatCard
            icon={Clock}
            label={t("Avg Resolution", "औसत समाधान")}
            value={t("2.4 days", "2.4 दिन")}
            color="blue"
            sublabel={t("Target: <2 days", "लक्ष्य: <2 दिन")}
          />
          <StatCard
            icon={Award}
            label={t("Top Officer", "शीर्ष अधिकारी")}
            value="Prakash Jha"
            sublabel="98.5% SLA"
            color="purple"
          />
        </div>

        {/* Service & District performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title={t("Service-wise Performance", "सेवा-वार प्रदर्शन")}
            subtitle={t("SLA compliance by service category", "सेवा श्रेणी द्वारा SLA अनुपालन")}
          >
            <BarChartCard
              data={PERFORMANCE_DATA.serviceWise}
              xKey="service"
              bars={[
                { key: "withinSLA", label: t("Within SLA", "SLA के भीतर"), color: "#22c55e" },
                { key: "beyondSLA", label: t("Beyond SLA", "SLA से बाहर"), color: "#ef4444" },
              ]}
            />
          </ChartCard>
          <ChartCard
            title={t("Division-wise Performance", "प्रमंडल-वार प्रदर्शन")}
            subtitle={t("Complaints resolved vs total by division", "प्रमंडल द्वारा निराकृत बनाम कुल शिकायतें")}
          >
            <BarChartCard
              data={PERFORMANCE_DATA.divisionWise}
              xKey="division"
              bars={[
                { key: "complaints", label: t("Total", "कुल"), color: "#1d4ed8" },
                { key: "resolved", label: t("Resolved", "निराकृत"), color: "#22c55e" },
              ]}
            />
          </ChartCard>
        </div>

        {/* Time Delayed */}
        <ChartCard
          title={t("Time-Delayed Services", "समय-विलंबित सेवाएं")}
          subtitle={t("Average delay & breach rate by service", "सेवा द्वारा औसत विलंब और उल्लंघन दर")}
        >
          <BarChartCard
            data={PERFORMANCE_DATA.timeDelayed}
            xKey="service"
            bars={[
              { key: "breachRate", label: t("Breach Rate %", "उल्लंघन दर %"), color: "#ef4444" },
            ]}
            legend={false}
          />
        </ChartCard>

        {/* Escalation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title={t("Escalation Levels", "वृद्धि के स्तर")}
            subtitle={t("Distribution by escalation level", "वृद्धि स्तर द्वारा विवरण")}
          >
            <PieChartCard
              data={ESCALATION_DATA.map((e) => ({
                name: e.level,
                value: e.count,
                color: ["#1d4ed8", "#f59e0b", "#ef4444", "#a855f7"][
                  ESCALATION_DATA.indexOf(e)
                ],
              }))}
            />
          </ChartCard>
          <ChartCard
            title={t("Escalation by Service Category", "सेवा श्रेणी द्वारा वृद्धि")}
            subtitle={t("Escalation rate per service", "प्रति सेवा वृद्धि दर")}
          >
            <BarChartCard
              data={ESCALATION_BY_CATEGORY}
              xKey="category"
              bars={[
                { key: "escalations", label: t("Escalations", "वृद्धियां"), color: "#ef4444" },
              ]}
              legend={false}
            />
          </ChartCard>
        </div>

        {/* Aging Analysis */}
        <ChartCard
          title={t("Aging Analysis", "आयु विश्लेषण")}
          subtitle={t("How many complaints resolved in how many days", "कितने दिनों में कितनी शिकायतें निराकृत हुईं")}
        >
          <BarChartCard
            data={AGING_ANALYSIS}
            xKey="range"
            bars={[{ key: "count", label: t("Complaints", "शिकायतें"), color: "#0ea5e9" }]}
            legend={false}
          />
        </ChartCard>

        {/* Officer Ranking */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> {t("Officer Ranking Report", "अधिकारी रैंकिंग रिपोर्ट")}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">{t("Rank", "रैंक")}</th>
                  <th className="px-4 py-2 font-medium">{t("Officer", "अधिकारी")}</th>
                  <th className="px-4 py-2 font-medium">{t("Designation", "पदनाम")}</th>
                  <th className="px-4 py-2 font-medium">{t("District", "जिला")}</th>
                  <th className="px-4 py-2 font-medium text-right">{t("Resolved", "निराकृत")}</th>
                  <th className="px-4 py-2 font-medium text-right">{t("SLA %", "SLA %")}</th>
                  <th className="px-4 py-2 font-medium">{t("Avg Resolution", "औसत निस्तारण")}</th>
                  <th className="px-4 py-2 font-medium">{t("Rating", "रेटिंग")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {OFFICER_RANKING.map((o, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-2.5">
                      <span
                        className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold ${o.rank <= 3 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground"}`}
                      >
                        #{o.rank}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-medium">{o.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {o.designation}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {o.district}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-emerald-600">
                      {o.resolved}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {o.slaCompliance}%
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {o.avgResolution}
                    </td>
                    <td className="px-4 py-2.5 text-amber-600 font-medium">
                      ★ {o.rating}/5
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ULB Intelligence */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" /> {t("ULB Intelligence Report", "ULB बुद्धिमत्ता रिपोर्ट")}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">{t("ULB", "ULB")}</th>
                  <th className="px-4 py-2 font-medium text-right">
                    {t("Population", "जनसंख्या")}
                  </th>
                  <th className="px-4 py-2 font-medium text-center">{t("Rank", "रैंक")}</th>
                  <th className="px-4 py-2 font-medium text-right">
                    {t("Complaints", "शिकायतें")}
                  </th>
                  <th className="px-4 py-2 font-medium text-right">
                    {t("Per Capita", "प्रति व्यक्ति")}
                  </th>
                  <th className="px-4 py-2 font-medium text-right">{t("SLA %", "SLA %")}</th>
                  <th className="px-4 py-2 font-medium">{t("Rating", "रेटिंग")}</th>
                  <th className="px-4 py-2 font-medium">{t("Trend", "रुझान")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ULB_INTELLIGENCE.map((u, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-2.5 font-medium">{u.ulb}</td>
                    <td className="px-4 py-2.5 text-right">
                      {u.population.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <Badge variant="outline" className="text-xs">
                        #{u.rank}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {u.complaints.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2.5 text-right">{u.perCapita}</td>
                    <td className="px-4 py-2.5 text-right font-semibold">
                      {u.slaCompliance}%
                    </td>
                    <td className="px-4 py-2.5 text-amber-600 font-medium">
                      ★ {u.rating}/5
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`text-xs font-medium ${u.trend === "up" ? "text-emerald-600" : u.trend === "down" ? "text-red-600" : "text-muted-foreground"}`}
                      >
                        {u.trend === "up"
                          ? "↑"
                          : u.trend === "down"
                            ? "↓"
                            : "→"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
