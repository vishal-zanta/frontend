import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { PieChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function AgentStatusChart({ data }) {
  const { t } = useLanguage();
  return (
    <ChartCard
      title={t("Helpdesk Agent Status", "हेल्पडेस्क एजेंट स्थिति")}
      subtitle={t("Live agent availability", "लाइव एजेंट उपलब्धता")}
    >
      <PieChartCard data={data} />
    </ChartCard>
  );
}
