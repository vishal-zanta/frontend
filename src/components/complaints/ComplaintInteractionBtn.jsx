import React, { useState, useEffect, useMemo } from "react";
import {
  MessagesSquare,
  MessageSquarePlus,
  PhoneCall,
  PhoneOutgoing,
  PhoneIncoming,
  Mail,
  Clock,
  User,
  Phone,
  Volume2,
  Download,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import EditDialog from "@/components/EditDialog";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { useLanguage } from "@/context/LanguageContext";
import { useGetComplaintCommunications } from "@/hooks/query/useGetComplaints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchCallEvidence } from "@/api/calling.api";
import { getSuccessToast, getErrorToast, getWarningToast } from "@/utils/helpers";
import { IMG_BASE_URL, QUERY_KEYS } from "@/utils/constants";
import ComplaintRemarkDialog from "./ComplaintRemarkDialog";
import moment from "moment";
import clsx from "clsx";

export default function ComplaintInteractionBtn({ id, className = "" }) {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calls"); // "calls" | "emails"
  const [evidenceDialogCall, setEvidenceDialogCall] = useState(null);
  const [evidenceReason, setEvidenceReason] = useState("");
  const [isRemarkOpen, setIsRemarkOpen] = useState(false);

  const { data, isLoading, error } = useGetComplaintCommunications(id, {
    enabled: Boolean(isOpen && id),
  });

  useEffect(() => {
    if (data) {
      console.log("Complaint communications data:", data);
    }
  }, [data]);

  const dataToShow = data?.data || data;
  const calls = useMemo(() => {
    return Array.isArray(dataToShow?.calls) ? dataToShow.calls : [];
  }, [dataToShow]);

  const emails = useMemo(() => {
    return Array.isArray(dataToShow?.emails) ? dataToShow.emails : [];
  }, [dataToShow]);

  const getAudioUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = (IMG_BASE_URL || "").replace(/\/+$/, "");
    return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // Mutation to patch call evidence
  const { mutate: markEvidence, isPending: isEvidenceSaving } = useMutation({
    mutationFn: ({ callId, data }) => patchCallEvidence(callId, data),
    onSuccess: () => {
      getSuccessToast(
        t(
          "Call marked as evidence successfully",
          "कॉल को सफलतापूर्वक साक्ष्य के रूप में चिह्नित किया गया"
        )
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_COMMUNICATIONS, id],
      });
      queryClient.invalidateQueries({
        queryKey: ["calls"],
      });
      setEvidenceDialogCall(null);
      setEvidenceReason("");
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleSaveEvidence = () => {
    if (!evidenceReason.trim()) {
      getWarningToast(
        t("Please enter an evidence reason", "कृपया साक्ष्य का कारण दर्ज करें")
      );
      return;
    }
    const callId = evidenceDialogCall?._id;
    if (!callId) {
      getErrorToast("Call ID not found");
      return;
    }
    markEvidence({
      callId,
      data: {
        evidenceReason: evidenceReason.trim(),
      },
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className={`h-7 px-2.5 text-xs font-medium cursor-pointer flex items-center gap-1.5 border-border hover:bg-muted ${className}`}
        >
          <MessagesSquare className="w-3.5 h-3.5 text-primary" />
          {t("Communications", "संवाद")}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setIsRemarkOpen(true)}
          className={`h-7 px-2.5 text-xs font-medium cursor-pointer flex items-center gap-1.5 border-border hover:bg-muted ${className}`}
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-primary" />
          {t("Add Remark", "टिप्पणी जोड़ें")}
        </Button>
      </div>

      {isOpen && (
        <EditDialog
          title={t("Communications Timeline", "संवाद समयसीमा")}
          onClose={() => setIsOpen(false)}
          isHideFooter={true}
          bodyClassname="max-w-xl md:max-w-2xl"
        >
          <LoaderErrWrapper isLoading={isLoading} error={error}>
            <div className="space-y-4 pb-4">
              {/* Timeline Toggle & Actions on Top */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border w-fit">
                  <button
                    type="button"
                    onClick={() => setActiveTab("calls")}
                    className={clsx(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      activeTab === "calls"
                        ? "bg-card text-foreground shadow-sm border border-border/80"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <PhoneCall
                      className={clsx(
                        "w-3.5 h-3.5",
                        activeTab === "calls"
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                    <span>{t("Call Timeline", "कॉल समयसीमा")}</span>
                    <span
                      className={clsx(
                        "px-1.5 py-0.5 rounded-full text-[10px] leading-none",
                        activeTab === "calls"
                          ? "bg-primary/10 text-primary font-bold"
                          : "bg-muted-foreground/10 text-muted-foreground",
                      )}
                    >
                      {calls.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("emails")}
                    className={clsx(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      activeTab === "emails"
                        ? "bg-card text-foreground shadow-sm border border-border/80"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Mail
                      className={clsx(
                        "w-3.5 h-3.5",
                        activeTab === "emails"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground",
                      )}
                    />
                    <span>{t("Email Timeline", "ईमेल समयसीमा")}</span>
                    <span
                      className={clsx(
                        "px-1.5 py-0.5 rounded-full text-[10px] leading-none",
                        activeTab === "emails"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                          : "bg-muted-foreground/10 text-muted-foreground",
                      )}
                    >
                      {emails.length}
                    </span>
                  </button>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsRemarkOpen(true)}
                  className="h-7 px-2.5 text-xs font-medium cursor-pointer flex items-center gap-1.5 border-border hover:bg-muted"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5 text-primary" />
                  {t("Add Remark", "टिप्पणी जोड़ें")}
                </Button>
              </div>

              {/* Calls Timeline */}
              {activeTab === "calls" && (
                <div>
                  {calls.length > 0 ? (
                    <div className="relative border-l-2 border-border pl-5 ml-3 sm:ml-4 space-y-4 my-2">
                      {calls.map((call, idx) => {
                        const isOutbound = call.callType === "Outbound";
                        const CallIcon = isOutbound
                          ? PhoneOutgoing
                          : PhoneIncoming;

                        return (
                          <div
                            key={call._id || call.callId || idx}
                            className="relative"
                          >
                            {/* Timeline Dot */}
                            <div className="absolute -left-[27px] top-1.5 w-5 h-5 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-sm">
                              <CallIcon className="w-2.5 h-2.5 text-primary" />
                            </div>

                            {/* Call Card */}
                            <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm space-y-2.5 hover:shadow-md transition-shadow">
                              {/* Header row: callId, callType, createdAt */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-primary">
                                    {call.callId || `CALL-${idx + 1}`}
                                  </span>
                                  {call.callType && (
                                    <Badge
                                      variant="outline"
                                      className={clsx(
                                        "text-[10px] px-1.5 py-0",
                                        isOutbound
                                          ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                                          : "bg-primary/10 text-primary border-primary/20",
                                      )}
                                    >
                                      {isOutbound
                                        ? t("Outbound", "आउटबाउंड")
                                        : t("Inbound", "इनबाउंड")}
                                    </Badge>
                                  )}
                                  {call.evidenceTagged && (
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] px-1.5 py-0 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                    >
                                      {t("Evidence Tagged", "साक्ष्य चिह्नित")}
                                    </Badge>
                                  )}
                                </div>

                                {call.createdAt && (
                                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-muted-foreground/70" />
                                    {moment(call.createdAt).isValid()
                                      ? moment(call.createdAt).format(
                                          "DD MMM YYYY, hh:mm A",
                                        )
                                      : call.createdAt}
                                  </span>
                                )}
                              </div>

                              {/* Details Grid: agent name, citizenMobile, disposition */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <User className="w-3.5 h-3.5 text-muted-foreground/80 shrink-0" />
                                  <span>{t("Agent:", "एजेंट:")}</span>
                                  <span className="font-semibold text-foreground truncate">
                                    {call.agent?.name ||
                                      t("N/A", "उपलब्ध नहीं")}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Phone className="w-3.5 h-3.5 text-muted-foreground/80 shrink-0" />
                                  <span>
                                    {t("Citizen Mobile:", "नागरिक मोबाइल:")}
                                  </span>
                                  <span className="font-mono font-semibold text-foreground">
                                    {call.citizenMobile || "-"}
                                  </span>
                                </div>

                                {call.duration && (
                                  <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Clock className="w-3.5 h-3.5 text-muted-foreground/80 shrink-0" />
                                    <span>{t("Duration:", "अवधि:")}</span>
                                    <span className="font-semibold text-foreground">
                                      {call.duration}
                                    </span>
                                  </div>
                                )}

                                {call.disposition && (
                                  <div className="flex items-center gap-1.5 text-muted-foreground sm:col-span-2">
                                    <span className="font-medium">
                                      {t("Disposition:", "निपटान:")}
                                    </span>
                                    <span className="font-medium text-foreground truncate">
                                      {call.disposition}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Evidence reason display if tagged */}
                              {call.evidenceTagged && call.evidenceReason && (
                                <div className="text-[11px] text-purple-600 dark:text-purple-400 bg-purple-500/5 px-2.5 py-1 rounded-lg border border-purple-500/15 flex items-center gap-1.5">
                                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                  <span>
                                    <strong className="font-semibold">
                                      {t("Evidence Reason:", "साक्ष्य का कारण:")}
                                    </strong>{" "}
                                    {call.evidenceReason}
                                  </span>
                                </div>
                              )}

                              {/* Audio Recording Player: recordingUrl */}
                              {call.recordingUrl && (
                                <div className="mt-2 pt-2 border-t border-border/60 bg-muted/20 -mx-3.5 -mb-3.5 p-3 rounded-b-xl space-y-1.5">
                                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                    <span className="flex items-center gap-1.5 text-foreground font-semibold">
                                      <Volume2 className="w-3.5 h-3.5 text-primary" />
                                      {t("Call Recording", "कॉल रिकॉर्डिंग")}
                                    </span>
                                    <div className="flex items-center gap-2.5">
                                      {/* Mark as evidence button aside of download button */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEvidenceDialogCall(call);
                                          setEvidenceReason(
                                            call.evidenceReason || "",
                                          );
                                        }}
                                        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 hover:underline flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                                        title={
                                          call.evidenceTagged
                                            ? t(
                                                "Edit evidence reason",
                                                "साक्ष्य कारण संपादित करें",
                                              )
                                            : t(
                                                "Mark as evidence",
                                                "साक्ष्य के रूप में चिह्नित करें",
                                              )
                                        }
                                      >
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>
                                          {call.evidenceTagged
                                            ? t("Edit Evidence", "साक्ष्य संपादित करें")
                                            : t("Mark as evidence", "साक्ष्य चिह्नित करें")}
                                        </span>
                                      </button>

                                      <a
                                        href={getAudioUrl(call.recordingUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="text-primary hover:underline flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                                        title={t(
                                          "Download Recording",
                                          "रिकॉर्डिंग डाउनलोड करें",
                                        )}
                                      >
                                        <Download className="w-3 h-3" />
                                        {t("Download", "डाउनलोड")}
                                      </a>
                                    </div>
                                  </div>
                                  <audio
                                    controls
                                    preload="metadata"
                                    className="w-full h-8 max-w-full accent-primary focus:outline-none"
                                    src={getAudioUrl(call.recordingUrl)}
                                  >
                                    {t(
                                      "Your browser does not support the audio element.",
                                      "आपका ब्राउज़र ऑडियो तत्व का समर्थन नहीं करता।",
                                    )}
                                  </audio>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground/60">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-foreground text-sm">
                        {t("No Call Communications", "कोई कॉल संवाद नहीं")}
                      </p>
                      <p className="text-[11px] max-w-sm mx-auto">
                        {t(
                          "There are no recorded calls for this complaint yet.",
                          "इस शिकायत के लिए अभी तक कोई रिकॉर्ड की गई कॉल नहीं है।",
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Emails Timeline */}
              {activeTab === "emails" && (
                <div>
                  {emails.length > 0 ? (
                    <div className="relative border-l-2 border-border pl-5 ml-3 sm:ml-4 space-y-4 my-2">
                      {emails.map((email, idx) => {
                        const emailTime = email.time || email.createdAt;
                        const formattedTime = emailTime
                          ? moment(emailTime).isValid()
                            ? moment(emailTime).format("DD MMM YYYY, hh:mm A")
                            : emailTime
                          : "—";

                        return (
                          <div
                            key={email._id || email.id || idx}
                            className="relative"
                          >
                            {/* Timeline Dot */}
                            <div className="absolute -left-[27px] top-1.5 w-5 h-5 rounded-full bg-card border-2 border-emerald-500 flex items-center justify-center shadow-sm">
                              <Mail className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                            </div>

                            {/* Email Card */}
                            <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm space-y-2.5 hover:shadow-md transition-shadow">
                              {/* Header row: subject, status, time */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-xs text-foreground">
                                    {email.subject ||
                                      t("No Subject", "कोई विषय नहीं")}
                                  </span>
                                  {email.status && (
                                    <Badge
                                      variant="outline"
                                      className={clsx(
                                        "text-[10px] px-1.5 py-0",
                                        email.status === "Sent" ||
                                          email.status === "Delivered"
                                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                          : email.status === "Failed"
                                            ? "bg-destructive/10 text-destructive border-destructive/20"
                                            : "bg-muted/60 text-muted-foreground",
                                      )}
                                    >
                                      {email.status}
                                    </Badge>
                                  )}
                                </div>

                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-muted-foreground/70" />
                                  {formattedTime}
                                </span>
                              </div>

                              {/* Details Grid: from, fromName, fromEmail, to */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {email.from && (
                                  <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <span className="font-medium shrink-0">
                                      {t("From:", "प्रेषक:")}
                                    </span>
                                    <span className="text-foreground truncate font-medium">
                                      {email.from}
                                    </span>
                                  </div>
                                )}

                                {email.fromName && (
                                  <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <User className="w-3.5 h-3.5 text-muted-foreground/80 shrink-0" />
                                    <span className="font-medium shrink-0">
                                      {t("From Name:", "प्रेषक नाम:")}
                                    </span>
                                    <span className="text-foreground truncate font-semibold">
                                      {email.fromName}
                                    </span>
                                  </div>
                                )}

                                {email.fromEmail && (
                                  <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <span className="font-medium shrink-0">
                                      {t("From Email:", "प्रेषक ईमेल:")}
                                    </span>
                                    <span className="text-foreground truncate font-mono text-[11px]">
                                      {email.fromEmail}
                                    </span>
                                  </div>
                                )}

                                {email.to && (
                                  <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <span className="font-medium shrink-0">
                                      {t("To:", "प्रति:")}
                                    </span>
                                    <span className="text-foreground truncate font-mono text-[11px]">
                                      {email.to}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground/60">
                        <Mail className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-foreground text-sm">
                        {t("No Email Communications", "कोई ईमेल संवाद नहीं")}
                      </p>
                      <p className="text-[11px] max-w-sm mx-auto">
                        {t(
                          "There are no emails sent or received for this complaint yet.",
                          "इस शिकायत के लिए अभी तक कोई ईमेल भेजा या प्राप्त नहीं किया गया है।",
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </LoaderErrWrapper>
        </EditDialog>
      )}

      {/* Mark Call as Evidence Dialog */}
      {evidenceDialogCall && (
        <EditDialog
          title={t("Mark Call as Evidence", "कॉल को साक्ष्य के रूप में चिह्नित करें")}
          onClose={() => {
            setEvidenceDialogCall(null);
            setEvidenceReason("");
          }}
          onSave={handleSaveEvidence}
          saving={isEvidenceSaving}
          bodyClassname="max-w-md"
        >
          <div>
            <label className="text-xs font-semibold block mb-1 text-foreground">
              {t("Evidence Reason", "साक्ष्य का कारण")}{" "}
              <span className="text-destructive">*</span>
            </label>
            <Textarea
              value={evidenceReason}
              onChange={(e) => setEvidenceReason(e.target.value)}
              placeholder={t(
                "Enter reason for tagging as evidence (e.g., Citizen dispute escalation, resolution statement)...",
                "साक्ष्य का कारण दर्ज करें..."
              )}
              rows={3}
              className="text-xs"
            />
          </div>
        </EditDialog>
      )}

      {/* Shared Reusable Add Remark Dialog */}
      <ComplaintRemarkDialog
        isOpen={isRemarkOpen}
        onClose={() => setIsRemarkOpen(false)}
        grievanceId={id}
      />
    </>
  );
}
