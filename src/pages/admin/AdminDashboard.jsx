import React from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Users,
  MessageSquare,
  Newspaper,
  Activity,
  ArrowRight,
  MapPin,
  Star,
  Phone,
  Bot,
} from "lucide-react";
import {
  DASHBOARD_KPIS,
  DAILY_VOLUME,
  DISTRICT_WISE,
  CATEGORY_DISTRIBUTION,
  MODE_WISE,
  SOCIAL_COMPLAINTS,
  COMPLAINTS,
} from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import StatCard from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { AreaChartCard, BarChartCard, PieChartCard } from "@/components/Charts";
import ComplaintMap from "@/components/ComplaintMap";
import { ComplaintId } from "@/components/ComplaintDetailDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ExportButton from "@/components/ExportButton";

const districtExportColumns = [
  { key: "district", label: "District" },
  { key: "total", label: "Total" },
  { key: "resolved", label: "Resolved" },
  { key: "pending", label: "Pending" },
  { key: "inProgress", label: "In Progress" },
  { key: "escalated", label: "Escalated" },
];

export default function AdminDashboard() {
  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                State Dashboard - Bihar
              </h1>
              <p className="text-white/80 text-sm">
                Real-time grievance overview • 12 districts • 6 ULBs • 6 months
                of data
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center bg-white/10 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">
                  {DASHBOARD_KPIS.todayNew}
                </div>
                <div className="text-[11px] text-white/70">New Today</div>
              </div>
              <div className="text-center bg-white/10 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">
                  {DASHBOARD_KPIS.todayResolved}
                </div>
                <div className="text-[11px] text-white/70">Resolved Today</div>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            icon={Inbox}
            label="Total Complaints"
            value={DASHBOARD_KPIS.totalComplaints.toLocaleString("en-IN")}
            color="blue"
            trend="up"
            trendValue="+3.2% vs last period"
          />
          <StatCard
            icon={Activity}
            label="Active"
            value={DASHBOARD_KPIS.active.toLocaleString("en-IN")}
            color="amber"
          />
          <StatCard
            icon={CheckCircle2}
            label="Resolved"
            value={DASHBOARD_KPIS.resolved.toLocaleString("en-IN")}
            color="green"
            trend="up"
            trendValue="+5.1% vs last period"
          />
          <StatCard
            icon={AlertTriangle}
            label="Escalated"
            value={DASHBOARD_KPIS.escalated}
            color="red"
            trend="down"
            trendValue="-1.4% vs last period"
          />
          <StatCard
            icon={Clock}
            label="SLA Compliance"
            value={`${DASHBOARD_KPIS.slaCompliance}%`}
            color="purple"
            trend="up"
            trendValue="+0.8% vs last period"
            sublabel="Target: 95%"
          />
          <StatCard
            icon={Star}
            label="Satisfaction"
            value={`${DASHBOARD_KPIS.citizenSatisfaction}/5`}
            color="sky"
            trend="up"
            trendValue="+0.2 vs last period"
            sublabel="Target: 4.5"
          />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard
            title="Complaint Volume (30 Days)"
            subtitle="Daily raised vs resolved trends"
            className="lg:col-span-2"
          >
            <AreaChartCard
              data={DAILY_VOLUME}
              xKey="label"
              areas={[
                { key: "raised", label: "Raised", color: "#1d4ed8" },
                { key: "resolved", label: "Resolved", color: "#22c55e" },
              ]}
              height={300}
            />
          </ChartCard>
          <ChartCard
            title="Category Distribution"
            subtitle="Complaints by service type"
          >
            <PieChartCard data={CATEGORY_DISTRIBUTION} height={300} />
          </ChartCard>
        </div>

        {/* Map + District table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard
            title="Complaint Hotspot Map"
            subtitle="Geo-tagged complaint density by ward"
            className="lg:col-span-1"
          >
            <ComplaintMap
              height={320}
              showHotspots={true}
              center={[25.61, 85.13]}
              zoom={7}
            />
          </ChartCard>
          <ChartCard
            title="District-wise Complaints"
            subtitle="Status breakdown by district"
            className="lg:col-span-2"
            actions={
              <ExportButton
                data={DISTRICT_WISE}
                columns={districtExportColumns}
                filename="district_wise_complaints"
              />
            }
          >
            <div className="overflow-x-auto max-h-[320px] overflow-y-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium">District</th>
                    <th className="px-3 py-2 font-medium text-right">Total</th>
                    <th className="px-3 py-2 font-medium text-right">
                      Resolved
                    </th>
                    <th className="px-3 py-2 font-medium text-right">
                      Pending
                    </th>
                    <th className="px-3 py-2 font-medium text-right">
                      In Progress
                    </th>
                    <th className="px-3 py-2 font-medium text-right">
                      Escalated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {DISTRICT_WISE.map((d, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="px-3 py-2 font-medium">{d.district}</td>
                      <td className="px-3 py-2 text-right font-semibold">
                        {d.total.toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-2 text-right text-emerald-600">
                        {d.resolved.toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-2 text-right text-amber-600">
                        {d.pending}
                      </td>
                      <td className="px-3 py-2 text-right text-blue-600">
                        {d.inProgress}
                      </td>
                      <td className="px-3 py-2 text-right text-red-600">
                        {d.escalated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>

        {/* Mode-wise + Social media */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Mode-wise Complaints"
            subtitle="Distribution by source channel"
          >
            <BarChartCard
              data={MODE_WISE}
              xKey="name"
              bars={[{ key: "value", label: "Complaints", color: "#0ea5e9" }]}
              height={280}
              legend={false}
            />
          </ChartCard>
          <ChartCard
            title="Social Media Complaints"
            subtitle="Latest from Twitter, WhatsApp, Instagram & Newspaper"
            actions={
              <Button variant="ghost" size="sm">
                View All
              </Button>
            }
          >
            <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin">
              {SOCIAL_COMPLAINTS.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    {s.platform.includes("Twitter") ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : s.platform.includes("News") ? (
                      <Newspaper className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{s.handle}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {s.platform}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {s.text}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] shrink-0 ${s.status === "Converted" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                  >
                    {s.status}
                  </Badge>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Recent complaints with clickable IDs */}
        <div className="bg-white rounded-xl border border-border">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-foreground">Recent Complaints</h3>
            <Link
              to="/admin/audit"
              className="text-sm text-primary hover:underline"
            >
              View Audit Trail
            </Link>
          </div>
          <div className="overflow-x-auto max-h-[300px] overflow-y-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Complaint ID</th>
                  <th className="px-4 py-2 font-medium">Citizen</th>
                  <th className="px-4 py-2 font-medium">Service</th>
                  <th className="px-4 py-2 font-medium">District</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COMPLAINTS.slice(0, 15).map((c, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-2.5">
                      <ComplaintId id={c.id} />
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {c.citizenName}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {c.serviceName}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {c.districtName}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${c.status === "Resolved" ? "bg-emerald-50 text-emerald-700" : c.status === "Escalated" ? "bg-red-50 text-red-700" : c.status === "Closed" ? "bg-slate-50 text-slate-600" : "bg-blue-50 text-blue-700"}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {c.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Operational Dashboards",
              path: "/admin/operational",
              icon: Activity,
              color: "bg-blue-50 text-primary",
            },
            {
              label: "AI Analytical Reports",
              path: "/admin/ai-reports",
              icon: TrendingUp,
              color: "bg-purple-50 text-purple-600",
            },
            {
              label: "MIS Reports",
              path: "/admin/mis",
              icon: Newspaper,
              color: "bg-emerald-50 text-emerald-600",
            },
            {
              label: "User Management",
              path: "/admin/users",
              icon: Users,
              color: "bg-amber-50 text-amber-600",
            },
          ].map((q, i) => {
            const Icon = q.icon;
            return (
              <Link
                key={i}
                to={q.path}
                className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div
                  className={`w-9 h-9 rounded-lg ${q.color} flex items-center justify-center`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-foreground flex-1">
                  {q.label}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
}
