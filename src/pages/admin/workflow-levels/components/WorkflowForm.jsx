import React from "react";
import RhfWrapper from "@/components/RhfWrapper";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { workflowSchema } from "../schema";
import { useLanguage } from "@/context/LanguageContext";

const WorkflowForm = ({
  editLevel,
  roleOptions = [],
  initialValues,
  handleSubmit,
  onClose,
  isPending,
}) => {
  const { t } = useLanguage();
  return (
    <div
      className="bg-card rounded-2xl shadow-2xl w-full max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <h3 className="font-bold text-foreground">
          {editLevel ? t("Edit Level", "स्तर संपादित करें") : t("Add Workflow Level", "कार्यप्रवाह स्तर जोड़ें")}
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
          label={t("Designation", "पदनाम")}
          placeholder={t("Select designation...", "पदनाम चुनें...")}
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
            <Check className="w-4 h-4 mr-1" /> {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </RhfWrapper>
    </div>
  );
};

export default WorkflowForm;