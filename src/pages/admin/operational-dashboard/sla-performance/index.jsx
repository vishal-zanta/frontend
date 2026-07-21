import React from "react";
import { Clock, Activity, TrendingUp, BarChart3 } from "lucide-react";
import StatCard from "@/components/StatCard";
import SlaComplianceChart from "./components/SlaComplianceChart";
import ExportButton from "@/components/ExportButton";
import { SLA_PERFORMANCE } from "@/lib/biharData";

const slaExportColumns = [
  { key: "service", label: "Service" },
  { key: "withinSLA", label: "Within SLA" },
  { key: "beyondSLA", label: "Beyond SLA" },
  { key: "compliance", label: "Compliance %" },
];

export default function SlaPerformanceTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Within SLA"
          value="38,290"
          color="green"
        />
        <StatCard
          icon={Activity}
          label="Beyond SLA"
          value="1,953"
          color="red"
        />
        <StatCard
          icon={TrendingUp}
          label="Compliance Rate"
          value="95.1%"
          color="blue"
          sublabel="Target: 95%"
        />
        <StatCard
          icon={BarChart3}
          label="Worst Service"
          value="Road (86.8%)"
          color="amber"
        />
      </div>
      <SlaComplianceChart data={SLA_PERFORMANCE} xKey="service" />
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground">SLA Performance Detail</h3>
          <ExportButton
            data={SLA_PERFORMANCE}
            columns={slaExportColumns}
            filename="sla_performance"
          />
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[#F4F7FA]">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-4 py-2 font-medium">Service</th>
              <th className="px-4 py-2 font-medium text-right">Within SLA</th>
              <th className="px-4 py-2 font-medium text-right">Beyond SLA</th>
              <th className="px-4 py-2 font-medium text-right">Compliance %</th>
              <th className="px-4 py-2 font-medium text-right">Benchmark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {SLA_PERFORMANCE.map((s, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="px-4 py-2.5 font-medium">{s.service}</td>
                <td className="px-4 py-2.5 text-right text-emerald-600">
                  {s.withinSLA.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-2.5 text-right text-red-600">
                  {s.beyondSLA}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span
                    className={`font-bold ${s.compliance >= 95 ? "text-emerald-600" : s.compliance >= 90 ? "text-amber-600" : "text-red-600"}`}
                  >
                    {s.compliance}%
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right text-xs text-muted-foreground">
                  Target: 95% |{" "}
                  {s.compliance >= 95
                    ? "✓ Met"
                    : `${(95 - s.compliance).toFixed(1)}% below`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
