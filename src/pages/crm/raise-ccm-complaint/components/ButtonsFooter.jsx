import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ButtonsFooter({
  step,
  handleBack,
  handleNext,
  isSubmitting,
  t,
}) {
  const { watch } = useFormContext();
  const feedbackConsent = watch("communication.feedbackConsent");
  const isNextDisabled = step === 1 && !feedbackConsent;

  return (
    <div className="flex justify-center gap-4 items-center mt-6 pt-4 border-t border-border">
      <div>
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="hover:bg-muted font-medium transition-all"
          >
            &larr; {t("Back", "पीछे")}
          </Button>
        )}
      </div>

      <div>
        {step < 3 ? (
        
           <button
              type="button"
              onClick={handleNext}
              disabled={isNextDisabled}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium min-w-[120px] transition-all h-9 px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Next", "आगे")} &rarr;
            </button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium min-w-[180px] transition-all "
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("Submitting...", "जमा हो रहा है...")}
              </span>
            ) : (
              t("Submit Grievance", "शिकायत जमा करें")
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
