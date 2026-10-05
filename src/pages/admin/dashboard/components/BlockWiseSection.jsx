import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";
import { getEntityLabel } from "@/utils/helpers";

const DUMMY_BLOCKS_DATA = [
  { block: "Patna Sadar", count: 1420 },
  { block: "Danapur", count: 1180 },
  { block: "Phulwari Sharif", count: 960 },
  { block: "Musahri", count: 890 },
  { block: "Barauni", count: 820 },
  { block: "Gaya Sadar", count: 790 },
  { block: "Bodhgaya", count: 740 },
  { block: "Bihar Sharif", count: 710 },
  { block: "Hajipur", count: 680 },
  { block: "Bihta", count: 640 },
  { block: "Kanti", count: 590 },
  { block: "Jagdishpur", count: 550 },
];

export default function BlockWiseSection({ blockData }) {
  const { t } = useLanguage();
  const chartData = (blockData || []).map((block)=> {
    return {
      block: getEntityLabel(block, t),
      count:block?.count
    }
  })

  return (
    <ChartCard
      title={t("Block-wise Complaints Overview", "प्रखंड-वार शिकायत अवलोकन")}
      subtitle={t(
        "Grievance volume across key administrative blocks of Bihar",
        "बिहार के प्रमुख प्रशासनिक प्रखंडों में शिकायतों की संख्या",
      )}
    >
      <BarChartCard
        data={chartData}
        xKey="block"
        bars={[
          {
            key: "count",
            label: t("Number of Complaints", "शिकायतों की संख्या"),
            color: "#1d4ed8",
          },
        ]}
        height={320}
        legend={false}
        minBarWidth={48}
        margin={{ top: 10, right: 15, left: -10, bottom: 25 }}
        xAxisProps={{
          angle: -25,
          textAnchor: "end",
          height: 50,
          tick: { fontSize: 11, fill: "#64748b" },
        }}
      />
    </ChartCard>
  );
}