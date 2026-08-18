import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import React from "react";

const FormWrappers = ({
  heading = "Raise New Grievance",
  isLoading,
  children,
}) => {
  return (
    <div className="bg-card border border-border rounded-xl px-0 sm:px-0 p-4 sm:p-6 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-foreground border-b border-border pb-3 px-4">
        {heading}
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
          Submit Grievance
        </Button>
      </div>
    </div>
  );
};

export default FormWrappers;
