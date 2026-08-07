import React from "react";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import RhfTextarea from "@/components/rhfinputs/RhfTextarea";
import RhfFileUpload from "@/components/rhfinputs/RhfFileUpload";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { usePostPreCall } from "../hooks";

export default function Form() {
  usePostPreCall();
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
            name="complainantName"
            label="Complainant Name"
            placeholder="Enter complainant name"
            required
          />
          <RhfInput
            name="complainantMobile"
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
            name="gender"
            label="Gender"
            placeholder="Select Gender"
            options={[
              { label: "MALE", value: "MALE" },
              { label: "FEMALE", value: "FEMALE" },
              { label: "TRANSGENDER", value: "TRANSGENDER" },
            ]}
          />
          <RhfSelect
            name="complainantType"
            label="Complainant Type"
            placeholder="Select Complainant Type"
            required
            options={[
              { label: "Citizen", value: "citizen" },
              { label: "Public Representative", value: "public_representative" },
              { label: "Government Employee", value: "government_employee" },
              { label: "Other", value: "other" },
            ]}
          />
        </div>

        {/* Grievance Type & Sub-Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RhfSelect
            name="grievanceType"
            label="Grievance Type"
            placeholder="Select Grievance Type"
            required
            options={[
              { label: "General", value: "general" },
              { label: "Service Related", value: "service_related" },
              { label: "Infrastructure", value: "infrastructure" },
              { label: "Staff Misbehavior", value: "staff_misbehavior" },
            ]}
          />
          <RhfSelect
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
          />
        </div>

        {/* District, Block, Village */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RhfSelect
            name="district"
            label="District"
            placeholder="Select District"
            required
            options={[
              { label: "Patna", value: "patna" },
              { label: "Gaya", value: "gaya" },
              { label: "Muzaffarpur", value: "muzaffarpur" },
              { label: "Purnia", value: "purnia" },
              { label: "Bhagalpur", value: "bhagalpur" },
              { label: "Araria", value: "araria" },
            ]}
          />
          <RhfSelect
            name="block"
            label="Block"
            placeholder="Select Block"
            required
            options={[
              { label: "Forbesganj", value: "forbesganj" },
              { label: "Araria", value: "araria" },
              { label: "Raniganj", value: "raniganj" },
              { label: "Sikti", value: "sikti" },
            ]}
          />
         
        </div>
         <RhfSelect
            name="village"
            label="Village"
            placeholder="Select Village"
            options={[
              { label: "Amauna", value: "amauna" },
              { label: "Rampur", value: "rampur" },
              { label: "Phulwaria", value: "phulwaria" },
            ]}
          />

        {/* Institution Type & Institution Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RhfSelect
            name="institutionType"
            label="Institution Type"
            placeholder="Select Institution Type"
            required
            options={[
              { label: "Primary Health Centre (PHC)", value: "phc" },
              { label: "Community Health Centre (CHC)", value: "chc" },
              { label: "District Hospital", value: "district_hospital" },
              { label: "Sub Divisional Hospital", value: "sdh" },
            ]}
          />
          <RhfSelect
            name="institutionName"
            label="Institution Name"
            placeholder="Select Institution Name"
            options={[
              { label: "PHC Forbesganj", value: "phc_forbesganj" },
              { label: "CHC Araria", value: "chc_araria" },
              { label: "Sadar Hospital", value: "sadar_hospital" },
            ]}
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
          name="briefOfGrievance"
          label="Brief of Grievance"
          placeholder="Enter brief description of grievance..."
          required
          rows={4}
        />

        {/* Upload Related Document */}
        <RhfFileUpload
          name="uploadRelatedDocument"
          label="Upload Related Document"
          accept="image/*,application/pdf"
          MAX_SIZE={10}
        />
      </div>

      <div className="flex justify-center pt-4 border-t border-border">
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Send className="w-4 h-4 mr-2" />
          Submit Grievance
        </Button>
      </div>
    </div>
  );
}