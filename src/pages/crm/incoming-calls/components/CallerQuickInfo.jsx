import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function CallerQuickInfo({ caller }) {
  const { t } = useLanguage();
  const previousCallsCount = caller?.previousCalls?.length || 0;
  const lastCallTime = caller?.previousCalls?.[0]?.time || "N/A";

  const infoItems = [
    { label: t("District", "जिला"), value: caller?.district },
    { label: t("Ward", "वार्ड"), value: caller?.ward },
    {
      label: t("Previous Calls", "पिछली कॉल"),
      value: `${previousCallsCount} ${t("times", "बार")}`,
      valueClass: "text-amber-600 font-medium",
    },
    {
      label: t("Last Call", "आखरी कॉल"),
      value: lastCallTime,
      valueClass: "font-medium",
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-4 mt-4 space-y-2 text-sm">
      {infoItems.map((item, idx) => (
        <div key={idx} className="flex justify-between">
          <span className="text-muted-foreground">{item.label}:</span>
          <span className={item.valueClass || "font-medium"}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
