import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function SlaComplianceChart({ data, xKey }) {
  const { t } = useLanguage();
  return (
    <ChartCard
      title={t("SLA Compliance by Service", "सेवा द्वारा SLA अनुपालन")}
      subtitle={t("Within vs beyond SLA per service category", "प्रत्येक सेवा श्रेणी में SLA के भीतर बनाम बाहर")}
    >
      <BarChartCard
        data={data}
        xKey={xKey}
        bars={[
          { key: "withinSLA", label: t("Within SLA", "SLA के भीतर"), color: "#22c55e" },
          { key: "beyondSLA", label: t("Beyond SLA", "SLA से बाहर"), color: "#ef4444" },
        ]}
        height={320}
      />
    </ChartCard>
  );
}
