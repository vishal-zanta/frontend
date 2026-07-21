import React, { useState } from "react";
import MyShiftDetails from "./MyShiftDetails";
import AgentStatusBoard from "./AgentStatusBoard";
import { useLanguage } from "@/context/LanguageContext";

export default function AgentViewShift() {
  const { t } = useLanguage();
  const [agentViewShift, setAgentView] = useState(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("My Shift", "मेरी शिफ्ट")}</h1>
        <p className="text-sm text-muted-foreground">
          {t(
            "View your assigned shift schedule. Shift management is available to supervisors only.",
            "अपनी आवंटित शिफ्ट अनुसूची देखें। शिफ्ट प्रबंधन केवल पर्यवेक्षकों के लिए उपलब्ध है।"
          )}
        </p>
      </div>

      <MyShiftDetails agentViewShift={agentViewShift} />

      <AgentStatusBoard isSupervisor={false} setAgentView={setAgentView} />
    </div>
  );
}
