import React, { useEffect } from "react";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import RhfTextarea from "@/components/rhfinputs/RhfTextarea";
import FormWrappers from "../../FormWrappers";
import { useFormContext, useWatch } from "react-hook-form";
import { useLanguage } from "@/context/LanguageContext";

export default function Form({ fields, isLoading }) {
  const { t } = useLanguage();

  return (
    <FormWrappers
      heading={t("Health Department - Raise Grievance", "स्वास्थ्य विभाग - शिकायत दर्ज करें")}
      isLoading={isLoading}
    >
      <div className="space-y-4 px-4">
        {/* Date & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RhfInput
            name="dateOfIncident"
            label={t("Date of Incident", "घटना की तिथि")}
            type="date"
            required
          />
          <RhfInput
            name="locationOfIncident"
            label={t("Location of Incident", "घटना का स्थान")}
            placeholder={t("Enter location of incident", "घटना का स्थान दर्ज करें")}
          />
        </div>

        {/* Complainant Name & Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RhfInput
            name="citizen.name"
            label={t("Complainant Name", "शिकायतकर्ता का नाम")}
            placeholder={t("Enter complainant name", "शिकायतकर्ता का नाम दर्ज करें")}
            required
          />
          <RhfInput
            name="citizen.mobileNumber"
            label={t("Complainant Mobile Number", "शिकायतकर्ता का मोबाइल नंबर")}
            placeholder={t("Enter 10-digit mobile number", "10 अंकों का मोबाइल नंबर दर्ज करें")}
            required
            isNumsOnly={true}
            maxLength={10}
          />
        </div>

        {/* Gender & Complainant Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RhfSelect
            name="citizen.gender"
            label={t("Gender", "लिंग")}
            placeholder={t("Select Gender", "लिंग चुनें")}
            options={fields?.gender || []}
          />
          <RhfSelect
            name="complainantType"
            label={t("Complainant Type", "शिकायतकर्ता का प्रकार")}
            placeholder={t("Select Complainant Type", "शिकायतकर्ता का प्रकार चुनें")}
            required
            options={fields?.complainantType || []}
          />
        </div>

        {/* Grievance Type */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <RhfSelect
            name="grievanceType"
            label={t("Grievance Type", "शिकायत का प्रकार")}
            placeholder={t("Select Grievance Type", "शिकायत का प्रकार चुनें")}
            required
            options={fields?.grievanceType || []}
          />
        </div>

        {/* District, Block, Village */}
        <DistrictPart fields={fields} />

        {/* Institution Type & Institution Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RhfSelect
            name="institutionType"
            label={t("Institution Type", "संस्थान का प्रकार")}
            placeholder={t("Select Institution Type", "संस्थान का प्रकार चुनें")}
            required
            options={fields?.institutionType || []}
          />
          <RhfSelect
            name="institutionName"
            label={t("Institution Name", "संस्थान का नाम")}
            placeholder={t("Select Institution Name", "संस्थान का नाम चुनें")}
            options={fields?.institutionName || []}
          />
        </div>

        {/* Grievance Against Whom */}
        <RhfInput
          name="grievanceAgainstWhom"
          label={t("Grievance Against Whom", "किसके खिलाफ शिकायत")}
          placeholder={t("Enter person / department / authority name", "व्यक्ति / विभाग / प्राधिकारी का नाम दर्ज करें")}
        />

        {/* Brief of Grievance */}
        <RhfTextarea
          name="description"
          label={t("Brief of Grievance", "शिकायत का संक्षिप्त विवरण")}
          placeholder={t("Enter brief description of grievance...", "शिकायत का संक्षिप्त विवरण दर्ज करें...")}
          required
          rows={4}
        />
      </div>
    </FormWrappers>
  );
}

const DistrictPart = ({ fields }) => {
  const { t } = useLanguage();
  const { setValue, control } = useFormContext();
  const districtValue = useWatch({ name: "address.district", control });
  const blockValue = useWatch({ name: "address.block", control });

  useEffect(() => {
    setValue("address.block", "");
    setValue("address.village", "");
  }, [districtValue, setValue]);

  useEffect(() => {
    setValue("address.village", "");
  }, [blockValue, setValue]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RhfSelect
          name="address.district"
          label={t("District", "जिला")}
          placeholder={t("Select District", "जिला चुनें")}
          required
          options={fields?.district || []}
        />
        <RhfSelect
          name="address.block"
          label={t("Block", "प्रखंड")}
          placeholder={
            !districtValue
              ? t("Select District First", "पहले जिला चुनें")
              : t("Select Block", "प्रखंड चुनें")
          }
          required
          options={(fields?.block || []).filter(
            (o) => o.district === districtValue,
          )}
          disabled={!districtValue}
        />
      </div>
      <RhfSelect
        name="address.village"
        label={t("Village", "गाँव")}
        placeholder={
          !districtValue || !blockValue
            ? t("Select Block First", "पहले प्रखंड चुनें")
            : t("Select Village", "गाँव चुनें")
        }
        options={(fields?.village || []).filter((o) => o.block === blockValue)}
        disabled={!blockValue || !districtValue}
      />
    </>
  );
};
