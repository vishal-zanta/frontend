import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import RhfBadgeSelect from "@/components/rhfinputs/RhfBadgeSelect";
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
            required
            maxLength={6}
          />
        </div>
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

  const isUrban = watch(`${prefix}.isUrban`);
  const selectedState = watch(`${prefix}.state`);
  const selectedDistrict = watch(`${prefix}.district`);
  const selectedBlock = watch(`${prefix}.block`);
  const selectedPanchayat = watch(`${prefix}.panchayat`);
  const selectedUrbanPanchayat = watch(`${prefix}.urbanPanchayat`);

  const districtOptionsRef = useRef([]);
  const blocksOptionsRef = useRef([]);
  const panchayatOptionsRef = useRef([]);
  const urbanPanchayatOptionsRef = useRef([]);

  const selectedDistrictId = (districtOptionsRef.current || []).find(
    (v) => v.value === selectedDistrict || v.label === selectedDistrict,
  )?.raw?._id;

  const selectedBlockId = (blocksOptionsRef.current || []).find(
    (v) => v.value === selectedBlock || v.label === selectedBlock,
  )?.raw?._id;

  const selectedPanchayatId = (panchayatOptionsRef.current || []).find(
    (v) => v.value === selectedPanchayat || v.label === selectedPanchayat,
  )?.raw?._id;

  const selectedUrbanPanchayatId = (urbanPanchayatOptionsRef.current || []).find(
    (v) =>
      v.value === selectedUrbanPanchayat || v.label === selectedUrbanPanchayat,
  )?.raw?._id;

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
    {
      isValueId: false,
    },
  );

  districtOptionsRef.current = districtOptions;
  blocksOptionsRef.current = blockOptions;
  panchayatOptionsRef.current = panchayatOptions;
  urbanPanchayatOptionsRef.current = urbanPanchayatOptions;

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

  // Clear fields when state changes
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
      setValue(`${prefix}.block`, "", {
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
      setValue(`${prefix}.village`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(`${prefix}.urbanPanchayat`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(`${prefix}.ward`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(`${prefix}.landmark`, "", {
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
     {!disabled ?  <div
        className={cn(
          "space-y-4 transition-all duration-200",
          disabled && "pointer-events-none opacity-60 select-none",
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RhfSelect
            name={`${prefix}.state`}
            label={t("State", "राज्य")}
            placeholder={t("Select State", "राज्य चुनें")}
            options={stateOptions}
            required
          />

          {!isBihar && (
            <RhfSelect
              name={`${prefix}.city`}
              label={t("City", "शहर")}
              placeholder={t("Select City", "शहर चुनें")}
              options={cityOptions}
              disabled={!selectedState}
              required={!isBihar}
            />
          )}
        </div>

        {isBihar && (
          <RhfBadgeSelect
            name={`${prefix}.isUrban`}
            label={t("Area Type", "क्षेत्र का प्रकार")}
            options={[
              { label: t("Rural", "ग्रामीण"), value: false },
              { label: t("Urban", "शहरी"), value: true },
            ]}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    disabled={
                      !selectedDistrict || isUrbanPanchayatsLoading
                    }
                  />

                  <RhfSelect
                    name={`${prefix}.ward`}
                    label={t("Ward", "वार्ड")}
                    placeholder={t("Select Ward", "वार्ड चुनें")}
                    options={wardOptions}
                    isLoading={isWardsLoading}
                    disabled={
                      !selectedUrbanPanchayat || isWardsLoading
                    }
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
                    disabled={!selectedDistrict || isBlocksLoading}
                    isLoading={isBlocksLoading}
                    required
                  />

                  <RhfSelect
                    name={`${prefix}.panchayat`}
                    label={t("Panchayat", "पंचायत")}
                    placeholder={t(
                      "Select Panchayat name",
                      "पंचायत का नाम",
                    )}
                    options={panchayatOptions}
                    disabled={!selectedBlock || isPanchayatsLoading}
                    isLoading={isPanchayatsLoading}
                    required
                  />

                  <RhfSelect
                    name={`${prefix}.village`}
                    label={t("Village", "गाँव")}
                    placeholder={t(
                      "Select Village name",
                      "गाँव का नाम चुनें",
                    )}
                    options={villageOptions}
                    isLoading={isVillagesLoading}
                    disabled={!selectedPanchayat || isVillagesLoading}
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
            </>
          ) : (
            <>
              <RhfInput
                name={`${prefix}.addressLine2`}
                label={t("Address Line 2", "पता विवरण 2")}
                placeholder={t(
                  "Apartment, suite, landmark",
                  "अपार्टमेंट, सुइट, लैंडमार्क",
                )}
                maxLength={50}
                className="md:col-span-2"
              />
            </>
          )}

          <RhfInput
            name={`${prefix}.pincode`}
            label={t("Pin Code", "पिन कोड")}
            placeholder="800001"
            inputClassName="tracking-widest"
            isNumsOnly
            required
            maxLength={6}
          />
        </div>
      </div> : null}
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

  const {
    districtOptions,
    blockOptions,
    panchayatOptions,
    villageOptions,
    urbanPanchayatOptions,
    wardOptions,
  } = useGetAddressFields(
    {
      lang,
      districtId: permanentAddress?.district,
      blockId: permanentAddress?.block,
      panchayatId: permanentAddress?.panchayat,
      urbanPanchayatId: permanentAddress?.urbanPanchayat,
      isUrban: permanentAddress?.isUrban,
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
    const blockLabel =
      blockOptions.find(
        (b) => b.value === perm?.block || b.raw?._id === perm?.block,
      )?.label ||
      perm?.block ||
      "";
    const panchayatLabel =
      panchayatOptions.find(
        (p) =>
          p.value === perm?.panchayat || p.raw?._id === perm?.panchayat,
      )?.label ||
      perm?.panchayat ||
      "";
    const villageLabel =
      villageOptions.find(
        (v) =>
          v.value === perm?.village || v.raw?._id === perm?.village,
      )?.label ||
      perm?.village ||
      "";
    const urbanPanchayatLabel =
      urbanPanchayatOptions.find(
        (u) =>
          u.value === perm?.urbanPanchayat ||
          u.raw?._id === perm?.urbanPanchayat,
      )?.label ||
      perm?.urbanPanchayat ||
      "";
    const wardLabel =
      wardOptions.find(
        (w) => w.value === perm?.ward || w.raw?._id === perm?.ward,
      )?.label ||
      perm?.ward ||
      "";

    return {
      districtLabel,
      blockLabel,
      panchayatLabel,
      villageLabel,
      urbanPanchayatLabel,
      wardLabel,
    };
  };

  const handleToggleSameAddress = (checked) => {
    setValue("isCrpEqualPerAdd", checked, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (checked) {
      const perm = getValues("citizenInfo.address");
      const {
        districtLabel,
        blockLabel,
        panchayatLabel,
        villageLabel,
        urbanPanchayatLabel,
        wardLabel,
      } = getAddressLabels(perm);

      setValue("address.isUrban", Boolean(perm?.isUrban), {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.addressLine", perm?.addressLine || "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.state", "Bihar", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.city", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.district", districtLabel, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.block", blockLabel, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.panchayat", panchayatLabel, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.thana", perm?.thana || "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.village", villageLabel, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.urbanPanchayat", urbanPanchayatLabel, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.ward", wardLabel, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.landmark", perm?.landmark || "", {
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
      const {
        districtLabel,
        blockLabel,
        panchayatLabel,
        villageLabel,
        urbanPanchayatLabel,
        wardLabel,
      } = getAddressLabels(permanentAddress);

      setValue(
        "address.isUrban",
        Boolean(permanentAddress?.isUrban),
        { shouldValidate: true },
      );
      setValue(
        "address.addressLine",
        permanentAddress?.addressLine || "",
        { shouldValidate: true },
      );
      setValue("address.state", "Bihar", { shouldValidate: true });
      setValue("address.city", "", { shouldValidate: true });
      setValue("address.district", districtLabel, {
        shouldValidate: true,
      });
      setValue("address.block", blockLabel, {
        shouldValidate: true,
      });
      setValue("address.panchayat", panchayatLabel, {
        shouldValidate: true,
      });
      setValue("address.thana", permanentAddress?.thana || "", {
        shouldValidate: true,
      });
      setValue("address.village", villageLabel, {
        shouldValidate: true,
      });
      setValue(
        "address.urbanPanchayat",
        urbanPanchayatLabel,
        { shouldValidate: true },
      );
      setValue("address.ward", wardLabel, {
        shouldValidate: true,
      });
      setValue("address.landmark", permanentAddress?.landmark || "", {
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
    villageOptions,
    urbanPanchayatOptions,
    wardOptions,
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
