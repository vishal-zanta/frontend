import React from "react";
import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function MyShiftDetails({ agentViewShift }) {
  const { t } = useLanguage();
  const { profile } = useAuth();

  const formatShift = (shift) => {
    if (!shift) return "-";
    let datePart = "";
    if (shift.date) {
      const d = new Date(shift.date);
      if (!isNaN(d.getTime())) {
        datePart = d.toLocaleDateString("en-IN");
      } else {
        datePart = shift.date;
      }
    }
    const timePart = shift.time || "";
    if (datePart && timePart) return `${datePart} | ${timePart}`;
    return datePart || timePart || "-";
  };

  const agentName = profile?.name || "-";
  const agentId = profile?.userCode || "-";
  const shiftText = agentViewShift ? formatShift(agentViewShift) : "-";
  const currentStatus = agentViewShift ? "-" : "-";
  const callsToday = agentViewShift ? 0 : 0;
  const resolvedToday = agentViewShift ? 0 : 0;

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
        <Lock className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <div>
          <div className="font-medium text-sm text-primary">
            {t("Read-Only View", "केवल-पठन दृश्य")}
          </div>
          <p className="text-xs text-muted-foreground">
            {t(
              "You can view shift details but cannot modify them. Contact your supervisor for shift changes.",
              "आप शिफ्ट विवरण देख सकते हैं लेकिन उन्हें बदल नहीं सकते। शिफ्ट बदलने के लिए अपने पर्यवेक्षक से संपर्क करें।",
            )}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 max-w-2xl">
        <h3 className="font-bold text-foreground mb-4">
          {t("My Shift Details", "मेरा शिफ्ट विवरण")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">
              {t("Agent Name", "एजेंट का नाम")}
            </div>
            <div className="font-medium">{agentName}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">
              {t("Agent ID", "एजेंट आईडी")}
            </div>
            <div className="font-mono text-sm font-medium">{agentId}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">
              {t("Shift", "शिफ्ट")}
            </div>
            <div className="font-medium">{shiftText}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">
              {t("Current Status", "वर्तमान स्थिति")}
            </div>
            <Badge
              variant="outline"
              className={`text-xs ${
                currentStatus === "Available"
                  ? "bg-emerald-50 text-emerald-700"
                  : currentStatus === "On Call"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-slate-50 text-slate-500"
              }`}
            >
              {currentStatus}
            </Badge>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">
              {t("Calls Today", "आज की कॉल")}
            </div>
            <div className="font-medium">{callsToday}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">
              {t("Resolved Today", "आज हल की गई")}
            </div>
            <div className="font-medium text-emerald-600">{resolvedToday}</div>
          </div>
        </div>
      </div>
    </>
  );
}
