import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import FormSection from "./FormSection";
import statesCitiesData from "@/utils/states_cities.json";
import { cn } from "@/lib/utils";
import { useClearAddressFields, useGetAddressFields } from "../hooks";
import { useLanguage } from "@/context/LanguageContext";

const stateOptions = Object.keys(statesCitiesData)
  .sort()
  .map((state) => ({
    label: state,
    value: state,
  }));

export const PermanentAddress = ({ t }) => {
  const { lang } = useLanguage();
  const { watch, setValue, control } = useFormContext();
  const prefix = "citizenInfo.address";

  const selectedDistrictId = watch(`${prefix}.district`);
  const selectedSubdivisionId = watch(`${prefix}.subdivision`);

  const {
    districtOptions,
    isDistrictsLoading,
    blockOptions,
    isBlocksLoading,
    panchayatOptions,
    thanaOptions,
    isPanchayatsLoading,
    isThanasLoading,
  } = useGetAddressFields(
    {
      lang,
      districtId: selectedDistrictId,
      blockId: selectedSubdivisionId,
    },
    {
      isValueId: true,
    },
  );

  useClearAddressFields({
    control,
    prefix,
    setValue,
  });

  return (
    <FormSection title={t("Applicant Permanent Address", "स्थायी पता")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-200">
        <RhfInput
          name={`${prefix}.addressLine`}
          label={t("Address Line", "पता विवरण")}
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

        <RhfSelect
          name={`${prefix}.subdivision`}
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
          label={t("Select Panchayat", "पंचायत")}
          placeholder={t("Select Panchayat name", "पंचायत का नाम")}
          options={panchayatOptions}
          disabled={!selectedSubdivisionId || isPanchayatsLoading}
          isLoading={isPanchayatsLoading}
          required
        />

        <RhfSelect
          name={`${prefix}.thana`}
          label={t("Select Thana", "थाना")}
          placeholder={t("Select Thana", "थाना चुनें")}
          options={thanaOptions}
          disabled={!selectedSubdivisionId || isThanasLoading}
          isLoading={isThanasLoading}
          required
        />

        <RhfInput
          name={`${prefix}.pincode`}
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
};

export const CorrespondenceAddress = ({
  t,
  action,
  disabled,
}) => {
  const { lang } = useLanguage();
  const { watch, setValue, control } = useFormContext();
  const prefix = "address";

  const selectedState = watch(`${prefix}.state`);
  const selectedDistrictId = watch(`${prefix}.district`);
  const selectedSubdivisionId = watch(`${prefix}.subdivision`);
    const districtOptionsRef = useRef([]);
    const blocksOptionsRef = useRef([]);

  const {
    districtOptions,
    isDistrictsLoading,
    blockOptions,
    isBlocksLoading,
    panchayatOptions,
    thanaOptions,
    isPanchayatsLoading,
    isThanasLoading,
  } = useGetAddressFields(
    {
      lang,
     districtId: (districtOptionsRef.current || []).find(v=> v.value === selectedDistrictId)?.raw?._id,
      blockId: (blocksOptionsRef.current || []).find(v=> v.value === selectedSubdivisionId)?.raw?._id,
    },
    {
      isValueId: false,
    },
  );
  districtOptionsRef.current = districtOptions;
blocksOptionsRef.current = blockOptions;

  useClearAddressFields({
    control,
    prefix,
    setValue,
  });

  // City options for correspondence address
  const cityOptions = React.useMemo(() => {
    if (!selectedState) return [];
    const cities = statesCitiesData[selectedState] || [];
    return cities.map((city) => ({
      label: city,
      value: city,
    }));
  }, [selectedState]);

  // Clear city, district, subdivision, thana, panchayat when state changes
  const prevStateRef = React.useRef(selectedState);
  React.useEffect(() => {
    if (
      prevStateRef.current !== undefined &&
      prevStateRef.current !== selectedState
    ) {
      if (selectedState !== "Bihar") {
        setValue("isCrpEqualPerAdd", false, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      setValue(`${prefix}.city`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(`${prefix}.district`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(`${prefix}.subdivision`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(`${prefix}.panchayat`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(`${prefix}.thana`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    prevStateRef.current = selectedState;
  }, [selectedState, setValue, prefix]);

  const isBihar = selectedState === "Bihar";

  return (
    <FormSection
      title={t("Correspondence Address", "पत्राचार का पता")}
      action={action}
    >
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-200",
          disabled && "pointer-events-none opacity-60 select-none",
        )}
      >
        <RhfInput
          name={`${prefix}.addressLine`}
          label={t("Address Line", "पता विवरण")}
          placeholder={t(
            "House no., Street, Area",
            "मकान संख्या, सड़क, क्षेत्र",
          )}
          required
          maxLength={50}
          className="md:col-span-2"
        />

        <RhfSelect
          name={`${prefix}.state`}
          label={t("State", "राज्य")}
          placeholder={t("Select State", "राज्य चुनें")}
          options={stateOptions}
          required
        />

        <RhfSelect
          name={`${prefix}.city`}
          label={t("City", "शहर")}
          placeholder={t("Select City", "शहर चुनें")}
          options={cityOptions}
          disabled={!selectedState}
          required={!isBihar}
        />

        {isBihar ? (
          <>
            <RhfSelect
              name={`${prefix}.district`}
              label={t("District", "ज़िला")}
              placeholder={t("Select District", "जिला चुनें")}
              options={districtOptions}
              isLoading={isDistrictsLoading}
              disabled={isDistrictsLoading}
              required
            />

            <RhfSelect
              name={`${prefix}.subdivision`}
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
              label={t("Select Panchayat", "पंचायत")}
              placeholder={t("Select Panchayat name", "पंचायत का नाम")}
              options={panchayatOptions}
              disabled={!selectedSubdivisionId || isPanchayatsLoading}
              isLoading={isPanchayatsLoading}
              required
            />

            <RhfSelect
              name={`${prefix}.thana`}
              label={t("Select Thana", "थाना")}
              placeholder={t("Select Thana", "थाना चुनें")}
              options={thanaOptions}
              disabled={!selectedSubdivisionId || isThanasLoading}
              isLoading={isThanasLoading}
              required
            />
          </>
        ) : (
          <>
            <RhfInput
              name={`${prefix}.district`}
              label={t("District", "ज़िला")}
              placeholder={t("Enter District", "ज़िला दर्ज करें")}
              maxLength={50}
            />

            <RhfInput
              name={`${prefix}.subdivision`}
              label={t("Block / Subdivision", "प्रखंड / अनुमंडल")}
              placeholder={t(
                "Enter Block / Subdivision",
                "प्रखंड / अनुमंडल दर्ज करें",
              )}
              maxLength={50}
            />

            <RhfInput
              name={`${prefix}.panchayat`}
              label={t("Select Panchayat", "पंचायत")}
              placeholder={t("Enter Panchayat", "पंचायत दर्ज करें")}
              maxLength={50}
            />

            <RhfInput
              name={`${prefix}.thana`}
              label={t("Select Thana", "थाना")}
              placeholder={t("Enter Thana", "थाना दर्ज करें")}
              maxLength={50}
            />
          </>
        )}

        <RhfInput
          name={`${prefix}.pincode`}
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
};

export default function AddressSection({ t }) {
  const { lang } = useLanguage();
  const { watch, setValue, getValues } = useFormContext();
  const isCrpEqualPerAdd = watch("isCrpEqualPerAdd");
  const permanentAddress = watch("citizenInfo.address");
  const correspondenceState = watch("address.state");
  const isBihar = correspondenceState === "Bihar";

  const { districtOptions, blockOptions, panchayatOptions, thanaOptions } =
    useGetAddressFields(
      {
        lang,
        districtId: permanentAddress?.district,
        blockId: permanentAddress?.subdivision,
      },
      { isValueId: true },
    );

  const getAddressLabels = (perm) => {
    const districtLabel =
      districtOptions.find(
        (d) => d.value === perm?.district || d.raw?._id === perm?.district,
      )?.label ||
      perm?.district ||
      "";
    const subdivisionLabel =
      blockOptions.find(
        (b) =>
          b.value === perm?.subdivision || b.raw?._id === perm?.subdivision,
      )?.label ||
      perm?.subdivision ||
      "";
    const panchayatLabel =
      panchayatOptions.find(
        (p) =>
          p.value === perm?.panchayat || p.raw?._id === perm?.panchayat,
      )?.label ||
      perm?.panchayat ||
      "";
    const thanaLabel =
      thanaOptions.find(
        (tItem) => tItem.value === perm?.thana || tItem.raw?._id === perm?.thana,
      )?.label ||
      perm?.thana ||
      "";

    return {
      districtLabel,
      subdivisionLabel,
      panchayatLabel,
      thanaLabel,
    };
  };

  const handleToggleSameAddress = (checked) => {
    setValue("isCrpEqualPerAdd", checked, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (checked) {
      const perm = getValues("citizenInfo.address");
      const { districtLabel, subdivisionLabel, panchayatLabel, thanaLabel } =
        getAddressLabels(perm);

      setValue("address.addressLine", perm?.addressLine || "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.state", "Bihar", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.district", districtLabel, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.subdivision", subdivisionLabel, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.panchayat", panchayatLabel, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.thana", thanaLabel, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.pincode", perm?.pincode || "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  React.useEffect(() => {
    if (
      correspondenceState &&
      correspondenceState !== "Bihar" &&
      isCrpEqualPerAdd
    ) {
      setValue("isCrpEqualPerAdd", false, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [correspondenceState, isCrpEqualPerAdd, setValue]);

  React.useEffect(() => {
    if (isCrpEqualPerAdd) {
      const { districtLabel, subdivisionLabel, panchayatLabel, thanaLabel } =
        getAddressLabels(permanentAddress);

      setValue("address.addressLine", permanentAddress?.addressLine || "", {
        shouldValidate: true,
      });
      setValue("address.state", "Bihar", { shouldValidate: true });
      setValue("address.district", districtLabel, {
        shouldValidate: true,
      });
      setValue("address.subdivision", subdivisionLabel, {
        shouldValidate: true,
      });
      setValue("address.panchayat", panchayatLabel, {
        shouldValidate: true,
      });
      setValue("address.thana", thanaLabel, {
        shouldValidate: true,
      });
      setValue("address.pincode", permanentAddress?.pincode || "", {
        shouldValidate: true,
      });
    }
  }, [
    isCrpEqualPerAdd,
    JSON.stringify(permanentAddress),
    districtOptions,
    blockOptions,
    panchayatOptions,
    thanaOptions,
    setValue,
  ]);

  const sameAddressAction = isBihar ? (
    <label className="flex items-center gap-2 cursor-pointer select-none text-white text-xs sm:text-sm font-normal normal-case bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md transition-colors border border-white/20">
      <input
        type="checkbox"
        checked={!!isCrpEqualPerAdd}
        onChange={(e) => handleToggleSameAddress(e.target.checked)}
        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
      />
      <span>{t("Same as Permanent Address", "स्थायी पते के समान")}</span>
    </label>
  ) : null;

  return (
    <div className="space-y-6">
      <PermanentAddress t={t} />

      <CorrespondenceAddress
        t={t}
        action={sameAddressAction}
        disabled={!!isCrpEqualPerAdd}
      />
    </div>
  );
}
