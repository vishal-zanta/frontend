import React, { useMemo } from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function LocationWiseComplaintsChart({ data }) {
  const { t } = useLanguage();

  const formatLocationLabel = (loc) => {
    if (!loc) return "";
    const lower = String(loc).toLowerCase();
    if (lower.includes("outer") || lower.includes("outside")) {
      return t("Outside Bihar (Inter-State)", "बिहार के बाहर (अंतर्राज्यीय)");
    }
    if (
      lower.includes("bihar") ||
      lower.includes("intra") ||
      lower.includes("within")
    ) {
      return t("Within Bihar (Intra-State)", "बिहार राज्य के भीतर");
    }
    return loc;
  };

  const dummyBarData = [
    {
      location: t("Within Bihar (Intra-State)", "बिहार राज्य के भीतर"),
      complaints: 4820,
    },
    {
      location: t("Outside Bihar (Inter-State)", "बिहार के बाहर (अंतर्राज्यीय)"),
      complaints: 540,
    },
  ];

  const chartData = useMemo(() => {
    if (data && data.length > 0) {
      return data.map((item) => ({
        ...item,
        location: formatLocationLabel(item.location || item.name || item.title),
      }));
    }
    return dummyBarData;
  }, [data, t]);

  return (
    <ChartCard
      title={t(
        "Geographical Distribution of Grievances",
        "शिकायतों का भौगोलिक वितरण",
      )}
      subtitle={t(
        "Grievances originating within Bihar vs outside the state (Inter-State)",
        "बिहार राज्य के भीतर एवं राज्य के बाहर से प्राप्त शिकायतों का विवरण",
      )}
    >
      <BarChartCard
        data={chartData}
        xKey="location"
        bars={[
          {
            key: "complaints",
            label: t("No. of Grievances", "शिकायतों की संख्या"),
            color: "#6366f1",
          },
        ]}
        height={280}
        legend={false}
      />
    </ChartCard>
  );
}

