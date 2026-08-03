import React from "react";
import SetShiftTiming from "./SetShiftTiming";
import AgentStatusBoard from "./AgentStatusBoard";
import { useLanguage } from "@/context/LanguageContext";
import { SectionTitle } from "@/components/ChartCard";

export default function SupervisorViewShift() {
  const { t } = useLanguage();

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <SectionTitle
          title={t("Shift Management", "शिफ्ट प्रबंधन")}
          subtitle={t(
            "Set agent shift timings, view live status, and manage call centre operations.",
            "एजेंट शिफ्ट समय निर्धारित करें, लाइव स्थिति देखें और कॉल सेंटर संचालन का प्रबंधन करें।",
          )}
        />
      
      </div>

      <SetShiftTiming />

      <AgentStatusBoard isSupervisor={true} />
    </div>
  );
}
