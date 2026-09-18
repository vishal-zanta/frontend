import React from "react";
import {
  FilePlus2,
  UserCheck,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  Camera,
  Star,
  Lock,
  Flag,
  Clock,
  Send,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const iconMap = {
  COMPLAINT_REGISTERED: FilePlus2,
  PRIORITY_SET: AlertTriangle,
  PRIORITY_UPDATED: AlertTriangle,
  ASSIGNED: UserCheck,
  OFFICER_ASSIGNED: UserCheck,
  SMS_SENT: Send,
  FIELD_VISIT_STATUS: MapPin,
  FIELD_VISIT_REMARK: MessageSquare,
  FIELD_VISIT_SCHEDULE: Clock,
  FIELD_VISIT_REPORT_SUBMITTED: MapPin,
  ESCALATED: Flag,
  TRANSFERRED: ArrowRight,
  OFFICER_TRANSFERRED: ArrowRight,
  RESOLVED: CheckCircle2,
  RESOLUTION_PHOTO: Camera,
  CITIZEN_FEEDBACK: Star,
  FEEDBACK_SUBMITTED: Star,
  COMPLAINT_CLOSED: Lock,
  STATUS_CHANGE: CheckCircle2,
  STATUS_CHANGED: CheckCircle2,
  STATUS_UPDATED: CheckCircle2,
  COMMENT_ADDED: MessageSquare,
  GEOTAGGED_IMAGE_UPLOADED: Camera,
};

const eventTranslations = {
  COMPLAINT_REGISTERED: { en: "Complaint Registered", hi: "शिकायत दर्ज की गई" },
  PRIORITY_SET: { en: "Priority Set", hi: "प्राथमिकता निर्धारित" },
  PRIORITY_UPDATED: { en: "Priority Updated", hi: "प्राथमिकता अपडेट की गई" },
  ASSIGNED: { en: "Officer Assigned", hi: "अधिकारी नियुक्त" },
  OFFICER_ASSIGNED: { en: "Officer Assigned", hi: "अधिकारी नियुक्त" },
  SMS_SENT: { en: "SMS Notification Sent", hi: "एसएमएस सूचना भेजी गई" },
  FIELD_VISIT_STATUS: { en: "Field Visit Status", hi: "क्षेत्रीय दौरा स्थिति" },
  FIELD_VISIT_REMARK: { en: "Field Visit Remark", hi: "क्षेत्रीय दौरा टिप्पणी" },
  FIELD_VISIT_SCHEDULE: { en: "Field Visit Scheduled", hi: "क्षेत्रीय दौरा निर्धारित" },
  FIELD_VISIT_REPORT_SUBMITTED: { en: "Field Visit Report Submitted", hi: "क्षेत्रीय दौरा रिपोर्ट सबमिट की गई" },
  ESCALATED: { en: "Complaint Escalated", hi: "शिकायत अग्रेषित की गई" },
  TRANSFERRED: { en: "Complaint Transferred", hi: "शिकायत स्थानांतरित" },
  OFFICER_TRANSFERRED: { en: "Officer Transferred", hi: "अधिकारी स्थानांतरित" },
  RESOLVED: { en: "Complaint Resolved", hi: "शिकायत हल की गई" },
  RESOLUTION_PHOTO: { en: "Resolution Photo Uploaded", hi: "समाधान फोटो अपलोड की गई" },
  CITIZEN_FEEDBACK: { en: "Citizen Feedback", hi: "नागरिक फीडबैक" },
  FEEDBACK_SUBMITTED: { en: "Feedback Submitted", hi: "फीडबैक सबमिट किया गया" },
  COMPLAINT_CLOSED: { en: "Complaint Closed", hi: "शिकायत बंद कर दी गई" },
  STATUS_CHANGE: { en: "Status Changed", hi: "स्थिति बदली गई" },
  STATUS_CHANGED: { en: "Status Changed", hi: "स्थिति बदली गई" },
  STATUS_UPDATED: { en: "Status Updated", hi: "स्थिति अपडेट की गई" },
  COMMENT_ADDED: { en: "Comment Added", hi: "टिप्पणी जोड़ी गई" },
  GEOTAGGED_IMAGE_UPLOADED: { en: "Geo-tagged Photo Uploaded", hi: "जियो-टैग फोटो अपलोड की गई" },
};

export default function ComplaintTimeline({ events, t }) {
  const { t: hookT } = useLanguage();
  const translate = t || hookT;

  const getLocalizedType = (type) => {
    const item = eventTranslations[type];
    if (!item) {
      const fallbackEn = (type || "")
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
      return translate ? translate(fallbackEn, fallbackEn) : fallbackEn;
    }
    return translate ? translate(item.en, item.hi) : item.en;
  };

  return (
    <div className="relative pl-6 xs:pl-7 sm:pl-8">
      {/* Vertical line */}
      <div className="absolute left-2.5 xs:left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 via-sky-300 to-slate-200 dark:to-slate-800"></div>

      {[...(events || [])].reverse().map((event, i) => {
        const Icon = iconMap[event.type] || FilePlus2;
        const actorName = event.actor?.name || event.actor?.role || (translate ? translate("System", "सिस्टम") : "System");
        
        const descEn =
          event.metadata?.description ||
          event.description ||
          event.notes ||
          "";
        const descLocal =
          event.metadata?.description_local ||
          event.description_local ||
          descEn;

        const description = translate ? translate(descEn, descLocal) : (descLocal || descEn);
        const eventTime = event.timestamp || event.createdAt;

        return (
          <div key={event._id || i} className="relative mb-3.5 xs:mb-4 sm:mb-6 last:mb-0">
            {/* Dot */}
            <div className="absolute -left-[23px] xs:-left-[31px] top-0.5 xs:top-0 w-5 h-5 xs:w-6 xs:h-6 rounded-full bg-white dark:bg-zinc-950 border-2 border-blue-500 flex items-center justify-center shadow-sm">
              <Icon className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-blue-600 dark:text-blue-400" />
            </div>
            {/* Content */}
            <div className="bg-white dark:bg-card border border-border rounded-lg p-2.5 xs:p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col xs:flex-row items-start justify-between gap-1 xs:gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs xs:text-sm font-semibold text-foreground leading-snug">
                    {getLocalizedType(event.type)}
                  </div>
                  <div className="text-[10px] xs:text-[11px] text-muted-foreground mt-0.5">
                    {translate ? translate("by", "द्वारा") : "by"} {actorName}
                  </div>
                  {description && (
                    <div className="text-xs xs:text-sm text-muted-foreground mt-1 leading-relaxed">
                      {description}
                    </div>
                  )}
                </div>
                <div className="text-[10px] xs:text-[11px] text-muted-foreground whitespace-nowrap flex items-center gap-1 shrink-0 mt-0.5 xs:mt-0">
                  <Clock className="w-3 h-3" />
                  {eventTime
                    ? new Date(eventTime).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
