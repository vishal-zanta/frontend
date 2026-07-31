import React from "react";
import { Clock, Activity, TrendingUp, BarChart3 } from "lucide-react";
import StatCard from "@/components/StatCard";
import SlaComplianceChart from "./components/SlaComplianceChart";
import ExportButton from "@/components/ExportButton";
import { SLA_PERFORMANCE } from "@/lib/biharData";
import { useLanguage } from "@/context/LanguageContext";

const slaExportColumns = [
  { key: "service", label: "Service" },
  { key: "withinSLA", label: "Within SLA" },
  { key: "beyondSLA", label: "Beyond SLA" },
  { key: "compliance", label: "Compliance %" },
];

export default function SlaPerformanceTab() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label={t("Within SLA", "SLA के भीतर")}
          value="38,290"
          color="green"
        />
        <StatCard
          icon={Activity}
          label={t("Beyond SLA", "SLA से बाहर")}
          value="1,953"
          color="red"
        />
       
        <StatCard
          icon={TrendingUp}
          label={t("Compliance Rate", "अनुपालन दर")}
          value="95.1%"
          color="blue"
          sublabel={t("Target: 95%", "लक्ष्य: 95%")}
        />
        <StatCard
          icon={BarChart3}
          label={t("Worst Service", "न्यूनतम सेवा")}
          value={t("Road (86.8%)", "सड़क (86.8%)")}
          color="amber"
        />
      </div>
      <SlaComplianceChart data={SLA_PERFORMANCE} xKey="service" />
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground">{t("SLA Performance Detail", "SLA प्रदर्शन विवरण")}</h3>
          <ExportButton
            data={SLA_PERFORMANCE}
            columns={slaExportColumns}
            filename="sla_performance"
          />
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-4 py-2 font-medium">{t("Service", "सेवा")}</th>
              <th className="px-4 py-2 font-medium text-right">{t("Within SLA", "SLA के भीतर")}</th>
              <th className="px-4 py-2 font-medium text-right">{t("Beyond SLA", "SLA से बाहर")}</th>
              <th className="px-4 py-2 font-medium text-right">{t("Compliance %", "अनुपालन %")}</th>
              <th className="px-4 py-2 font-medium text-right">{t("Benchmark", "मानक")}</th>
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
