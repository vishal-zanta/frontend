import React, { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import FormWrappers from "../../FormWrappers";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import RhfTextarea from "@/components/rhfinputs/RhfTextarea";
import RhfBoolean from "@/components/rhfinputs/RhfBoolean";
import { FileText, User, MapPin, UserX } from "lucide-react";
import {
  useGetBlockOptions,
  useGetPanchayatOptions,
  useGetVillageOptions,
  useGetSchoolOptions,
} from "../hooks";

const Form = ({ fields, isLoading }) => {
  return (
    <FormWrappers
      heading="Education Department - Raise Grievance"
      isLoading={isLoading}
    >
      <div className="px-4 space-y-6">
        {/* Section 1: Complaint & Classification Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <FileText className="w-4 h-4 text-primary" />
            <span>Complaint Information</span>
          </div>

          <RhfSelect
            name="type"
            label="Type"
            placeholder="Select Type"
            options={fields?.type || []}
            required

          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfSelect
              name="categoryId"
              label="Category"
              placeholder="Select Category"
              options={fields?.categoryId || []}
              required
            />
            <RhfInput
              name="categoryOther"
              label="Category (Other)"
              placeholder="Enter category details if other"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfSelect
              name="source"
              label="Source"
              placeholder="Select Source"
              options={fields?.source || []}
            />
            <RhfInput
              name="registeredAt"
              label="Registered At"
              type="date"
              isDisableFutureDates
            />
          </div>

          <RhfTextarea
            name="complaint"
            label="Complaint Description"
            placeholder="Enter detailed description of the complaint..."
            rows={4}
            required
          />
        </div>

        {/* Section 2: Complainant Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <User className="w-4 h-4 text-primary" />
            <span>Complainant Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfInput
              name="complainant.name"
              label="Complainant Name"
              placeholder="Enter complainant name"
              required
            />
            <RhfInput
              name="complainant.mobile"
              label="Complainant Mobile Number"
              placeholder="Enter 10-digit mobile number"
              isNumsOnly={true}
              maxLength={10}
              required
            />
          </div>

          <RhfBoolean
            name="complainant.shareNumberWithOfficer"
            label="Share Mobile Number with Officer"
            description="Allow the investigating officer to view the complainant's contact number."
          />
        </div>

        {/* Section 3: Location Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Location Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <RhfSelect
              name="location.districtCode"
              label="District"
              placeholder="Select District"
              options={fields?.districtCode || fields?.district || []}
              required
            />
            <BlockCode />
            <RhfSelect
              name="location.clusterCode"
              label="Cluster"
              placeholder="Select Cluster"
              options={fields?.clusterCode || fields?.cluster || []}
            />
            <PanchayatCode />
            <VillageCode />
            <SchoolCode />
             <RhfSelect
              name="location.teacherCode"
              label="Teacher"
              placeholder="Select Teacher"
              options={fields?.teacherCode || fields?.teacher || []}
            />
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           
          </div> */}
        </div>

        {/* Section 4: Accused Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <UserX className="w-4 h-4 text-primary" />
            <span>Accused Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfInput
              name="accused.name"
              label="Accused Person Name"
              placeholder="Enter accused person's name"
            />
            <RhfInput
              name="accused.designation"
              label="Accused Person Designation"
              placeholder="Enter designation (e.g., Principal, Headmaster, Teacher)"
            />
          </div>
        </div>
      </div>
    </FormWrappers>
  );
};

const BlockCode = () => {
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
      label="Block"
      placeholder={!districtCode ? "Select District First" : "Select Block"}
      options={blockOptions}
      disabled={!districtCode}
      isLoading={isLoading}
    />
  );
};

const PanchayatCode = () => {
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
      label="Panchayat"
      placeholder={!blockCode ? "Select Block First" : "Select Panchayat"}
      options={panchayatOptions}
      disabled={!blockCode}
      isLoading={isLoading}
    />
  );
};

const VillageCode = () => {
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
      label="Village"
      placeholder={!blockCode ? "Select Block First" : "Select Village"}
      options={villageOptions}
      disabled={!blockCode}
      isLoading={isLoading}
    />
  );
};

const SchoolCode = () => {
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
      label="School"
      placeholder={!blockCode ? "Select Block First" : "Select School"}
      options={schoolOptions}
      disabled={!blockCode}
      isLoading={isLoading}
    />
  );
};

export default Form;
