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
                  <div className="flex justify-end pt-1 pb-2">
                    <Button
                      variant="outline"
                      className="bg-white hover:bg-muted/30 dark:bg-zinc-900 text-foreground border border-border flex items-center gap-2 cursor-pointer"
                      
                    >
                      <Mail className="w-4 h-4" />
                      {t("Send Mail", "मेल भेजें")}
                    </Button>
                  </div>
                )}
    </div>
  );
}
