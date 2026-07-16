import React from "react";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import FormSection from "./FormSection";
import { PREFERRED_LANGUAGE_OPTIONS, CHANNEL_OPTIONS } from "../schema";

export default function CitizenInfoSection({ t, allChannels , complaintSourcesLoading }) {
  console.log({allChannels});
  return (
    <FormSection title={t("Complainant Details", "शिकायतकर्ता का विवरण")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
        <RhfInput
          name="citizenInfo.fullName"
          label={t("Full Name", "पूरा नाम")}
          placeholder={t("Enter your full name", "अपना पूरा नाम दर्ज करें")}
        />
        <RhfInput
          name="citizenInfo.mobile"
          label={t("Mobile Number", "मोबाइल नंबर")}
          placeholder={t("10-digit mobile number", "10 अंकों का मोबाइल नंबर")}
          required
          isNumsOnly={true}
          maxLength={10}
        />
        <RhfInput
          name="citizenInfo.alternateMobile"
          label={t("Alternate Mobile", "वैकल्पिक मोबाइल")}
          placeholder={t("Optional alternate number", "वैकल्पिक नंबर")}
          isNumsOnly={true}
          maxLength={10}

        />
        <RhfInput
          name="citizenInfo.email"
          label={t("Email", "ईमेल")}
          placeholder="example@email.com"
          type="email"
        />
        <RhfSelect
          name="citizenInfo.preferredLanguage"
          label={t("Preferred Language", "पसंदीदा भाषा")}
          placeholder={t("Select language", "भाषा चुनें")}
          options={PREFERRED_LANGUAGE_OPTIONS}
          required
        />
          <RhfSelect
          name="channel"
          label={t("Channel", "चैनल")}
          placeholder={complaintSourcesLoading ? t("Loading...", "लोड हो रहा है...") : t("Select channel", "चैनल चुनें")}
          options={allChannels}
          required
        />
      </div>
    </FormSection>
  );
}
