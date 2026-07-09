import React from "react";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { Button } from "@/components/ui/button";

export default function Form({ isEdit, isLoading, userOptions = [], subservicesOptions = [], onCancel }) {
  return (
    <div className="space-y-4">
      <RhfSelect
        name="officer"
        label="Select Officer"
        required
        options={userOptions}
        placeholder="Select an officer"
        disabled={isEdit}
      />
      <RhfSelect
        name="services"
        label="Sub-services"
        required
        isMultiple={true}
        options={subservicesOptions}
        placeholder="Select sub-services"
      />
      <RhfInput
        name="wards"
        label="Wards (comma-separated)"
        required
        placeholder="e.g. Patna Ward-12, Patna Ward-13"
      />
      <div className="flex justify-end gap-2 py-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
