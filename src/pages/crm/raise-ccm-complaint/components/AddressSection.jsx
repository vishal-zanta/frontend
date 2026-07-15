import React from "react";
import RhfInput from "@/components/rhfinputs/RhfInput";
import FormSection from "./FormSection";

export default function AddressSection({ t }) {
  return (
    <FormSection title={t("Address", "पता")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RhfInput
          name="address.state"
          label={t("State", "राज्य")}
          placeholder={t("e.g. Bihar", "जैसे बिहार")}
          required
        />
        <RhfInput
          name="address.district"
          label={t("District", "ज़िला")}
          placeholder={t("e.g. Patna", "जैसे पटना")}
          required
        />
        <RhfInput
          name="address.subdivision"
          label={t("Subdivision", "उपखंड")}
          placeholder={t("e.g. Danapur", "जैसे दानापुर")}
          required
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
