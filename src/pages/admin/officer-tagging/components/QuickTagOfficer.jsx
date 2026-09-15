import React, { useState } from "react";
import { UserCog, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import RhfWrapper from "@/components/RhfWrapper";
import { officerTaggingSchema, defaultOfficerTaggingValues } from "../schema";
import OfficerTaggingFormFields from "./OfficerTaggingFormFields";

export default function QuickTagOfficer({
  officers = [],
  handleSaveTagging,
  isLoading,
  department,
}) {
  const { t } = useLanguage();
  const [resetKey, setResetKey] = useState(0);

  const handleSubmit = (formData, methods) => {
    handleSaveTagging(formData);
    methods.reset(defaultOfficerTaggingValues);
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <UserCog className="w-5 h-5 text-blue-500" />{" "}
        {t("Quick Tag Officer", "त्वरित अधिकारी मैपिंग")}
      </h3>

      <RhfWrapper
        key={`${department}_${resetKey}`}
        isValidation={true}
        validationSchema={officerTaggingSchema}
        initialValues={defaultOfficerTaggingValues}
        onSubmit={handleSubmit}
      >
        <OfficerTaggingFormFields
          userOptions={officers}
          department={department}
          gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        />

        <Button
          type="submit"
          className="mt-4 bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          <Save className="w-4 h-4 mr-1" />{" "}
          {isLoading
            ? t("Saving...", "सहेजा जा रहा है...")
            : t("Save Tagging", "मैपिंग सहेजें")}
        </Button>
      </RhfWrapper>
    </div>
  );
}

