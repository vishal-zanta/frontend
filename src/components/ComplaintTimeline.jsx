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

const iconMap = {
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
};

export default function ComplaintTimeline({ events }) {
  return (
    <div className="relative pl-6 xs:pl-7 sm:pl-8">
      {/* Vertical line */}
      <div className="absolute left-2.5 xs:left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 via-sky-300 to-slate-200 dark:to-slate-800"></div>

      {[...events].reverse().map((event, i) => {
        const iconMapping = {
          COMPLAINT_REGISTERED: "FilePlus2",
          PRIORITY_SET: "Flag",
          STATUS_UPDATED: "Clock",
          OFFICER_ASSIGNED: "UserCheck",
          GEOTAGGED_IMAGE_UPLOADED: "Camera",
          FIELD_VISIT_REPORT_SUBMITTED: "MapPin",
        };
        const iconName = event.icon || iconMapping[event.type] || "FilePlus2";
        const Icon = iconMap[iconName] || FilePlus2;
        const notes =
          event.notes || event.metadata?.description || event.description;
        const eventTime = event.timestamp || event.createdAt;

        return (
          <div key={i} className="relative mb-3.5 xs:mb-4 sm:mb-6 last:mb-0">
            {/* Dot */}
            <div className="absolute -left-[23px] xs:-left-[31px] top-0.5 xs:top-0 w-5 h-5 xs:w-6 xs:h-6 rounded-full bg-white dark:bg-zinc-950 border-2 border-blue-500 flex items-center justify-center shadow-sm">
              <Icon className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-blue-600 dark:text-blue-400" />
            </div>
            {/* Content */}
            <div className="bg-white dark:bg-card border border-border rounded-lg p-2.5 xs:p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col xs:flex-row items-start justify-between gap-1 xs:gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs xs:text-sm font-semibold text-foreground leading-snug">
                    {event.type?.replace(/_/g, " ")}
                  </div>
                  <div className="text-[10px] xs:text-[11px] text-muted-foreground mt-0.5">
                    by {event.actor?.name || event.actor?.role || "N/A"}
                  </div>
                  {notes && (
                    <div className="text-xs xs:text-sm text-muted-foreground mt-1 leading-relaxed">
                      {notes}
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
