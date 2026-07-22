import React from "react";
import RhfBoolean from "@/components/rhfinputs/RhfBoolean";
import FormSection from "./FormSection";

export default function CommunicationSection({ t }) {
  return (
    <FormSection title={t("Communication Preferences", "संचार प्राथमिकताएँ")}>
      <div className="grid grid-cols-1 gap-3 bg-muted/30 rounded-lg p-4 border border-border mt-2">
        <RhfBoolean
          name="communication.feedbackConsent"
          label={t(
            "I consent to receiving feedback call and satisfaction survey",
            "मैं फ़ीडबैक कॉल और संतुष्टि सर्वेक्षण प्राप्त करने की सहमति देता/देती हूँ",
          )}
          required
        />
      </div>
    </FormSection>
  );
}
