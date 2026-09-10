import React, { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import RhfBoolean from "@/components/rhfinputs/RhfBoolean";
import RhfTextarea from "@/components/rhfinputs/RhfTextarea";
import MySelect from "@/components/inputs/MySelect";
import {
  useGetServices,
  useGetSubservices,
} from "../../../admin/master-data/hooks";
import FormSection from "./FormSection";
import { MAX_LIMIT } from "@/utils/constants";

export default function ClassificationSection({
  departmentOptions,
  grievanceNatureOptions,
  departmentsLoading,
  naturesLoading,
  t,
  lang,
}) {
  const { setValue, watch, control } = useFormContext();
  const selectedDepartment = useWatch({
    control,
    name: "classification.department",
  });
  const selectedService = useWatch({ control, name: "classification.service" });
  const isSeasonal = useWatch({ control, name: "classification.isSeasonal" });
  const departmentRef = useRef(selectedDepartment);

  const SERVICES_PARAMS = {
    page: 1,
    limit: MAX_LIMIT,
    select: "title,titleHindi,name,nameHindi",
    departmentId: selectedDepartment,
  };

  const { data: servicesData, isLoading: servicesLoading } = useGetServices(
    [selectedDepartment],
    SERVICES_PARAMS,
    !!selectedDepartment,
    {
      gcTime: 5 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
    },
  );

  const serviceOptions = (servicesData?.data?.data?.docs ?? []).map((s) => ({
    label:
      lang === "hi" && (s.titleHindi || s.nameHindi)
        ? s.titleHindi || s.nameHindi
        : s.title || s.name,
    value: s._id,
  }));

  // const SUBSERVICES_PARAMS = {
  //   page: 1,
  //   limit: MAX_LIMIT,
  //   select: "title,titleHindi,name,nameHindi",
  //   serviceId: selectedService,
  // };

  // const { data: subServicesData, isLoading: subServicesLoading } =
  //   useGetSubservices(
  //     [selectedService],
  //     SUBSERVICES_PARAMS,
  //     !!selectedService,
  //   );

  // const subServiceOptions = (subServicesData?.data?.data?.docs ?? []).map(
  //   (s) => ({
  //     label:
  //       lang === "hi" && (s.titleHindi || s.nameHindi)
  //         ? s.titleHindi || s.nameHindi
  //         : s.title || s.name,
  //     value: s._id,
  //   }),
  // );

  const seasonalTypeOptions = [
    { label: t("Floods", "बाढ़"), value: "floods" },
    { label: t("Summer", "गर्मी"), value: "summer" },
    { label: t("Rain", "बारिश"), value: "rain" },
  ];

  useEffect(() => {
    if (departmentRef.current && selectedDepartment !== departmentRef.current)
      setValue("classification.service", "");

    departmentRef.current = selectedDepartment;
  }, [selectedDepartment]);

  return (
    <FormSection
      title={t(
        "What does the complaint related to?",
        "शिकायत किससे संबंधित है?",
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RhfSelect
          name={"classification.department"}
          // value={selectedDepartment || ""}
          // onValueChange={(val) => {
          //   setValue("classification.department", val);
          //   setValue("classification.service", "");
          //   // setValue("classification.subService", "");
          // }}
          label={t("Department", "विभाग")}
          placeholder={
            departmentsLoading
              ? t("Loading...", "लोड हो रहा है...")
              : t("Select department", "विभाग चुनें")
          }
          options={departmentOptions}
          disabled={departmentsLoading}
          required
        />

        <RhfSelect
          name={"classification.service"}
          // value={selectedService || ""}
          // onValueChange={(val) => {
          //   setValue("classification.service", val);
          //   // setValue("classification.subService", "");
          // }}
          label={t("Service / Category", "सेवा")}
          placeholder={
            !selectedDepartment
              ? t("Select department first", "पहले विभाग चुनें")
              : servicesLoading
                ? t("Loading...", "लोड हो रहा है...")
                : t("Select service", "सेवा चुनें")
          }
          options={serviceOptions}
          disabled={!selectedDepartment || servicesLoading}
          required
        />

        {/* <RhfSelect
          name="classification.subService"
          label={t("Sub-Service", "उप-सेवा")}
          placeholder={
            !selectedService
              ? t("Select service first", "पहले सेवा चुनें")
              : subServicesLoading
                ? t("Loading...", "लोड हो रहा है...")
                : t("Select sub-service", "उप-सेवा चुनें")
          }
          options={subServiceOptions}
          required
          disabled={!selectedService || subServicesLoading}
        /> */}

        <RhfSelect
          name="classification.nature"
          label={t("Type / Nature", "शिकायत प्रकार")}
          placeholder={
            naturesLoading
              ? t("Loading...", "लोड हो रहा है...")
              : t("Select type", "प्रकार चुनें")
          }
          options={grievanceNatureOptions}
          required
        />

        <RhfTextarea
          name="evidence.details"
          label={t("Brief Description", "संक्षिप्त विवरण")}
          placeholder={t(
            "Describe the issue in detail...",
            "समस्या का विस्तार से वर्णन करें...",
          )}
          rows={4}
          maxLength={1000}
          required
          className="md:col-span-2"
        />

        <div className="md:col-span-2">
          <RhfBoolean
            name="classification.isSeasonal"
            label={t("Seasonal Complaint", "मौसमी शिकायत")}
          />
        </div>

        {isSeasonal && (
          <RhfSelect
            name="classification.seasonalType"
            label={t("Seasonal Type", "मौसमी प्रकार")}
            placeholder={t(
              "Select or type seasonal type",
              "मौसमी प्रकार चुनें या लिखें",
            )}
            options={seasonalTypeOptions}
            isCreatable
            className="md:col-span-2"
          />
        )}
      </div>
    </FormSection>
  );
}
