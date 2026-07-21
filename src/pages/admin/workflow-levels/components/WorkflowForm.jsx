import React from "react";
import RhfWrapper from "@/components/RhfWrapper";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { workflowSchema } from "../schema";

const WorkflowForm = ({
  editLevel,
  roleOptions = [],
  initialValues,
  handleSubmit,
  onClose,
  isPending,
}) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <h3 className="font-bold text-foreground">
          {editLevel ? "Edit Level" : "Add Workflow Level"}
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-muted rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <RhfWrapper
        initialValues={initialValues}
        isValidation
        validationSchema={workflowSchema}
        onSubmit={handleSubmit}
        className="p-5 space-y-4"
      >
        <RhfSelect
          name="role"
          label="Role"
          placeholder="Select role..."
          options={roleOptions}
          required
          isMultiple={false}
          disabled={!!editLevel}
        />

        <RhfInput
          name="description"
          label="Description"
          placeholder="Description..."
        />

        <div className="pt-4 border-t border-border flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            disabled={isPending}
          >
            <Check className="w-4 h-4 mr-1" /> Save
          </Button>
        </div>
      </RhfWrapper>
    </div>
  );
};

export default WorkflowForm;