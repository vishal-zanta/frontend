import React, { useEffect } from "react";
import RhfInput from "@/components/rhfinputs/RhfInput";
import FormSection from "./FormSection";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { useFormContext, useWatch } from "react-hook-form";
import subDivisionsData from "@/utils/sub-divisions.json";

export default function AddressSection({
  t,
  demographyLoading,
  allDemography,
}) {
  return (
    <FormSection title={t("Address", "पता")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RhfInput
          name="address.state"
          label={t("State", "राज्य")}
          placeholder={t("e.g. Bihar", "जैसे बिहार")}
          required
          disabled
        />

        <District_SubDivision
          t={t}
          allDemography={allDemography}
          demographyLoading={demographyLoading}
        />
        <RhfInput
          name="address.villageOrWard"
          label={t("Village / Ward", "गाँव / वार्ड")}
          placeholder={t("Village or ward name", "गाँव या वार्ड का नाम")}
        />
        <RhfInput
          name="address.pinCode"
          label={t("Pin Code", "पिन कोड")}
          placeholder="e.g. 800001"
          inputClassName="tracking-widest"
          required
          isNumsOnly={true}
          maxLength={6}
        />
        <RhfInput
          name="address.landmark"
          label={t("Landmark", "प्रमुख चिह्न")}
          placeholder={t("Near...", "पास में...")}
        />
      </div>
    </FormSection>
  );
}

const District_SubDivision = ({ t, demographyLoading, allDemography }) => {
  const { resetField } = useFormContext();
  const districtValue = useWatch({ name: "address.district" });

  useEffect(() => {
    if (districtValue) {
      resetField("address.subdivision", "");
    }
  }, [districtValue, resetField]);

  const selectedDistrictObj = allDemography?.find((d) => d.value === districtValue);
  const districtLabel = selectedDistrictObj?.name;

  const rawSubdivisions = districtLabel ? subDivisionsData[districtLabel] || [] : [];
  const subdivisionOptions = rawSubdivisions.map((sub) => ({
    label: sub,
    value: sub,
  }));

  return (
    <>
      <RhfSelect
        name="address.district"
        label={t("District", "ज़िला")}
        placeholder={
          demographyLoading
            ? t("Loading...", "लोड हो रहा है...")
            : t("e.g. Patna", "जैसे पटना")
        }
        required
        options={allDemography}
        disabled={demographyLoading}
      />
      <RhfSelect
        name="address.subdivision"
        label={t("Subdivision", "उपखंड")}
        placeholder={
          !districtValue
            ? t("Select District first", "पहले ज़िला चुनें")
            : t("e.g. Danapur", "जैसे दानापुर")
        }
        required
        options={subdivisionOptions}
        disabled={!districtValue}
      />
    </>
  );
};
