import React from "react";
import {
  CheckCircle2,
  XCircle,
  FilePlus2,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";
import EditDialog from "@/components/EditDialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useGetInmailById } from "@/hooks/query/useGetInmails";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { Link } from "react-router-dom";
import moment from "moment";

export default function InmailPreviewDialog({
  mail,
  onClose,
  onOpenReject,
  onOpenClose,
  onRaiseComplaint,
}) {
  const { t } = useLanguage();
  const emailId = mail?._id;

  const {
    data: inmailDetailData,
    isLoading: isDetailLoading,
    error: detailError,
  } = useGetInmailById(emailId, {
    enabled: Boolean(emailId),
  });

  if (!mail) return null;

  const detail = inmailDetailData?.data?.data || mail;
  const grievanceId =
    typeof detail.grievance === "object"
      ? detail.grievance?.grievanceId
      : detail.grievance;

  return (
    <EditDialog
      title={`${detail.emailId}: ${detail.subject}`}
      onClose={onClose}
      isHideFooter={true}
      bodyClassname={"max-w-xl"}
    >
      <LoaderErrWrapper isLoading={isDetailLoading} error={detailError}>
        <div className="space-y-4 text-xs">
          {/* Header info */}
          <div className="bg-muted/30 rounded-lg p-3 border border-border space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-muted-foreground w-12 shrink-0">
                From:
              </span>
              <span className="font-medium text-foreground break-all">
                {detail.fromName} &lt;{detail.fromEmail}&gt;
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-muted-foreground w-12 shrink-0">
                Date:
              </span>
              <span className="text-foreground">
                {moment(detail.receivedAt).isValid()
                  ? moment(detail.receivedAt).format(
                      "ddd, DD MMM YYYY [at] hh:mm A",
                    )
                  : "N/A"}
              </span>
            </div>
            {grievanceId && (
              <div className="flex items-start gap-2">
                <span className="font-semibold text-muted-foreground w-12 shrink-0">
                  {t("Grievance:", "शिकायत:")}
                </span>
                <Link
                  to={`/crm/track-complaint?complaint=${grievanceId}`}
                  onClick={onClose}
                  className="font-mono font-semibold text-primary hover:text-primary/70 hover:underline cursor-pointer transition-colors inline-flex items-center gap-1"
                >
                  {grievanceId}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Converted / Grievance Banner */}
          {(detail.status === "CONVERTED" || grievanceId) && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {t("Grievance Converted", "शिकायत में परिवर्तित")}
                  </p>
                  {grievanceId && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {t("Grievance ID:", "शिकायत आईडी:")}{" "}
                      <span className="font-mono font-semibold text-primary">
                        {grievanceId}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              {grievanceId && (
                <Link
                  to={`/crm/track-complaint?complaint=${grievanceId}`}
                  onClick={onClose}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  {t("Track Complaint", "शिकायत ट्रैक करें")}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          )}

          {/* Rejection Note Banner */}
          {detail.status === "REJECTED" && detail.rejectionReason && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  {t("Rejection Reason:", "अस्वीकृति का कारण:")}
                </p>
                <p>{detail.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Closure Note Banner */}
          {detail.status === "CLOSED" && detail.closeReason && (
            <div className="p-3 rounded-lg bg-slate-500/10 border border-slate-500/20 text-slate-700 dark:text-slate-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
              <div>
                <p className="font-semibold">
                  {t("Closure Reason / Note:", "बंद करने का कारण / विवरण:")}
                </p>
                <p>{detail.closeReason}</p>
              </div>
            </div>
          )}

          {/* Email Body */}
          <div>
            <p className="font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              {t("Message Body", "संदेश विवरण")}
            </p>
            <div className="bg-background rounded-lg p-3.5 border border-border whitespace-pre-wrap leading-relaxed">
              {detail.body}
            </div>
          </div>

          {/* Sticky Action Footer */}
          <div className="sticky bottom-0 -mx-5 -mb-5 px-5 py-3 bg-card border-t border-border flex items-center justify-between z-10 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="cursor-pointer text-xs"
            >
              {t("Close Window", "खिड़की बंद करें")}
            </Button>

            {detail.status === "PENDING" && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onOpenClose(detail);
                  }}
                  className="cursor-pointer text-xs bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  {t("Close Inmail", "इनमेल बंद करें")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onOpenReject(detail);
                  }}
                  className="cursor-pointer text-xs"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  {t("Reject", "अस्वीकार")}
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs font-semibold"
                  onClick={() => {
                    onClose();
                    onRaiseComplaint(detail);
                  }}
                >
                  <FilePlus2 className="w-3.5 h-3.5 mr-1" />
                  {t("Raise Complaint", "शिकायत दर्ज करें")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </LoaderErrWrapper>
    </EditDialog>
  );
}
