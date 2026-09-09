import React from "react";
import { ChartCard } from "@/components/ChartCard";
import { BarChartCard } from "@/components/Charts";
import { useLanguage } from "@/context/LanguageContext";

export default function GrievanceNatureChart({ data }) {
  const { t } = useLanguage();

  const dummyData = [
    {
      nature: t("Suggestion", "सुझाव"),
      complaints: 420,
    },
    {
      nature: t("Enquiry", "पूछताछ"),
      complaints: 850,
    },
    {
      nature: t("Request", "अनुरोध"),
      complaints: 1240,
    },
    {
      nature: t("Complaint", "शिकायत"),
      complaints: 2180,
    },
  ];

  const chartData = data && data.length > 0 ? data : dummyData;

  return (
    <ChartCard
      title={t("Grievance Nature", "शिकायत की प्रकृति")}
      subtitle={t(
        "Complaints distribution by grievance nature",
        "शिकायत की प्रकृति के अनुसार शिकायतों का वितरण",
      )}
    >
      <BarChartCard
        data={chartData}
        xKey="nature"
        bars={[
          {
            key: "complaints",
            label: t("No. of Complaints", "शिकायतों की संख्या"),
            color: "#3b82f6",
          },
        ]}
        height={280}
        legend={false}
      />
    </ChartCard>
  );
}
