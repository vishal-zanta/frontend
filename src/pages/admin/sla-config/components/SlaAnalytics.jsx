import React from "react";
import StatCard from "@/components/StatCard";
import { useLanguage } from "@/context/LanguageContext";

export default function SlaAnalytics({ docs = [], rolesCount = 0 }) {
  const { t } = useLanguage();
  const configured = docs.length;
  const withOfficer = docs.filter((s) => s.officer).length;
  const missingOfficer = docs.filter((s) => !s.officer).length;
  const rolesCountValue = rolesCount;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        color="blue"
        value={configured}
        label={t("Sub-services Configured", "उप-सेवाएं कॉन्फ़िगर की गईं")}
      />
      <StatCard
        color="emerald"
        value={withOfficer}
        label={t("With Officer Assigned", "अधिकारी आवंटित")}
      />
      <StatCard
        color="amber"
        value={missingOfficer}
        label={t("Missing Officer", "बिना अधिकारी")}
      />
      <StatCard
        color="purple"
        value={rolesCountValue}
        label={t("Escalation Levels", "वृद्धि के स्तर")}
      />
    </div>
  );
}
