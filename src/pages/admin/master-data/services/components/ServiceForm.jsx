import React from "react";
import RhfWrapper from "@/components/RhfWrapper";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { serviceSchema } from "../schema";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const ServiceForm = ({
  initialValues,
  handleSubmit,
  onClose,
  saving,
  departmentOptions = [],
}) => {
  return (
    <RhfWrapper
      initialValues={initialValues}
      isValidation
      validationSchema={serviceSchema}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <RhfInput
        name="title"
        label="Service Name (English)"
        placeholder="e.g., Public Works"
        required
      />

      <RhfInput
        name="titleHindi"
        label="सेवा का नाम (Hindi)"
        placeholder="उदा. सार्वजनिक कार्य"
        required
      />

      <RhfSelect
        name="department"
        label="Department"
        placeholder="Select department..."
        options={departmentOptions}
        required
        isMultiple={false}
      />

      <div className="flex gap-2 justify-end pt-4 border-t border-border pb-4 bg-card sticky bottom-0">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="bg-primary hover:bg-primary/90"
        >
          <Check className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </RhfWrapper>
  );
};

export default ServiceForm;
