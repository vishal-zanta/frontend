import React from "react";
import { useFormContext } from "react-hook-form";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import FormSection from "./FormSection";
import subDivisionsData from "@/utils/sub-divisions.json";

const BIHAR_DIVISIONS = [
  { label: "Patna (पटना)", value: "Patna" },
  { label: "Tirhut (तिरहुत)", value: "Tirhut" },
  { label: "Saran (सारण)", value: "Saran" },
  { label: "Darbhanga (दरभंगा)", value: "Darbhanga" },
  { label: "Kosi (कोसी)", value: "Kosi" },
  { label: "Purnia (पूर्णिया)", value: "Purnia" },
  { label: "Bhagalpur (भागलपुर)", value: "Bhagalpur" },
  { label: "Munger (मुंगेर)", value: "Munger" },
  { label: "Magadh (मगध)", value: "Magadh" },
];

export default function LocationDetailsSection({
  t,
  allDemography,
  demographyLoading,
}) {
  const { watch, setValue } = useFormContext();
  const selectedDistrictId = watch("location.district");

  // Find the selected district object from allDemography to get the English name
  const selectedDistrict = React.useMemo(() => {
    return allDemography?.find((d) => d.value === selectedDistrictId);
  }, [allDemography, selectedDistrictId]);

  const districtName = selectedDistrict?.name;

  // Find the subdivision options for the selected district name from json
  const subdivisionOptions = React.useMemo(() => {
    if (!districtName) return [];
    const subdivisions = subDivisionsData[districtName];
    if (!subdivisions) return [];
    return subdivisions.map((sub) => ({
      label: sub,
      value: sub,
    }));
  }, [districtName]);

  // Clear subdivision on district change
  const prevDistrictRef = React.useRef(selectedDistrictId);
  React.useEffect(() => {
    if (prevDistrictRef.current !== selectedDistrictId) {
      setValue("location.subdivision", "");
      prevDistrictRef.current = selectedDistrictId;
    }
  }, [selectedDistrictId, setValue]);

  const isSubdivisionDisabled = !selectedDistrictId;

  return (
    <FormSection title={t("Location Details", "स्थान का विवरण")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RhfSelect
          name="location.division"
          label={t("Division", "प्रमंडल")}
          placeholder={t("Select Division", "प्रमंडल चुनें")}
          options={BIHAR_DIVISIONS}
          required
        />

        <RhfSelect
          name="location.district"
          label={t("District", "ज़िला")}
          placeholder={t("Select District", "जिला चुनें")}
          options={allDemography}
          isLoading={demographyLoading}
          required
        />

        <RhfSelect
          name="location.subdivision"
          label={t("Subdivision", "अनुमंडल")}
          placeholder={t("Select Subdivision", "अनुमंडल चुनें")}
          options={subdivisionOptions}
          disabled={isSubdivisionDisabled}
          required
        />

        <RhfInput
          name="location.block"
          label={t("Block", "प्रखंड")}
          placeholder={t("Block name", "प्रखंड का नाम")}
          required
        />

        <RhfInput
          name="location.panchayat"
          label={t("Panchayat", "पंचायत")}
          placeholder={t("Panchayat name", "पंचायत का नाम")}
          required
        />

        <RhfInput
          name="location.pincode"
          label={t("Pin Code", "पिन कोड")}
          placeholder="e.g. 800001"
          inputClassName="tracking-widest"
          required
          isNumsOnly
          maxLength={6}
        />
      </div>
    </FormSection>
  );
}
