import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

const DUMMY_BLOCKS_DATA = [
  { block: "Patna Sadar", complaints: 1420 },
  { block: "Danapur", complaints: 1180 },
  { block: "Phulwari Sharif", complaints: 960 },
  { block: "Musahri", complaints: 890 },
  { block: "Barauni", complaints: 820 },
  { block: "Gaya Sadar", complaints: 790 },
  { block: "Bodhgaya", complaints: 740 },
  { block: "Bihar Sharif", complaints: 710 },
  { block: "Hajipur", complaints: 680 },
  { block: "Bihta", complaints: 640 },
  { block: "Kanti", complaints: 590 },
  { block: "Jagdishpur", complaints: 550 },
];

export default function BlockWiseSection({ blockData }) {
  const { t } = useLanguage();
  const chartData = blockData && blockData.length > 0 ? blockData : DUMMY_BLOCKS_DATA;

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
            key: "complaints",
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