import React, { useEffect, useRef } from "react";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { Button } from "@/components/ui/button";
import { useFormContext, useWatch } from "react-hook-form";
import { useLanguage } from "@/context/LanguageContext";
import {
  useGetServices,
  useGetSubservices,
  useGetDemographics,
} from "../../master-data/hooks";
import subDivisionsData from "@/utils/sub-divisions.json";
import { MAX_LIMIT } from "@/utils/constants";
import { Loader2 } from "lucide-react";

export default function Form({
  isEdit,
  isLoading,
  userOptions = [],
  onCancel,
}) {
  const {
    resetField,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { t } = useLanguage();
  const selectedService = useWatch({ name: "service" });
  const selectedDistrict = useWatch({ name: "district" });
  const selectedOfficer = useWatch({ name: "officer" });
  const officerDept = (
    userOptions.find((u) => u.value === selectedOfficer)?.apiData || {}
  )?.role?.department;

  // console.log({userOptions, officerDept})

  // Fetch Services
  const {
    data: servicesData,
    isLoading: serviceLoading,
    isFetching: serviceFetching,
  } = useGetServices([officerDept?._id], {
    page: 1,
    limit: MAX_LIMIT,
    department: officerDept?._id,
  });
  const servicesOptions = (servicesData?.data?.data?.docs || []).map((s) => ({
    label: s.title || s.name || "",
    value: s._id,
  }));

  // Fetch Subservices based on selectedService
  const {
    data: subservicesData,
    isLoading: isSubservicesLoading,
    isFetching: isSubservicesFetching,
  } = useGetSubservices(
    [selectedService],
    {
      serviceId: Array.isArray(selectedService)
        ? selectedService.join(",")
        : selectedService || "",
      page: 1,
      limit: MAX_LIMIT,
    },
    !!(selectedService && selectedService.length > 0),
  );
  const subservicesOptions = (subservicesData?.data?.data?.docs || []).map(
    (s) => ({
      label: s.title || s.name || "",
      value: s._id,
    }),
  );

  // When new sub-services options load after service change,
  // keep only the selected sub-services that exist in the new options.
  // Guard: skip if still loading to avoid wiping selection on in-flight empty response.
  const isFirstRenderService = useRef(true);
  useEffect(() => {
    console.log({
      isFirstRenderService: isFirstRenderService.current,
      isSubservicesLoading,
      isSubservicesFetching,
      subservicesOptions: subservicesOptions.length,
      selectedService,
    });
    if (isFirstRenderService.current) {
      isFirstRenderService.current = false;
      return;
    }
    // Don't run while subservices are being fetched — the options array is
    // temporarily empty during the request, which would incorrectly clear
    // the user's existing selection.
    if (isSubservicesLoading || isSubservicesFetching) return;
    const currentSubservices = getValues("services") || [];
    if (currentSubservices.length === 0) return;
    const validIds = new Set(subservicesOptions.map((o) => o.value));
    const filtered = currentSubservices.filter((id) => validIds.has(id));
    setValue("services", filtered, { shouldValidate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    JSON.stringify({
      isSubservicesLoading,
      isSubservicesFetching,
      subservicesOptions,
      selectedService,
    }),
  ]);

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
        label="Select Officer"
        required
        options={userOptions}
        placeholder="Select an officer"
        disabled={isEdit}
      />
      <RhfSelect
        name="service"
        label="Service"
        required
        isMultiple={true}
        options={servicesOptions}
        placeholder="Select services"
        isLoading={serviceLoading || serviceFetching}
      />
      {
        <RhfSelect
          name="services"
          label="Sub-services"
          required
          isMultiple={true}
          options={subservicesOptions}
          placeholder={
            !selectedService || selectedService.length === 0
              ? "Select service first"
              : "Select sub-services"
          }
          disabled={
            !selectedService ||
            selectedService.length === 0 ||
            serviceLoading ||
            isSubservicesLoading
          }
          isLoading={
            serviceLoading || isSubservicesFetching || isSubservicesLoading
          }
        />
      }

      <RhfSelect
        name="district"
        label="District"
        required
        options={districtOptions}
        placeholder="Select district"
      />
      <RhfSelect
        name="wards"
        label="Subdivision"
        required
        isMultiple={true}
        options={subdivisionOptions}
        placeholder={
          !selectedDistrict ? "Select district first" : "Select subdivisions"
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
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
