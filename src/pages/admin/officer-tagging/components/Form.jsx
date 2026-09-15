import React from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { useLanguage } from "@/context/LanguageContext";
import OfficerTaggingFormFields from "./OfficerTaggingFormFields";

export default function Form({
  isEdit,
  isLoading,
  userOptions = [],
  department,
  onCancel,
}) {
  const {
    formState: { errors },
  } = useFormContext();
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <OfficerTaggingFormFields
        isEdit={isEdit}
        userOptions={userOptions}
        department={department}
        gridClassName="space-y-4"
      />

      <div className="py-4 sticky bottom-0 bg-card flex justify-between">
        <div className="flex items-center">
          {Object.keys(errors).length > 0 && (
            <span className="text-destructive text-xs font-semibold animate-pulse">
              {t(
                "* Please fix form errors first",
                "* कृपया पहले फॉर्म की त्रुटियों को सुधारें",
              )}
            </span>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t("Cancel", "रद्द करें")}
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading
              ? t("Saving...", "सहेजा जा रहा है...")
              : t("Save", "सहेजें")}
          </Button>
        </div>
      </div>
    </div>
  );
}

