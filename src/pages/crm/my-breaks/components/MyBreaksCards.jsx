import React from "react";
import { Coffee, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

export default function MyBreaksCards({ breaks = [] }) {
  const { t } = useLanguage();

  if (!breaks || breaks.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        {t("No breaks logged yet.", "अभी तक कोई ब्रेक लॉग नहीं हुआ है।")}
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      {breaks.map((b, idx) => {
        const isOngoing = b.isOngoing ?? !b.endTime;
        return (
          <div
            key={b._id || b.id || idx}
            className="p-4 rounded-xl border border-border bg-card shadow-xs hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOngoing ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-primary/10 text-primary"}`}>
                  <Coffee className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-foreground">
                  {t("Break", "ब्रेक")} #{b.breakNumber || b.seq || idx + 1}
                </span>
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${
                  isOngoing
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                }`}
              >
                {isOngoing ? (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    {t("Active", "सक्रिय")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {t("Completed", "पूर्ण")}
                  </span>
                )}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground flex items-center gap-1 mb-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {t("Date", "दिनांक")}
                </span>
                <span className="font-medium text-foreground">
                  {b.date || (b.startTime ? new Date(b.startTime).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" }) : "N/A")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground flex items-center gap-1 mb-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  {t("Duration", "अवधि")}
                </span>
                <span className="font-bold text-foreground">
                  {b.durationFormatted || b.durationText || (b.durationSeconds ? `${Math.floor(b.durationSeconds / 60)}m ${b.durationSeconds % 60}s` : b.duration || "N/A")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">
                  {t("Start Time", "शुरू होने का समय")}
                </span>
                <span className="font-medium text-foreground">
                  {b.startTime ? new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : (b.start || "N/A")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">
                  {t("End Time", "समाप्ति समय")}
                </span>
                <span className="font-medium text-foreground">
                  {b.endTime ? new Date(b.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : (isOngoing ? t("Ongoing...", "प्रक्रियाधीन...") : (b.end || "N/A"))}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
