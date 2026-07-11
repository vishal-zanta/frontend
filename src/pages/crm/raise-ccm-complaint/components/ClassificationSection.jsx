import React from "react";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import FormSection from "./FormSection";

export default function ClassificationSection({
  subServiceOptions,
  grievanceNatureOptions,
  subServicesLoading,
  naturesLoading,
  t,
}) {
  return (
    <FormSection title={t("Complaint Classification", "शिकायत वर्गीकरण")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RhfSelect
          name="classification.subService"
          label={t("Sub-Service", "उप-सेवा")}
          placeholder={
            subServicesLoading
              ? t("Loading...", "लोड हो रहा है...")
              : t("Select sub-service", "उप-सेवा चुनें")
          }
          options={subServiceOptions}
          required
        />

        <RhfSelect
          name="classification.nature"
          label={t("Grievance Type / Nature", "शिकायत प्रकार")}
          placeholder={
            naturesLoading
              ? t("Loading...", "लोड हो रहा है...")
              : t("Select type", "प्रकार चुनें")
          }
          options={grievanceNatureOptions}
          required
        />

        <RhfInput
          name="classification.subject"
          label={t("Subject", "विषय")}
          placeholder={t("Brief subject of your complaint", "शिकायत का संक्षिप्त विषय")}
          required
          className="md:col-span-2"
        />
      </div>
    </FormSection>
  );
}
