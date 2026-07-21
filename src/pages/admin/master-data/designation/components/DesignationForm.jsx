import React from "react";
import RhfWrapper from "@/components/RhfWrapper";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { apiPermissionOptions } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { designationSchema } from "../schema";

const DesignationForm = ({
  initialValues,
  handleSubmit,
  onClose,
  saving,
  departmentOptions = [],
}) => {
  const levelOptions = [
    "L1",
    "L2",
    "Zone",
    "ULB",
    "Division",
    "SUDA",
    "CCE",
    "Supervisor",
    "Admin",
  ].map((l) => ({ label: l, value: l }));

  return (
    <RhfWrapper
      initialValues={initialValues}
      isValidation
      validationSchema={designationSchema}
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[55svh]"
    >
      <RhfInput
        name="designationEnglish"
        label="Designation (English)"
        placeholder="e.g., Municipal Commissioner"
        required
      />

      <RhfInput
        name="designationHindi"
        label="पदनाम (Hindi)"
        placeholder="उदा. नगर आयुक्त"
        required
      />

      <RhfSelect
        name="level"
        label="Level"
        placeholder="Select level..."
        options={levelOptions}
        required
        isMultiple={false}
      />

      <RhfSelect
        name="permissions"
        label="Permissions"
        placeholder="Select permissions..."
        options={apiPermissionOptions}
        required
        isMultiple={true}
      />

      <RhfSelect
        name="department"
        label="Department"
        placeholder="Select department..."
        options={departmentOptions}
        required
        isMultiple={false}
      />


      <div className="flex gap-2 justify-end pt-4 border-t border-border pb-4 bg-white sticky bottom-0">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90">
          <Check className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </RhfWrapper>
  );
};

export default DesignationForm;