import React, { useEffect } from "react";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import RhfTextarea from "@/components/rhfinputs/RhfTextarea";
import RhfFileUpload from "@/components/rhfinputs/RhfFileUpload";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { usePostPreCall } from "../hooks";

export default function Form({ fields , isLoading}) {
  // console.log({ fields });
  return (
    <div className="bg-card border border-border rounded-xl px-0 sm:px-0 p-4 sm:p-6 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-foreground border-b border-border pb-3 px-4">
        Raise New Grievance
      </h2>

      <div className="space-y-4 px-4">
        {/* Date & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RhfInput
            name="dateOfIncident"
            label="Date of Incident"
            type="date"
            required
          />
          <RhfInput
            name="locationOfIncident"
            label="Location of Incident"
            placeholder="Enter location of incident"
          />
        </div>

        {/* Complainant Name & Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RhfInput
            name="citizen.name"
            label="Complainant Name"
            placeholder="Enter complainant name"
            required
          />
          <RhfInput
            name="citizen.mobileNumber"
            label="Complainant Mobile Number"
            placeholder="Enter 10-digit mobile number"
            required
            isNumsOnly={true}
            maxLength={10}
          />
        </div>

        {/* Gender & Complainant Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RhfSelect
            name="citizen.gender"
            label="Gender"
            placeholder="Select Gender"
            options={fields?.gender || []}
          />
          <RhfSelect
            name="complainantType"
            label="Complainant Type"
            placeholder="Select Complainant Type"
            required
            options={fields?.complainantType || []}
          />
        </div>

        {/* Grievance Type & Sub-Type */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <RhfSelect
            name="grievanceType"
            label="Grievance Type"
            placeholder="Select Grievance Type"
            required
            options={fields?.grievanceType || []}
          />
          {/* <RhfSelect
            name="grievanceSubType"
            label="Grievance Sub-Type"
            placeholder="Select Grievance Sub-Type"
            required
            options={[
              { label: "Delay in Service", value: "delay_in_service" },
              { label: "Denial of Service", value: "denial_of_service" },
              { label: "Quality Issue", value: "quality_issue" },
              { label: "Others", value: "others" },
            ]}
          /> */}
        </div>

        {/* District, Block, Village */}
        <DistrictPart fields={fields} />

        {/* Institution Type & Institution Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RhfSelect
            name="institutionType"
            label="Institution Type"
            placeholder="Select Institution Type"
            required
            options={fields?.institutionType || []}
          />
          <RhfSelect
            name="institutionName"
            label="Institution Name"
            placeholder="Select Institution Name"
            options={fields?.institutionName || []}
          />
        </div>

        {/* Grievance Against Whom */}
        <RhfInput
          name="grievanceAgainstWhom"
          label="Grievance Against Whom"
          placeholder="Enter person / department / authority name"
        />

        {/* Brief of Grievance */}
        <RhfTextarea
          name="description"
          label="Brief of Grievance"
          placeholder="Enter brief description of grievance..."
          required
          rows={4}
        />

        {/* Upload Related Document */}
        {/* <RhfFileUpload
          name="uploadRelatedDocument"
          label="Upload Related Document"
          accept="image/*,application/pdf"
          MAX_SIZE={10}
        /> */}
      </div>

      <div className="flex justify-center pt-4 border-t border-border">
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
          Submit Grievance
        </Button>
      </div>
    </div>
  );
}

const DistrictPart = ({ fields }) => {
  const { watch, setValue, control } = useFormContext();
  const districtValue = useWatch({ name: "address.district", control });
  const blockValue = useWatch({ name: "address.block", control });

  useEffect(() => {
    setValue("address.block", "");
    setValue("address.village", "");
  }, [districtValue]);
  useEffect(() => {
    setValue("address.village", "");
  }, [blockValue]);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RhfSelect
          name="address.district"
          label="District"
          placeholder="Select District"
          required
          options={fields?.district || []}
        />
        <RhfSelect
          name="address.block"
          label="Block"
          placeholder="Select Block"
          required
          options={(fields?.block || []).filter(
            (o) => o.district === districtValue,
          )}
          disabled={!districtValue}
        />
      </div>
      <RhfSelect
        name="address.village"
        label="Village"
        placeholder="Select Village"
        options={(fields?.village || []).filter((o) => o.block === blockValue)}
        disabled={!blockValue || !districtValue}
      />
    </>
  );
};
