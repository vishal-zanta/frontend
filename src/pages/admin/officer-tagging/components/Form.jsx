import React, { useEffect, useRef } from "react";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { Button } from "@/components/ui/button";
import { useFormContext, useWatch } from "react-hook-form";
import { useLanguage } from "@/context/LanguageContext";
import {
  useGetServices,
  useGetDemographics,
} from "../../master-data/hooks";
import subDivisionsData from "@/utils/sub-divisions.json";
import { MAX_LIMIT } from "@/utils/constants";

export default function Form({
  isEdit,
  isLoading,
  userOptions = [],
  onCancel,
}) {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const { t } = useLanguage();
  const selectedDistrict = useWatch({ name: "district" });
  const selectedOfficer = useWatch({ name: "officer" });
  const officerDept = (
    userOptions.find((u) => u.value === selectedOfficer)?.apiData || {}
  )?.role?.department;

  // Fetch Services for officer's department
  const {
    data: servicesData,
    isLoading: serviceLoading,
    isFetching: serviceFetching,
  } = useGetServices(
    [officerDept?._id],
    {
      page: 1,
      limit: MAX_LIMIT,
      department: officerDept?._id,
    },
    !!officerDept?._id,
  );
  const servicesOptions = (servicesData?.data?.data?.docs || []).map((s) => ({
    label: s.title || s.name || "",
    value: s._id,
  }));

  // Fetch Districts (Demographics)
  const { data: demographyData } = useGetDemographics([], {
    page: 1,
    limit: MAX_LIMIT,
  });
  const districtOptions = (demographyData?.data?.data?.docs || []).map((d) => ({
    label: d.name,
    value: d._id,
    name: d.name,
  }));

  // Map Subdivision options based on selectedDistrict
  const selectedDistrictObj = districtOptions.find(
    (d) => d.value === selectedDistrict,
  );
  const districtLabel = selectedDistrictObj?.name;
  const rawSubdivisions = districtLabel
    ? subDivisionsData[districtLabel] || []
    : [];
  const subdivisionOptions = rawSubdivisions.map((sub) => ({
    label: sub,
    value: sub,
  }));

  // Reset subdivision select when district changes
  const isFirstRenderDistrict = useRef(true);
  useEffect(() => {
    if (isFirstRenderDistrict.current) {
      isFirstRenderDistrict.current = false;
      return;
    }
    setValue("wards", [], { shouldValidate: true });
  }, [selectedDistrict]);

  return (
    <div className="space-y-4">
      <RhfSelect
        name="officer"
        label={t("Select Officer", "अधिकारी चुनें")}
        required
        options={userOptions}
        placeholder={t("Select an officer", "अधिकारी चुनें")}
        disabled={isEdit}
      />
      <RhfSelect
        name="services"
        label={t("Services", "सेवाएं")}
        required
        isMultiple={true}
        options={servicesOptions}
        placeholder={
          !selectedOfficer
            ? t("Select officer first", "पहले अधिकारी चुनें")
            : t("Select services", "सेवाएं चुनें")
        }
        isLoading={serviceLoading || serviceFetching}
        disabled={!selectedOfficer}
      />
      <RhfSelect
        name="district"
        label={t("District", "जिला")}
        required
        options={districtOptions}
        placeholder={t("Select district", "जिला चुनें")}
      />
      <RhfSelect
        name="wards"
        label={t("Subdivisions", "अनुमंडल")}
        required
        isMultiple={true}
        options={subdivisionOptions}
        placeholder={
          !selectedDistrict
            ? t("Select district first", "पहले जिला चुनें")
            : t("Select subdivisions", "अनुमंडल चुनें")
        }
        disabled={!selectedDistrict}
      />
      <div className="py-4 sticky bottom-0 bg-card flex justify-between">
        <div className="flex items-center">
          {Object.keys(errors).length > 0 && (
            <span className="text-destructive text-xs font-semibold animate-pulse">
              {t(
                "* Please fix form errors first",
                "* कृपया पहले फॉर्म की त्रुटियों को सुधारें",
              )}
            </span>
          )}
        </div>

        <div className="flex justify-end gap-2 ">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t("Cancel", "रद्द करें")}
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading
              ? t("Saving...", "सहेजा जा रहा है...")
              : t("Save", "सहेजें")}
          </Button>
        </div>
      </div>
    </div>
  );
}
