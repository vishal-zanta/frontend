import React, { useState } from "react";
import MyShiftDetails from "./MyShiftDetails";
import AgentStatusBoard from "./AgentStatusBoard";
import { useLanguage } from "@/context/LanguageContext";
import { SectionTitle } from "@/components/ChartCard";

export default function AgentViewShift() {
  const { t } = useLanguage();
  const [agentViewShift, setAgentView] = useState(null);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <SectionTitle
          title= {t("My Shift", "मेरी शिफ्ट")}
          subtitle= {t(
            "View your assigned shift schedule. Shift management is available to supervisors only.",
            "अपनी आवंटित शिफ्ट अनुसूची देखें। शिफ्ट प्रबंधन केवल पर्यवेक्षकों के लिए उपलब्ध है।",
          )}
        />
       
      </div>

      <MyShiftDetails agentViewShift={agentViewShift} />

      <AgentStatusBoard isSupervisor={false} setAgentView={setAgentView} />
    </div>
  );
}
