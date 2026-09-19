import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const FormWrappers = ({
  heading,
  isLoading,
  children,
}) => {
  const { t } = useLanguage();
  const defaultHeading = t("Raise New Grievance", "नई शिकायत दर्ज करें");

  return (
    <div className="bg-card border border-border rounded-xl px-0 sm:px-0 p-4 sm:p-6 sm:pt-0 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-foreground border-b border-border py-3 px-4">
        {heading || defaultHeading}
      </h2>

      {children}

      <div className="flex justify-center pt-4 border-t border-border">
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {t("Submit Grievance", "शिकायत दर्ज करें")}
        </Button>
      </div>
    </div>
  );
};

export default FormWrappers;
