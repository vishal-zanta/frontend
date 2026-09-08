import React from "react";
import RhfTextarea from "@/components/rhfinputs/RhfTextarea";
import FormSection from "./FormSection";

export default function EvidenceSection({ t }) {
  return (
    <FormSection title={t("Evidence & Details", "साक्ष्य और विवरण")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RhfTextarea
          name="evidence.details"
          label={t("Brief Description", "संक्षिप्त विवरण")}
          placeholder={t(
            "Describe the issue in detail...",
            "समस्या का विस्तार से वर्णन करें...",
          )}
          rows={4}
          className="md:col-span-2"
        />
      </div>
    </FormSection>
  );
}
