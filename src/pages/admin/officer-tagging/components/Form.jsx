import React, { useEffect, useRef } from "react";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { Button } from "@/components/ui/button";
import { useFormContext, useWatch } from "react-hook-form";
import {
  useGetServices,
  useGetSubservices,
  useGetDemographics,
} from "../../master-data/hooks";
import subDivisionsData from "@/utils/sub-divisions.json";

export default function Form({
  isEdit,
  isLoading,
  userOptions = [],
  onCancel,
}) {
  const { resetField, getValues, setValue } = useFormContext();
  const selectedService = useWatch({ name: "service" });
  const selectedDistrict = useWatch({ name: "district" });

  // Fetch Services
  const { data: servicesData } = useGetServices([], { page: 1, limit: 100 });
  const servicesOptions = (servicesData?.data?.data?.docs || []).map((s) => ({
    label: s.title || s.name || "",
    value: s._id,
  }));

  // Fetch Subservices based on selectedService
  const { data: subservicesData } = useGetSubservices(
    [selectedService],
    {
      serviceId: Array.isArray(selectedService)
        ? selectedService.join(",")
        : selectedService || "",
      page: 1,
      limit: 500,
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
  const isFirstRenderService = useRef(true);
  useEffect(() => {
    if (isFirstRenderService.current) {
      isFirstRenderService.current = false;
      return;
    }
    const currentSubservices = getValues("services") || [];
    if (currentSubservices.length === 0) return;
    const validIds = new Set(subservicesOptions.map((o) => o.value));
    const filtered = currentSubservices.filter((id) => validIds.has(id));
    setValue("services", filtered, { shouldValidate: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subservicesOptions.length, selectedService]);

  // Fetch Districts (Demographics)
  const { data: demographyData } = useGetDemographics([], {
    page: 1,
    limit: 100,
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
    resetField("wards", []);
  }, [selectedDistrict, resetField]);

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
      />
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
        disabled={!selectedService || selectedService.length === 0}
      />
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
      <div className="flex justify-end gap-2 py-4">
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
  );
}
