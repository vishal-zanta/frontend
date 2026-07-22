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

export default function PerformanceDashboard() {
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
      label: "By Role",
      options: roleOptions,
    },
    {
      filterKey: "user",
      label: "By User",
      options: usersList.map((u) => ({
        label: u.name,
        value: u._id,
      })),
    },
  ];
  const sub =
    period === "daily"
      ? "vs yesterday"
      : period === "weekly"
        ? "vs last week"
        : "vs last month";

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SectionTitle
            title="Performance Dashboard"
            subtitle="Service-wise, district-wise, division-wise & ULB-wise performance analytics"
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
            label="Avg SLA Compliance"
            value="93.8%"
            color="green"
            trend="up"
            trendValue={`+1.2% (${sub})`}
            sublabel="Target: 95%"
          />
          <StatCard
            icon={AlertTriangle}
            label="Avg Breach Rate"
            value="6.2%"
            color="red"
            trend="down"
            trendValue={`-0.8% (${sub})`}
            sublabel="Target: <5%"
          />
          <StatCard
            icon={Clock}
            label="Avg Resolution"
            value="2.4 days"
            color="blue"
            sublabel="Target: <2 days"
          />
          <StatCard
            icon={Award}
            label="Top Officer"
            value="Prakash Jha"
            sublabel="98.5% SLA"
            color="purple"
          />
        </div>

        {/* Service & District performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Service-wise Performance"
            subtitle="SLA compliance by service category"
          >
            <BarChartCard
              data={PERFORMANCE_DATA.serviceWise}
              xKey="service"
              bars={[
                { key: "withinSLA", label: "Within SLA", color: "#22c55e" },
                { key: "beyondSLA", label: "Beyond SLA", color: "#ef4444" },
              ]}
            />
          </ChartCard>
          <ChartCard
            title="Division-wise Performance"
            subtitle="Complaints resolved vs total by division"
          >
            <BarChartCard
              data={PERFORMANCE_DATA.divisionWise}
              xKey="division"
              bars={[
                { key: "complaints", label: "Total", color: "#1d4ed8" },
                { key: "resolved", label: "Resolved", color: "#22c55e" },
              ]}
            />
          </ChartCard>
        </div>

        {/* Time Delayed */}
        <ChartCard
          title="Time-Delayed Services"
          subtitle="Average delay & breach rate by service"
        >
          <BarChartCard
            data={PERFORMANCE_DATA.timeDelayed}
            xKey="service"
            bars={[
              { key: "breachRate", label: "Breach Rate %", color: "#ef4444" },
            ]}
            legend={false}
          />
        </ChartCard>

        {/* Escalation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Escalation Levels"
            subtitle="Distribution by escalation level"
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
            title="Escalation by Service Category"
            subtitle="Escalation rate per service"
          >
            <BarChartCard
              data={ESCALATION_BY_CATEGORY}
              xKey="category"
              bars={[
                { key: "escalations", label: "Escalations", color: "#ef4444" },
              ]}
              legend={false}
            />
          </ChartCard>
        </div>

        {/* Aging Analysis */}
        <ChartCard
          title="Aging Analysis"
          subtitle="How many complaints resolved in how many days"
        >
          <BarChartCard
            data={AGING_ANALYSIS}
            xKey="range"
            bars={[{ key: "count", label: "Complaints", color: "#0ea5e9" }]}
            legend={false}
          />
        </ChartCard>

        {/* Officer Ranking */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Officer Ranking
              Report
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Rank</th>
                  <th className="px-4 py-2 font-medium">Officer</th>
                  <th className="px-4 py-2 font-medium">Designation</th>
                  <th className="px-4 py-2 font-medium">District</th>
                  <th className="px-4 py-2 font-medium text-right">Resolved</th>
                  <th className="px-4 py-2 font-medium text-right">SLA %</th>
                  <th className="px-4 py-2 font-medium">Avg Resolution</th>
                  <th className="px-4 py-2 font-medium">Rating</th>
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
              <MapPin className="w-5 h-5 text-blue-500" /> ULB Intelligence
              Report
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">ULB</th>
                  <th className="px-4 py-2 font-medium text-right">
                    Population
                  </th>
                  <th className="px-4 py-2 font-medium text-center">Rank</th>
                  <th className="px-4 py-2 font-medium text-right">
                    Complaints
                  </th>
                  <th className="px-4 py-2 font-medium text-right">
                    Per Capita
                  </th>
                  <th className="px-4 py-2 font-medium text-right">SLA %</th>
                  <th className="px-4 py-2 font-medium">Rating</th>
                  <th className="px-4 py-2 font-medium">Trend</th>
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
