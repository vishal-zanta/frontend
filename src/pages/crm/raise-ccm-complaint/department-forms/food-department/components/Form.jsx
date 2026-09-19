import React, { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import FormWrappers from "../../FormWrappers";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import RhfTextarea from "@/components/rhfinputs/RhfTextarea";
import { FileText, User, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  useGetFoodDistrictOptions,
  useGetFoodBlockOptions,
  useGetFoodPanchayatOptions,
  useGetFoodVillageOptions,
} from "../hooks";

const Form = ({ options, isLoading }) => {
  const { t } = useLanguage();

  return (
    <FormWrappers
      heading={t(
        "Food & Consumer Protection Department - Raise Grievance",
        "खाद्य एवं उपभोक्ता संरक्षण विभाग - शिकायत दर्ज करें",
      )}
      isLoading={isLoading}
    >
      <div className="px-4 space-y-6">
        {/* Section 1: Citizen / Complainant Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <User className="w-4 h-4 text-primary" />
            <span>{t("Citizen Details", "नागरिक का विवरण")}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfInput
              name="name"
              label={t("Citizen Name", "नागरिक का नाम")}
              placeholder={t("Enter citizen name", "नागरिक का नाम दर्ज करें")}
              required
            />
            <RhfInput
              name="mobileNo"
              label={t("Mobile Number", "मोबाइल नंबर")}
              placeholder={t("Enter 10-digit mobile number", "10 अंकों का मोबाइल नंबर दर्ज करें")}
              isNumsOnly={true}
              maxLength={10}
              required
            />
          </div>
        </div>

        {/* Section 2: Grievance Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <FileText className="w-4 h-4 text-primary" />
            <span>{t("Grievance Information", "शिकायत की जानकारी")}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfSelect
              name="typeId"
              label={t("Grievance Type", "शिकायत का प्रकार")}
              placeholder={t("Select Type", "प्रकार चुनें")}
              options={options?.type || []}
              required
            />
            <RhfSelect
              name="categoryId"
              label={t("Category", "श्रेणी")}
              placeholder={t("Select Category", "श्रेणी चुनें")}
              options={options?.category || []}
              required
            />
          </div>

          <RhfTextarea
            name="grievancesDescription"
            label={t("Grievance Description", "शिकायत का विवरण")}
            placeholder={t("Enter detailed description of the grievance...", "शिकायत का विस्तृत विवरण दर्ज करें...")}
            rows={4}
            required
          />
        </div>

        {/* Section 3: Location Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{t("Location Details", "स्थान का विवरण")}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <RhfInput
                name="address"
                label={t("Detailed Address", "विस्तृत पता")}
                placeholder={t("Enter complete address", "पूरा पता दर्ज करें")}
                required
              />
            </div>
            <RhfSelect
              name="stateId"
              label={t("State", "राज्य")}
              placeholder={t("Select State", "राज्य चुनें")}
              options={options?.state || []}
              disabled
            />
            <DistrictSelect />
            <BlockSelect />
            <PanchayatSelect />
            <VillageSelect />
          </div>
        </div>
      </div>
    </FormWrappers>
  );
};

const DistrictSelect = () => {
  const { t } = useLanguage();
  const { resetField } = useFormContext();
  const stateId = useWatch({ name: "stateId" }) || 10;
  const isFirstRender = useRef(true);

  const { districtOptions, isLoading } = useGetFoodDistrictOptions(stateId);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    resetField("districtId", { defaultValue: "" });
    resetField("blockId", { defaultValue: "" });
    resetField("panchayatId", { defaultValue: "" });
    resetField("villageId", { defaultValue: "" });
  }, [stateId, resetField]);

  return (
    <RhfSelect
      name="districtId"
      label={t("District", "जिला")}
      placeholder={
        !stateId
          ? t("Select State First", "पहले राज्य चुनें")
          : t("Select District", "जिला चुनें")
      }
      options={districtOptions}
      disabled={!stateId}
      isLoading={isLoading}
      required
    />
  );
};

const BlockSelect = () => {
  const { t } = useLanguage();
  const { resetField } = useFormContext();
  const districtId = useWatch({ name: "districtId" });
  const isFirstRender = useRef(true);

  const { blockOptions, isLoading } = useGetFoodBlockOptions(districtId);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    resetField("blockId", { defaultValue: "" });
    resetField("panchayatId", { defaultValue: "" });
    resetField("villageId", { defaultValue: "" });
  }, [districtId, resetField]);

  return (
    <RhfSelect
      name="blockId"
      label={t("Block", "प्रखंड")}
      placeholder={
        !districtId
          ? t("Select District First", "पहले जिला चुनें")
          : t("Select Block", "प्रखंड चुनें")
      }
      options={blockOptions}
      disabled={!districtId}
      isLoading={isLoading}
      required
    />
  );
};

const PanchayatSelect = () => {
  const { t } = useLanguage();
  const { resetField } = useFormContext();
  const blockId = useWatch({ name: "blockId" });
  const isFirstRender = useRef(true);

  const { panchayatOptions, isLoading } = useGetFoodPanchayatOptions(blockId);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    resetField("panchayatId", { defaultValue: "" });
    resetField("villageId", { defaultValue: "" });
  }, [blockId, resetField]);

  return (
    <RhfSelect
      name="panchayatId"
      label={t("Panchayat", "पंचायत")}
      placeholder={
        !blockId
          ? t("Select Block First", "पहले प्रखंड चुनें")
          : t("Select Panchayat", "पंचायत चुनें")
      }
      options={panchayatOptions}
      disabled={!blockId}
      isLoading={isLoading}
      required
    />
  );
};

const VillageSelect = () => {
  const { t } = useLanguage();
  const { resetField } = useFormContext();
  const panchayatId = useWatch({ name: "panchayatId" });
  const isFirstRender = useRef(true);

  const { villageOptions, isLoading } = useGetFoodVillageOptions(panchayatId);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    resetField("villageId", { defaultValue: "" });
  }, [panchayatId, resetField]);

  return (
    <RhfSelect
      name="villageId"
      label={t("Village", "गाँव")}
      placeholder={
        !panchayatId
          ? t("Select Panchayat First", "पहले पंचायत चुनें")
          : t("Select Village", "गाँव चुनें")
      }
      options={villageOptions}
      disabled={!panchayatId}
      isLoading={isLoading}
    />
  );
};

export default Form;
