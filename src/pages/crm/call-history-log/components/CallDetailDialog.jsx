import React from "react";
import EditDialog from "@/components/EditDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { IMG_BASE_URL } from "@/utils/constants";
import moment from "moment";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  User,
  FileText,
  Volume2,
  VolumeX,
  Download,
  ShieldCheck,
  Calendar,
  Activity,
} from "lucide-react";
import clsx from "clsx";
import { StatusBadge } from "@/components/Badges";

export default function CallDetailDialog({ call, onClose, onOpenEvidenceDialog }) {
  const { t } = useLanguage();

  if (!call) return null;

  const callId = call.callId || call._id || "—";
  const isOutbound = call.callType === "Outbound";
  const CallIcon = isOutbound ? PhoneOutgoing : PhoneIncoming;

  const getAudioUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = (IMG_BASE_URL || "").replace(/\/+$/, "");
    return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const complaintCode =
    call.complaintIdString ||
    call.complaintId?.grievanceId ||
    (typeof call.complaintId === "string" ? call.complaintId : null);

  const complaintStatus = call.complaintId?.status;

  const agentName =
    call.agent?.name || (typeof call.agent === "string" ? call.agent : null);
  const agentCode = call.agent?.userCode;

  const formattedDate = call.createdAt
    ? moment(call.createdAt).isValid()
      ? moment(call.createdAt).format("DD MMM YYYY, hh:mm A")
      : call.createdAt
    : "—";

  const formattedUpdatedAt = call.updatedAt
    ? moment(call.updatedAt).isValid()
      ? moment(call.updatedAt).format("DD MMM YYYY, hh:mm A")
      : call.updatedAt
    : null;

  return (
    <EditDialog
      title={t("Call Details", "कॉल विवरण")}
      onClose={onClose}
      isHideFooter={true}
      bodyClassname="max-w-xl md:max-w-2xl"
    >
      <div className="space-y-4 pb-4">
        {/* Top Header Card */}
        <div className="bg-muted/40 border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CallIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-base font-bold text-foreground">
                  {callId}
                </span>
                <Badge
                  variant="outline"
                  className={clsx(
                    "text-xs px-2 py-0.5",
                    isOutbound
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                      : "bg-primary/10 text-primary border-primary/20"
                  )}
                >
                  {isOutbound
                    ? t("Outbound Call", "आउटबाउंड कॉल")
                    : t("Inbound Call", "इनबाउंड कॉल")}
                </Badge>
                <Badge
                  variant="outline"
                  className={clsx(
                    "text-xs px-2 py-0.5",
                    call.status === "Resolved" || call.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : call.status === "Missed" || call.status === "Failed"
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  )}
                >
                  {call.status || t("Initiated", "आरंभ किया गया")}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                {formattedDate}
              </p>
            </div>
          </div>

          {call.evidenceTagged ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold self-start sm:self-center">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t("Evidence Tagged", "साक्ष्य चिह्नित")}</span>
            </div>
          ) : (
            onOpenEvidenceDialog && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenEvidenceDialog(call);
                }}
                className="text-xs h-8 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 cursor-pointer self-start sm:self-center"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                {t("Mark as evidence", "साक्ष्य चिह्नित करें")}
              </Button>
            )
          )}
        </div>

        {/* Call Recording Player Section */}
        {call.recordingUrl ? (
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {t("Call Recording Audio", "कॉल रिकॉर्डिंग ऑडियो")}
                  </h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-muted-foreground/80" />
                    <span>
                      {t("Duration:", "अवधि:")}{" "}
                      <strong className="text-foreground">
                        {call.recordingDuration || call.duration || "—"}
                      </strong>
                    </span>
                  </p>
                </div>
              </div>
              <a
                href={getAudioUrl(call.recordingUrl)}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border hover:bg-muted text-foreground transition-colors shadow-xs"
                title={t("Download Recording", "रिकॉर्डिंग डाउनलोड करें")}
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>{t("Download", "डाउनलोड")}</span>
              </a>
            </div>

            {/* Native HTML5 Audio Player */}
            <div className="pt-1">
              <audio
                controls
                preload="metadata"
                className="w-full h-10 accent-primary focus:outline-none rounded-lg"
                src={getAudioUrl(call.recordingUrl)}
              >
                {t(
                  "Your browser does not support the audio element.",
                  "आपका ब्राउज़र ऑडियो तत्व का समर्थन नहीं करता।"
                )}
              </audio>
            </div>
            <p className="text-[11px] font-mono text-muted-foreground truncate">
              {call.recordingUrl}
            </p>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground flex items-center gap-2.5">
            <VolumeX className="w-4 h-4 shrink-0 text-muted-foreground/70" />
            <span>
              {t(
                "No call recording audio is available for this call log.",
                "इस कॉल लॉग के लिए कोई कॉल रिकॉर्डिंग ऑडियो उपलब्ध नहीं है।"
              )}
            </span>
          </div>
        )}

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Citizen Mobile */}
          <div className="p-3 rounded-xl bg-card border border-border space-y-1">
            <span className="text-muted-foreground uppercase font-medium text-[10px] flex items-center gap-1">
              <Phone className="w-3 h-3 text-muted-foreground/80" />
              {t("Citizen Mobile", "नागरिक मोबाइल")}
            </span>
            <span className="font-mono text-sm font-semibold text-foreground block">
              {call.citizenMobile || "—"}
            </span>
          </div>

          {/* Agent */}
          <div className="p-3 rounded-xl bg-card border border-border space-y-1">
            <span className="text-muted-foreground uppercase font-medium text-[10px] flex items-center gap-1">
              <User className="w-3 h-3 text-muted-foreground/80" />
              {t("Handling Agent", "प्रभारी एजेंट")}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-foreground">
                {agentName || t("Not Assigned", "अविभाजित")}
              </span>
              {agentCode && (
                <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0">
                  {agentCode}
                </Badge>
              )}
            </div>
          </div>

          {/* Disposition */}
          <div className="p-3 rounded-xl bg-card border border-border space-y-1">
            <span className="text-muted-foreground uppercase font-medium text-[10px] flex items-center gap-1">
              <Activity className="w-3 h-3 text-muted-foreground/80" />
              {t("Call Disposition", "कॉल का परिणाम")}
            </span>
            <span className="text-sm font-semibold text-foreground block">
              {call.disposition || "—"}
            </span>
          </div>

          {/* Call Duration */}
          <div className="p-3 rounded-xl bg-card border border-border space-y-1">
            <span className="text-muted-foreground uppercase font-medium text-[10px] flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground/80" />
              {t("Call Duration", "कॉल अवधि")}
            </span>
            <span className="text-sm font-semibold text-foreground block">
              {call.duration || call.recordingDuration || "—"}
            </span>
          </div>

          {/* Linked Complaint */}
          <div className="p-3 rounded-xl bg-card border border-border space-y-1 sm:col-span-2">
            <span className="text-muted-foreground uppercase font-medium text-[10px] flex items-center gap-1">
              <FileText className="w-3 h-3 text-muted-foreground/80" />
              {t("Linked Grievance / Complaint", "संबद्ध शिकायत")}
            </span>
            {complaintCode ? (
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <span className="font-mono text-sm font-bold text-primary">
                  {complaintCode}
                </span>
                {complaintStatus && (
                  <>
                  <StatusBadge status={complaintStatus}/>
                  {/* <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {complaintStatus}
                  </Badge> */}
                  </>
                )}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">
                {t("No complaint linked to this call", "इस कॉल से कोई शिकायत संबद्ध नहीं है")}
              </span>
            )}
          </div>

          {/* Evidence Tagged Details if present */}
          {call.evidenceTagged && (
            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-1 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{t("Evidence Information", "साक्ष्य जानकारी")}</span>
              </div>
              <p className="text-xs text-foreground mt-1">
                <strong>{t("Reason:", "कारण:")}</strong>{" "}
                {call.evidenceReason || t("Marked as evidence", "साक्ष्य के रूप में चिह्नित")}
              </p>
              {call.taggedDate && (
                <p className="text-[11px] text-muted-foreground">
                  <strong>{t("Tagged On:", "चिह्नित दिनांक:")}</strong> {call.taggedDate}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Timestamps */}
        {/* {formattedUpdatedAt && (
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border">
            <span>
              {t("Created:", "सृजित:")} {formattedDate}
            </span>
            <span>
              {t("Last Updated:", "अंतिम अद्यतन:")} {formattedUpdatedAt}
            </span>
          </div>
        )} */}

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="px-5">
            {t("Close", "बंद करें")}
          </Button>
        </div>
      </div>
    </EditDialog>
  );
}
