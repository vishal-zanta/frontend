import React from "react";
import { Label } from "@/components/ui/label";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import RhfBoolean from "@/components/rhfinputs/RhfBoolean";
import FormSection from "./FormSection";

export default function ImpactSection({ affectedBeneficiaryOptions, t }) {
  return (
    <FormSection title={t("Impact Assessment", "प्रभाव मूल्यांकन")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RhfSelect
          name="impact.affectedBeneficiary"
          label={t("Affected Beneficiary", "प्रभावित लाभार्थी")}
          placeholder={t("Select beneficiary type", "लाभार्थी प्रकार चुनें")}
          options={affectedBeneficiaryOptions}
          required
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-foreground mb-3 block">
          {t("Vulnerability Category", "संवेदनशीलता श्रेणी")}
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/30 rounded-lg p-4 border border-border">
          <RhfBoolean
            name="impact.vulnerability.seniorCitizen"
            label={t("Senior Citizen", "वरिष्ठ नागरिक")}
          />
          <RhfBoolean
            name="impact.vulnerability.woman"
            label={t("Woman", "महिला")}
          />
          <RhfBoolean
            name="impact.vulnerability.personWithDisability"
            label={t("Person with Disability", "दिव्यांग")}
          />
          <RhfBoolean
            name="impact.vulnerability.economicallyWeakerSection"
            label={t("Economically Weaker Section", "आर्थिक रूप से कमजोर वर्ग")}
          />
        </div>
      </div>
    </FormSection>
  );
}
