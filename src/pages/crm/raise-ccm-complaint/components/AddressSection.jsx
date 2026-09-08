import React from "react";
import { useFormContext } from "react-hook-form";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import FormSection from "./FormSection";
import subDivisionsData from "@/utils/sub-divisions.json";
import statesCitiesData from "@/utils/states_cities.json";
import { cn } from "@/lib/utils";

const stateOptions = Object.keys(statesCitiesData)
  .sort()
  .map((state) => ({
    label: state,
    value: state,
  }));

function AddressBlock({
  title,
  prefix,
  action,
  disabled,
  t,
  allDemography,
  demographyLoading,
  isPermanent = false,
}) {
  const { watch, setValue } = useFormContext();
  const selectedState = watch(`${prefix}.state`);
  const selectedDistrictId = watch(`${prefix}.district`);

  // City options for correspondence address
  const cityOptions = React.useMemo(() => {
    if (!selectedState) return [];
    const cities = statesCitiesData[selectedState] || [];
    return cities.map((city) => ({
      label: city,
      value: city,
    }));
  }, [selectedState]);

  // Clear city, district, subdivision, thana, panchayat when state changes (for correspondence address)
  const prevStateRef = React.useRef(selectedState);
  React.useEffect(() => {
    if (
      !isPermanent &&
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
  }, [selectedState, setValue, prefix, isPermanent]);

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

  // Keep track of the last selected district to clear subdivision on change
  const prevDistrictRef = React.useRef(selectedDistrictId);
  React.useEffect(() => {
    if (
      prevDistrictRef.current !== undefined &&
      prevDistrictRef.current !== selectedDistrictId
    ) {
      setValue(`${prefix}.subdivision`, "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    prevDistrictRef.current = selectedDistrictId;
  }, [selectedDistrictId, setValue, prefix]);

  const isSubdivisionDisabled = !selectedDistrictId;
  const isBihar = isPermanent || selectedState === "Bihar";

  return (
    <FormSection title={title} action={action}>
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

        {!isPermanent && (
          <>
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
          </>
        )}

        <RhfSelect
          name={`${prefix}.district`}
          label={t("District", "ज़िला")}
          placeholder={t("Select District", "जिला चुनें")}
          options={allDemography}
          isLoading={demographyLoading}
          required={isBihar}
        />

        <RhfSelect
          name={`${prefix}.subdivision`}
          label={t("Block / Subdivision", "प्रखंड / अनुमंडल")}
          placeholder={t(
            "Select Block / Subdivision",
            "प्रखंड / अनुमंडल चुनें",
          )}
          options={subdivisionOptions}
          disabled={isSubdivisionDisabled}
          required={isBihar}
        />

        <RhfInput
          name={`${prefix}.panchayat`}
          label={t("Panchayat", "पंचायत")}
          placeholder={t("Panchayat name", "पंचायत का नाम")}
          required={isBihar}
          maxLength={50}
        />

        <RhfInput
          name={`${prefix}.thana`}
          label={t("Thana", "थाना")}
          placeholder={t("Police Station / Thana", "थाना का नाम")}
          required={isBihar}
          maxLength={50}
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
}

export default function AddressSection({
  t,
  allDemography,
  demographyLoading,
}) {
  const { watch, setValue, getValues } = useFormContext();
  const isCrpEqualPerAdd = watch("isCrpEqualPerAdd");
  const permanentAddress = watch("citizenInfo.address");
  const correspondenceState = watch("address.state");
  const isBihar = correspondenceState === "Bihar";

  const handleToggleSameAddress = (checked) => {
    setValue("isCrpEqualPerAdd", checked, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (checked) {
      const perm = getValues("citizenInfo.address");
      setValue("address.addressLine", perm?.addressLine || "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.state", "Bihar", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.district", perm?.district || "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.subdivision", perm?.subdivision || "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.panchayat", perm?.panchayat || "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("address.thana", perm?.thana || "", {
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
      setValue("address.addressLine", permanentAddress?.addressLine || "", {
        shouldValidate: true,
      });
      setValue("address.state", "Bihar", { shouldValidate: true });
      setValue("address.district", permanentAddress?.district || "", {
        shouldValidate: true,
      });
      setValue("address.subdivision", permanentAddress?.subdivision || "", {
        shouldValidate: true,
      });
      setValue("address.panchayat", permanentAddress?.panchayat || "", {
        shouldValidate: true,
      });
      setValue("address.thana", permanentAddress?.thana || "", {
        shouldValidate: true,
      });
      setValue("address.pincode", permanentAddress?.pincode || "", {
        shouldValidate: true,
      });
    }
  }, [isCrpEqualPerAdd, JSON.stringify(permanentAddress), setValue]);

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
      <AddressBlock
        title={t("Permanent Address", "स्थायी पता")}
        prefix="citizenInfo.address"
        t={t}
        allDemography={allDemography}
        demographyLoading={demographyLoading}
        isPermanent={true}
      />

      <AddressBlock
        title={t("Correspondence Address", "पत्राचार का पता")}
        prefix="address"
        action={sameAddressAction}
        disabled={!!isCrpEqualPerAdd}
        t={t}
        allDemography={allDemography}
        demographyLoading={demographyLoading}
        isPermanent={false}
      />
    </div>
  );
}
