import React from "react";
import {
  FilePlus2, UserCheck, MapPin, AlertTriangle, CheckCircle2, MessageSquare,
  Camera, Star, Lock, Flag, Clock, Send, ArrowRight
} from "lucide-react";

const iconMap = {
  FilePlus2, UserCheck, MapPin, AlertTriangle, CheckCircle2, MessageSquare,
  Camera, Star, Lock, Flag, Clock, Send, ArrowRight
};

export default function ComplaintTimeline({ events }) {
  return (
    <div className="relative pl-8">
      {/* Vertical line */}
      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 via-sky-300 to-slate-200"></div>

      {events.map((event, i) => {
        const Icon = iconMap[event.icon] || FilePlus2;
        return (
          <div key={i} className="relative mb-6 last:mb-0">
            {/* Dot */}
            <div className="absolute -left-[22px] top-0 w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center shadow-sm">
              <Icon className="w-3 h-3 text-blue-600" />
            </div>
            {/* Content */}
            <div className="bg-white border border-border rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{event.type}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">by {event.actor}</div>
                  {event.notes && <div className="text-sm text-muted-foreground mt-1">{event.notes}</div>}
                </div>
                <div className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(event.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}