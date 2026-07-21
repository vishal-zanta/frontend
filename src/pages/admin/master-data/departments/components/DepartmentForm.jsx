import React from "react";
import RhfWrapper from "@/components/RhfWrapper";
import RhfInput from "@/components/rhfinputs/RhfInput";
import { departmentSchema } from "../schema";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const DepartmentForm = ({ initialValues, handleSubmit, onClose, saving }) => {
  return (
    <RhfWrapper
      initialValues={initialValues}
      isValidation
      validationSchema={departmentSchema}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <RhfInput
        name="title"
        label="Department Title (English)"
        placeholder="e.g., Forest Dept"
        required
      />

      <RhfInput
        name="titleHindi"
        label="विभाग का नाम (Hindi)"
        placeholder="उदा. वन विभाग"
        required
      />

      <div className="flex gap-2 justify-end pt-4 border-t border-border pb-4">
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

export default DepartmentForm;
