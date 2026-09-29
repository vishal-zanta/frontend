import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function SlaComplianceChart({ data, xKey, title, subtitle }) {
  const { t } = useLanguage();
  return (
    <ChartCard
      title={title || t("SLA Compliance by Service", "सेवा द्वारा एसएलए अनुपालन")}
      subtitle={
        subtitle ||
        t(
          "Within vs beyond SLA per service category",
          "प्रत्येक सेवा श्रेणी में एसएलए के भीतर बनाम बाहर",
        )
      }
    >
      <BarChartCard
        data={data}
        xKey={xKey}
        bars={[
          { key: "withinSLA", label: t("Within SLA", "एसएलए के भीतर"), color: "#22c55e" },
          { key: "beyondSLA", label: t("Beyond SLA", "एसएलए से बाहर"), color: "#ef4444" },
        ]}
        height={340}
        maxBarSize={24}
        barSize={18}
        minBarWidth={64}
        margin={{ top: 10, right: 15, left: -10, bottom: 25 }}
        xAxisProps={{
          angle: -30,
          textAnchor: "end",
          height: 60,
          dx: -4,
          dy: 4,
          tick: { fontSize: 11, angle: -30, textAnchor: "end", fill: "#64748b" },
        }}
      />
    </ChartCard>
  );
}
