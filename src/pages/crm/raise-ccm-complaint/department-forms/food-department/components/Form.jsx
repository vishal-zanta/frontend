import React, { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import FormWrappers from "../../FormWrappers";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import RhfTextarea from "@/components/rhfinputs/RhfTextarea";
import { FileText, User, MapPin } from "lucide-react";
import {
  useGetFoodDistrictOptions,
  useGetFoodBlockOptions,
  useGetFoodPanchayatOptions,
  useGetFoodVillageOptions,
} from "../hooks";

const Form = ({ options, isLoading }) => {
  return (
    <FormWrappers
      heading="Food & Consumer Protection Department - Raise Grievance"
      isLoading={isLoading}
    >
      <div className="px-4 space-y-6">
        {/* Section 1: Citizen / Complainant Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <User className="w-4 h-4 text-primary" />
            <span>Citizen Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfInput
              name="name"
              label="Citizen Name"
              placeholder="Enter citizen name"
              required
            />
            <RhfInput
              name="mobileNo"
              label="Mobile Number"
              placeholder="Enter 10-digit mobile number"
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
            <span>Grievance Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfSelect
              name="typeId"
              label="Grievance Type"
              placeholder="Select Type"
              options={options?.type || []}
              required
            />
            <RhfSelect
              name="categoryId"
              label="Category"
              placeholder="Select Category"
              options={options?.category || []}
              required
            />
          </div>

          <RhfTextarea
            name="grievancesDescription"
            label="Grievance Description"
            placeholder="Enter detailed description of the grievance..."
            rows={4}
            required
          />
        </div>

        {/* Section 3: Location Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Location Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <RhfInput
                name="address"
                label="Detailed Address"
                placeholder="Enter complete address"
                required
              />
            </div>
            <RhfSelect
              name="stateId"
              label="State"
              placeholder="Select State"
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
      label="District"
      placeholder={!stateId ? "Select State First" : "Select District"}
      options={districtOptions}
      disabled={!stateId}
      isLoading={isLoading}
      required
    />
  );
};

const BlockSelect = () => {
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
      label="Block"
      placeholder={!districtId ? "Select District First" : "Select Block"}
      options={blockOptions}
      disabled={!districtId}
      isLoading={isLoading}
      required
    />
  );
};

const PanchayatSelect = () => {
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
      label="Panchayat"
      placeholder={!blockId ? "Select Block First" : "Select Panchayat"}
      options={panchayatOptions}
      disabled={!blockId}
      isLoading={isLoading}
      required
    />
  );
};

const VillageSelect = () => {
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
      label="Village"
      placeholder={!panchayatId ? "Select Panchayat First" : "Select Village"}
      options={villageOptions}
      disabled={!panchayatId}
      isLoading={isLoading}
    />
  );
};

export default Form;
