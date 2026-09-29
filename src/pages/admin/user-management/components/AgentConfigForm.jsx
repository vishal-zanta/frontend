import React from "react";
import RhfInput from "@/components/rhfinputs/RhfInput";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { agentConfigSchema } from "../schema";

export { agentConfigSchema };

/**
 * Agent Configuration Form Fields (agentId, extension, password, confirmPassword)
 */
export default function AgentConfigForm({ onCancel, isLoading = false }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <RhfInput
        name="agentId"
        label={t("Agent ID", "एजेंट आईडी")}
        placeholder={t("Enter Agent ID", "एजेंट आईडी दर्ज करें")}
        isNumsOnly={true}
        required={true}
      />
      <RhfInput
        name="extension"
        label={t("Extension", "एक्सटेंशन")}
        placeholder={t("Enter Extension (e.g. 1001)", "एक्सटेंशन दर्ज करें (जैसे 1001)")}
        isNumsOnly={true}
        required={true}
      />
      <RhfInput
        name="password"
        label={t("Password", "पासवर्ड")}
        placeholder={t("Enter Password", "पासवर्ड दर्ज करें")}
        type="password"
        required={true}
      />
      <RhfInput
        name="confirmPassword"
        label={t("Confirm Password", "पासवर्ड की पुष्टि करें")}
        placeholder={t("Re-enter Password", "पासवर्ड दोबारा दर्ज करें")}
        type="password"
        required={true}
      />

      <div className="flex gap-2 pt-2 mt-4 sticky bottom-0 bg-card pb-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t("Cancel", "रद्द करें")}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-primary hover:bg-primary/90 flex items-center justify-center gap-1.5"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" /> {t("Saving...", "सहेज रहा है...")}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-1" /> {t("Save Configuration", "कॉन्फ़िगरेशन सहेजें")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
