import React, { useEffect } from "react";
import RhfInput from "@/components/rhfinputs/RhfInput";
import FormSection from "./FormSection";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
// import { useGetUlbs } from "@/pages/admin/master-data/hooks";
import { useFormContext, useWatch } from "react-hook-form";

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
  // const { resetField } = useFormContext();
  // const district = useWatch({ name: "address.district" });
  // const API_PARAMS = { page: 1, limit: 500, district, select:"name,nameHindi" };
  // const { data, isLoading, isRefetching, isFetching, error } = useGetUlbs(
  //   [API_PARAMS],
  //   API_PARAMS,
  //   !!district,
  // );
  // const options = (data?.data?.data?.docs || []).map((v) => ({
  //   label: t(v.name, v.nameHindi),
  //   value: v.name,
  // }));
  // // console.log({ options, district });
  // const loading = isLoading || isFetching || isRefetching;
  // useEffect(() => {
  //   // console.log("District changed", district);
  //   if (district) {
  //     resetField("address.subdivision", "");
  //   }
  // }, [district]);
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
      <RhfInput
        name="address.subdivision"
        label={t("Subdivision", "उपखंड")}
        placeholder={
          t("e.g. Danapur", "जैसे दानापुर")
        }
        required
  
  
      />
    </>
  );
};
