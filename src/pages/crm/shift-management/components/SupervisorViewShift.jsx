import React from "react";
import SetShiftTiming from "./SetShiftTiming";
import AgentStatusBoard from "./AgentStatusBoard";
import { useLanguage } from "@/context/LanguageContext";

export default function SupervisorViewShift() {
  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("Shift Management", "शिफ्ट प्रबंधन")}</h1>
        <p className="text-sm text-muted-foreground">
          {t(
            "Set agent shift timings, view live status, and manage call centre operations.",
            "एजेंट शिफ्ट समय निर्धारित करें, लाइव स्थिति देखें और कॉल सेंटर संचालन का प्रबंधन करें।"
          )}
        </p>
      </div>

      <SetShiftTiming />

      <AgentStatusBoard isSupervisor={true} />
    </div>
  );
}
