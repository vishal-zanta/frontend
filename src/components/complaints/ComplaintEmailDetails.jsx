import React, { useState } from "react";
import { Mail, Eye, Calendar, User, ExternalLink, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGetInmailById } from "@/hooks/query/useGetInmails";
import InmailPreviewDialog from "@/pages/crm/inmail/components/InmailPreviewDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import moment from "moment";

const ComplaintEmailDetails = ({ channelText, id }) => {
  const { t } = useLanguage();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    data: emailApiData,
    isLoading,
    error,
  } = useGetInmailById(id, {
    enabled: Boolean(id),
  });

  const emailData = emailApiData?.data?.data || emailApiData?.data;

  if (!id) return null;

  return (
    <div className="bg-muted/30 rounded-lg p-3 lg:p-4 border border-border">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs lg:text-sm font-semibold text-foreground">
              {t("Source Inmail Communication", "मूल इनमेल संचार")}
            </h4>
            <p className="text-[10px] text-muted-foreground">
              {t(
                "Original email from which this grievance was registered",
                "मूल ईमेल जिससे यह शिकायत दर्ज की गई थी",
              )}
            </p>
          </div>
        </div>

        {emailData && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
            className="h-7 px-2.5 text-xs text-primary hover:text-primary border-primary/30 hover:bg-primary/10 cursor-pointer font-medium"
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            {t("View Full Inmail", "पूर्ण इनमेल देखें")}
          </Button>
        )}
      </div>

      <LoaderErrWrapper isLoading={isLoading} error={error}>
        {emailData ? (
          <div className="bg-card rounded-md border border-border/80 p-3 space-y-2.5 text-xs">
            {/* Top row: Ref ID & Received date */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-muted-foreground">
                  {t("Ref ID:", "संदर्भ आईडी:")}
                </span>
                <span className="font-mono font-semibold text-primary">
                  {emailData.emailId || emailData._id}
                </span>
              </div>
              {emailData.receivedAt && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {moment(emailData.receivedAt).format(
                      "DD MMM YYYY, hh:mm A",
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Sender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("From / Sender", "प्रेषक")}
                </span>
                <p className="font-semibold text-foreground">
                  {emailData.fromName || "N/A"}{" "}
                  {emailData.fromEmail && (
                    <span className="text-muted-foreground font-normal">
                      &lt;{emailData.fromEmail}&gt;
                    </span>
                  )}
                </p>
              </div>

              {emailData.status && (
                <div>
                  <span className="text-muted-foreground block font-medium">
                    {t("Inmail Status", "इनमेल स्थिति")}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  >
                    {emailData.status}
                  </Badge>
                </div>
              )}
            </div>

            {/* Subject */}
            <div>
              <span className="text-muted-foreground block font-medium text-[11px]">
                {t("Subject", "विषय")}
              </span>
              <p className="font-medium text-foreground text-xs line-clamp-1">
                {emailData.subject || "(No Subject)"}
              </p>
            </div>
          </div>
        ) : (
          !isLoading && (
            <p className="text-xs text-muted-foreground italic py-2">
              {t(
                "No linked email details found.",
                "कोई लिंक किया गया ईमेल विवरण नहीं मिला।",
              )}
            </p>
          )
        )}
      </LoaderErrWrapper>

      {/* Preview Dialog */}
      {isPreviewOpen && emailData && (
        <InmailPreviewDialog
          mail={emailData}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};

export default ComplaintEmailDetails;