import React, { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import FormWrappers from "../../FormWrappers";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import RhfTextarea from "@/components/rhfinputs/RhfTextarea";
import RhfBoolean from "@/components/rhfinputs/RhfBoolean";
import { FileText, User, MapPin, UserX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  useGetBlockOptions,
  useGetPanchayatOptions,
  useGetVillageOptions,
  useGetSchoolOptions,
} from "../hooks";

const Form = ({ fields, isLoading }) => {
  const { t } = useLanguage();

  return (
    <FormWrappers
      heading={t("Education Department - Raise Grievance", "शिक्षा विभाग - शिकायत दर्ज करें")}
      isLoading={isLoading}
    >
      <div className="px-4 space-y-6">
        {/* Section 1: Complainant Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <User className="w-4 h-4 text-primary" />
            <span>{t("Complainant Details", "शिकायतकर्ता का विवरण")}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfInput
              name="complainant.name"
              label={t("Complainant Name", "शिकायतकर्ता का नाम")}
              placeholder={t("Enter complainant name", "शिकायतकर्ता का नाम दर्ज करें")}
              required
            />
            <RhfInput
              name="complainant.mobile"
              label={t("Complainant Mobile Number", "शिकायतकर्ता का मोबाइल नंबर")}
              placeholder={t("Enter 10-digit mobile number", "10 अंकों का मोबाइल नंबर दर्ज करें")}
              isNumsOnly={true}
              maxLength={10}
              required
            />
          </div>

          <RhfBoolean
            name="complainant.shareNumberWithOfficer"
            label={t("Share Mobile Number with Officer", "अधिकारी के साथ मोबाइल नंबर साझा करें")}
            description={t(
              "Allow the investigating officer to view the complainant's contact number.",
              "जांच अधिकारी को शिकायतकर्ता का संपर्क नंबर देखने की अनुमति दें।",
            )}
          />
        </div>

        {/* Section 2: Complaint & Classification Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <FileText className="w-4 h-4 text-primary" />
            <span>{t("Complaint Information", "शिकायत की जानकारी")}</span>
          </div>

          <RhfSelect
            name="type"
            label={t("Type", "प्रकार")}
            placeholder={t("Select Type", "प्रकार चुनें")}
            options={fields?.type || []}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfSelect
              name="categoryId"
              label={t("Category", "श्रेणी")}
              placeholder={t("Select Category", "श्रेणी चुनें")}
              options={fields?.categoryId || []}
              required
            />
            <RhfInput
              name="categoryOther"
              label={t("Category (Other)", "श्रेणी (अन्य)")}
              placeholder={t("Enter category details if other", "यदि अन्य है तो श्रेणी का विवरण दर्ज करें")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfSelect
              name="source"
              label={t("Source", "स्रोत")}
              placeholder={t("Select Source", "स्रोत चुनें")}
              options={fields?.source || []}
            />
            <RhfInput
              name="registeredAt"
              label={t("Registered At", "पंजीकरण की तिथि")}
              type="date"
              isDisableFutureDates
            />
          </div>

          <RhfTextarea
            name="complaint"
            label={t("Complaint Description", "शिकायत का विवरण")}
            placeholder={t("Enter detailed description of the complaint...", "शिकायत का विस्तृत विवरण दर्ज करें...")}
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
            <RhfSelect
              name="location.districtCode"
              label={t("District", "जिला")}
              placeholder={t("Select District", "जिला चुनें")}
              options={fields?.districtCode || fields?.district || []}
              required
            />
            <BlockCode />
            <RhfSelect
              name="location.clusterCode"
              label={t("Cluster", "क्लस्टर")}
              placeholder={t("Select Cluster", "क्लस्टर चुनें")}
              options={fields?.clusterCode || fields?.cluster || []}
            />
            <PanchayatCode />
            <VillageCode />
            <SchoolCode />
            <RhfSelect
              name="location.teacherCode"
              label={t("Teacher", "शिक्षक")}
              placeholder={t("Select Teacher", "शिक्षक चुनें")}
              options={fields?.teacherCode || fields?.teacher || []}
            />
          </div>
        </div>

        {/* Section 4: Accused Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <UserX className="w-4 h-4 text-primary" />
            <span>{t("Accused Details", "आरोपी का विवरण")}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfInput
              name="accused.name"
              label={t("Accused Person Name", "आरोपी व्यक्ति का नाम")}
              placeholder={t("Enter accused person's name", "आरोपी व्यक्ति का नाम दर्ज करें")}
            />
            <RhfInput
              name="accused.designation"
              label={t("Accused Person Designation", "आरोपी व्यक्ति का पद")}
              placeholder={t("Enter designation (e.g., Principal, Headmaster, Teacher)", "पद दर्ज करें (उदा. प्रधानाचार्य, प्रधानाध्यापक, शिक्षक)")}
            />
          </div>
        </div>
      </div>
    </FormWrappers>
  );
};

const BlockCode = () => {
  const { t } = useLanguage();
  const { resetField } = useFormContext();
  const districtCode = useWatch({ name: "location.districtCode" });
  const isFirstRender = useRef(true);

  const { blockOptions, isLoading } = useGetBlockOptions(districtCode);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    resetField("location.blockCode", { defaultValue: "" });
  }, [districtCode, resetField]);

  return (
    <RhfSelect
      name="location.blockCode"
      label={t("Block", "प्रखंड")}
      placeholder={
        !districtCode
          ? t("Select District First", "पहले जिला चुनें")
          : t("Select Block", "प्रखंड चुनें")
      }
      options={blockOptions}
      disabled={!districtCode}
      isLoading={isLoading}
    />
  );
};

const PanchayatCode = () => {
  const { t } = useLanguage();
  const { resetField } = useFormContext();
  const blockCode = useWatch({ name: "location.blockCode" });
  const isFirstRender = useRef(true);

  const { panchayatOptions, isLoading } = useGetPanchayatOptions(blockCode);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    resetField("location.panchayatCode", { defaultValue: "" });
  }, [blockCode, resetField]);

  return (
    <RhfSelect
      name="location.panchayatCode"
      label={t("Panchayat", "पंचायत")}
      placeholder={
        !blockCode
          ? t("Select Block First", "पहले प्रखंड चुनें")
          : t("Select Panchayat", "पंचायत चुनें")
      }
      options={panchayatOptions}
      disabled={!blockCode}
      isLoading={isLoading}
    />
  );
};

const VillageCode = () => {
  const { t } = useLanguage();
  const { resetField } = useFormContext();
  const blockCode = useWatch({ name: "location.blockCode" });
  const isFirstRender = useRef(true);

  const { villageOptions, isLoading } = useGetVillageOptions(blockCode);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    resetField("location.villageCode", { defaultValue: "" });
  }, [blockCode, resetField]);

  return (
    <RhfSelect
      name="location.villageCode"
      label={t("Village", "गाँव")}
      placeholder={
        !blockCode
          ? t("Select Block First", "पहले प्रखंड चुनें")
          : t("Select Village", "गाँव चुनें")
      }
      options={villageOptions}
      disabled={!blockCode}
      isLoading={isLoading}
    />
  );
};

const SchoolCode = () => {
  const { t } = useLanguage();
  const { resetField } = useFormContext();
  const blockCode = useWatch({ name: "location.blockCode" });
  const isFirstRender = useRef(true);

  const { schoolOptions, isLoading } = useGetSchoolOptions(blockCode);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    resetField("location.schoolCode", { defaultValue: "" });
  }, [blockCode, resetField]);

  return (
    <RhfSelect
      name="location.schoolCode"
      label={t("School", "विद्यालय")}
      placeholder={
        !blockCode
          ? t("Select Block First", "पहले प्रखंड चुनें")
          : t("Select School", "विद्यालय चुनें")
      }
      options={schoolOptions}
      disabled={!blockCode}
      isLoading={isLoading}
    />
  );
};

export default Form;
