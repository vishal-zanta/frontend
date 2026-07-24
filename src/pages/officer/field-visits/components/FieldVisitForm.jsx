import React from "react";
import { useFormContext } from "react-hook-form";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfTextarea from "@/components/rhfinputs/RhfTextarea";
import { FIELD_VISIT_STATUS } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function FieldVisitForm({ onCancel, isLoading, fieldVisit }) {
  const { watch } = useFormContext();
  const status = watch("status");
  // console.log({fieldVisit});
  const isDisabled =  ["RESOLVED", "CLOSED"].includes(fieldVisit?.grievance?.status || "");


  return (
    <div className="space-y-4">
      <RhfSelect
        name="status"
        label="Status"
        required
        options={FIELD_VISIT_STATUS}
        disabled={isDisabled}
        placeholder="Select status..."
      />
      {status !== "CANCELLED" && (
        <RhfInput
          name="schedule"
          label="Schedule Date"
          type="date"
          required
          disabled={isDisabled}
          isDisablePastDates
        />
      )}
      {status === "COMPLETED" && (
        <RhfTextarea
          name="remarks"
          label="Remarks"
          required
          placeholder="Enter completion remarks..."
        />
      )}

      <div className="pt-4  flex gap-2 justify-end pb-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
          <Check className="w-4 h-4 mr-1" /> {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
