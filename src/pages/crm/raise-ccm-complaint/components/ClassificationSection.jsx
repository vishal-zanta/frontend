import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import MySelect from "@/components/inputs/MySelect";
import { useGetSubservices } from "../../../admin/master-data/hooks";
import FormSection from "./FormSection";

export default function ClassificationSection({
  servicesOptions,
  grievanceNatureOptions,
  servicesLoading,
  naturesLoading,
  t,
  lang,
}) {
  const [selectedService, setSelectedService] = useState("");
  const { setValue } = useFormContext();

  const API_PARAMS = { page: 1, limit: 500, select: "title,titleHindi" };

  const { data: subServicesData, isLoading: subServicesLoading } = useGetSubservices(
    [selectedService],
    { serviceId: selectedService, ...API_PARAMS },
    !!selectedService
  );

  const subServiceOptions = (subServicesData?.data?.data?.docs ?? []).map((s) => ({
    label: lang === "hi" && s.titleHindi ? s.titleHindi : s.title,
    value: s._id,
  }));

  const handleServiceChange = (val) => {
    setSelectedService(val);
    setValue("classification.subService", "");
  };

  return (
    <FormSection title={t("Complaint Classification", "शिकायत वर्गीकरण")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MySelect
          value={selectedService}
          onValueChange={handleServiceChange}
          label={t("Service", "सेवा")}
          placeholder={
            servicesLoading
              ? t("Loading...", "लोड हो रहा है...")
              : t("Select service", "सेवा चुनें")
          }
          options={servicesOptions}
          required
        />

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
          disabled={!selectedService}
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
