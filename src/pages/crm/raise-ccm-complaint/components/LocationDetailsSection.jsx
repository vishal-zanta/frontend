import React from "react";
import { useFormContext } from "react-hook-form";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import RhfBadgeSelect from "@/components/rhfinputs/RhfBadgeSelect";
import FormSection from "./FormSection";
import { useLanguage } from "@/context/LanguageContext";
import { useClearAddressFields, useGetAddressFields } from "../hooks";

export default function LocationDetailsSection({ t }) {
  const { lang } = useLanguage();
  const { watch, control, setValue } = useFormContext();
  const prefix = "location";

  const isUrban = watch(`${prefix}.isUrban`);
  const selectedDistrictId = watch(`${prefix}.district`);
  const selectedBlockId = watch(`${prefix}.block`);
  const selectedPanchayatId = watch(`${prefix}.panchayat`);
  const selectedUrbanPanchayatId = watch(`${prefix}.urbanPanchayat`);

  const {
    districtOptions,
    isDistrictsLoading,
    blockOptions,
    isBlocksLoading,
    panchayatOptions,
    isPanchayatsLoading,
    villageOptions,
    isVillagesLoading,
    urbanPanchayatOptions,
    isUrbanPanchayatsLoading,
    wardOptions,
    isWardsLoading,
  } = useGetAddressFields(
    {
      lang,
      districtId: selectedDistrictId,
      blockId: selectedBlockId,
      panchayatId: selectedPanchayatId,
      urbanPanchayatId: selectedUrbanPanchayatId,
      isUrban,
    },
    { isValueId: true },
  );

  useClearAddressFields({
    control,
    prefix,
    setValue,
  });

  return (
    <FormSection
      title={t(
        "Location Details / Place of Occurrence",
        "स्थान का विवरण / घटना का स्थान",
      )}
    >
      <div className="space-y-4">
        <RhfBadgeSelect
          name={`${prefix}.isUrban`}
          label={t("Area Type", "क्षेत्र का प्रकार")}
          options={[
            { label: t("Rural", "ग्रामीण"), value: false },
            { label: t("Urban", "शहरी"), value: true },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-200">
          <RhfInput
            name={`${prefix}.addressLine`}
            label={t("Address Line", "सटीक स्थान या पता विवरण")}
            placeholder={t(
              "House no., Street, Area",
              "मकान संख्या, सड़क, क्षेत्र",
            )}
            required
            maxLength={50}
            className="md:col-span-2"
          />

          <RhfSelect
            name={`${prefix}.district`}
            label={t("District", "ज़िला")}
            placeholder={t("Select District", "जिला चुनें")}
            options={districtOptions}
            isLoading={isDistrictsLoading}
            disabled={isDistrictsLoading}
            required
          />

          {isUrban ? (
            <>
              <RhfSelect
                name={`${prefix}.urbanPanchayat`}
                label={t(
                  "Municipal Corporation / Council / Nagar Panchayat",
                  "नगर निगम / नगर परिषद / नगर पंचायत",
                )}
                placeholder={t(
                  "Select Municipal Body",
                  "नगर निकाय चुनें",
                )}
                options={urbanPanchayatOptions}
                isLoading={isUrbanPanchayatsLoading}
                disabled={!selectedDistrictId || isUrbanPanchayatsLoading}
              />

              <RhfSelect
                name={`${prefix}.ward`}
                label={t("Ward", "वार्ड")}
                placeholder={t("Select Ward", "वार्ड चुनें")}
                options={wardOptions}
                isLoading={isWardsLoading}
                disabled={!selectedUrbanPanchayatId || isWardsLoading}
              />
            </>
          ) : (
            <>
              <RhfSelect
                name={`${prefix}.block`}
                label={t("Block / Subdivision", "प्रखंड / अनुमंडल")}
                placeholder={t(
                  "Select Block / Subdivision",
                  "प्रखंड / अनुमंडल चुनें",
                )}
                options={blockOptions}
                disabled={!selectedDistrictId || isBlocksLoading}
                isLoading={isBlocksLoading}
                required
              />

              <RhfSelect
                name={`${prefix}.panchayat`}
                label={t("Panchayat", "पंचायत")}
                placeholder={t("Select Panchayat name", "पंचायत का नाम")}
                options={panchayatOptions}
                disabled={!selectedBlockId || isPanchayatsLoading}
                isLoading={isPanchayatsLoading}
                required
              />

              <RhfSelect
                name={`${prefix}.village`}
                label={t("Village", "गाँव")}
                placeholder={t("Select Village name", "गाँव का नाम चुनें")}
                options={villageOptions}
                isLoading={isVillagesLoading}
                disabled={!selectedPanchayatId || isVillagesLoading}
              />

              <RhfInput
                name={`${prefix}.thana`}
                label={t("Thana", "थाना")}
                placeholder={t("Enter Thana", "थाना दर्ज करें")}
                maxLength={50}
              />
            </>
          )}

          <RhfInput
            name={`${prefix}.landmark`}
            label={t("Landmark", "लैंडमार्क")}
            placeholder={t("Enter Landmark", "लैंडमार्क दर्ज करें")}
            maxLength={50}
          />

          <RhfInput
            name={`${prefix}.pincode`}
            label={t("Pin Code", "पिन कोड")}
            placeholder="800001"
            inputClassName="tracking-widest"
            isNumsOnly
            maxLength={6}
          />
        </div>
      </div>
    </FormSection>
  );
}
