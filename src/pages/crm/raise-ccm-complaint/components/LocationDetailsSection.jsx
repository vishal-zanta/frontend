import React from "react";
import { useFormContext } from "react-hook-form";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import FormSection from "./FormSection";
import { useLanguage } from "@/context/LanguageContext";
import { useClearLocationFields, useGetLocationAddressFields } from "../hooks";

export default function LocationDetailsSection({ t }) {
  const { lang } = useLanguage();
  const { watch, control, setValue } = useFormContext();

  const selectedDivisionId = watch("location.division");
  const selectedDistrictId = watch("location.district");
  const selectedSubdivisionId = watch("location.subdivision");
  const selectedBlockId = watch("location.block");

  const {
    divisionOptions,
    isDivisionsLoading,
    districtOptions,
    isDistrictsLoading,
    subdivisionOptions,
    isSubdivisionsLoading,
    blockOptions,
    isBlocksLoading,
    panchayatOptions,
    isPanchayatsLoading,
  } = useGetLocationAddressFields(
    {
      lang,
      divisionId: selectedDivisionId,
      districtId: selectedDistrictId,
      subdivisionId: selectedSubdivisionId,
      blockId: selectedBlockId,
    },
    { isValueId: true },
  );

  useClearLocationFields({
    control,
    setValue,
  });

  return (
    <FormSection
      title={t(
        "Location Details/Place of occurence",
        "स्थान का विवरण/घटना का स्थान",
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RhfSelect
          name="location.division"
          label={t("Division", "प्रमंडल")}
          placeholder={t("Select Division", "प्रमंडल चुनें")}
          options={divisionOptions}
          isLoading={isDivisionsLoading}
          disabled={isDivisionsLoading}
          required
        />

        <RhfSelect
          name="location.district"
          label={t("District", "ज़िला")}
          placeholder={t("Select District", "जिला चुनें")}
          options={districtOptions}
          isLoading={isDistrictsLoading}
          disabled={!selectedDivisionId || isDistrictsLoading}
          required
        />

        <RhfSelect
          name="location.subdivision"
          label={t("Subdivision", "अनुमंडल")}
          placeholder={t("Select Subdivision", "अनुमंडल चुनें")}
          options={subdivisionOptions}
          isLoading={isSubdivisionsLoading}
          disabled={!selectedDistrictId || isSubdivisionsLoading}
          required
        />

        <RhfSelect
          name="location.block"
          label={t("Block", "प्रखंड")}
          placeholder={t("Select Block", "प्रखंड चुनें")}
          options={blockOptions}
          disabled={!selectedSubdivisionId || isBlocksLoading}
          isLoading={isBlocksLoading}
          required
        />

        <RhfSelect
          name="location.panchayat"
          label={t("Select Panchayat", "पंचायत")}
          placeholder={t("Select Panchayat name", "पंचायत का नाम")}
          options={panchayatOptions}
          disabled={!selectedBlockId || isPanchayatsLoading}
          isLoading={isPanchayatsLoading}
          required
        />

        <RhfInput
          name="location.pincode"
          label={t("Pin Code", "पिन कोड")}
          placeholder="800001"
          inputClassName="tracking-widest"
          required
          isNumsOnly
          maxLength={6}
        />
      </div>
    </FormSection>
  );
}
