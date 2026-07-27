import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Mail } from "lucide-react";
import { Button } from "../ui/button";
import EditDialog from "@/components/EditDialog";
import { getSuccessToast } from "@/utils/helpers";

export default function ComplaintClassificationSection({ departmentText, occurrenceDate }) {
  const { t } = useLanguage();
  const { profiledata } = useAuth();
  const [showMailDialog, setShowMailDialog] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");

  const handleSendMail = () => {
    setShowMailDialog(false);
    setRecipientEmail("");
    getSuccessToast(t("Mail sent successfully", "मेल सफलतापूर्वक भेजा गया"));
  };

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
              onClick={() => setShowMailDialog(true)}
            >
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary">{t("Send Mail", "मेल भेजें")}</span>
            </Button>
          </div>
        )}

      {showMailDialog && (
        <EditDialog
          title={t("Send Mail", "मेल भेजें")}
          onClose={() => { setShowMailDialog(false); setRecipientEmail(""); }}
          onSave={handleSendMail}
          saving={false}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              {t("Recipient Email", "प्राप्तकर्ता ईमेल")}
              <span className="text-destructive"> *</span>
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder={t("Enter email address", "ईमेल पता दर्ज करें")}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </EditDialog>
      )}
    </div>
  );
}
