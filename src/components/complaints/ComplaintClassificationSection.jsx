import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePortalProfile } from "@/hooks/usePortalProfile";
import { useAuth } from "@/context/AuthContext";
import { Mail } from "lucide-react";
import { Button } from "../ui/button";

export default function ComplaintClassificationSection({ departmentText, occurrenceDate }) {
  const { t } = useLanguage();
  const {profiledata} = useAuth();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3 text-[10px] lg:text-xs bg-muted/20 p-2.5 lg:p-3 rounded-lg border border-border">
      <div>
        <span className="text-muted-foreground block font-medium">{t("Department", "विभाग")}</span>
        <span className="font-semibold text-foreground">{departmentText}</span>
      </div>
     
      <div>
        <span className="text-muted-foreground block font-medium">{t("Occurrence Date", "घटना की तिथि")}</span>
        <span className="font-semibold text-foreground">{occurrenceDate}</span>
      </div>

        {profiledata?.isOfficer && (
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              size="sm"
              className="bg-card hover:bg-muted text-foreground border-border flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary">{t("Send Mail", "मेल भेजें")}</span>
            </Button>
          </div>
        )}
    </div>
  );
}
