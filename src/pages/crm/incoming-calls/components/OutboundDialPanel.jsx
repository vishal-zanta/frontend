import React from "react";
import { PhoneOutgoing, PhoneCall } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { QUICK_CALLBACK_NUMBERS } from "../constants";

export default function OutboundDialPanel({
  outboundNumber,
  setOutboundNumber,
  onDial,
  quickNumbers = QUICK_CALLBACK_NUMBERS,
}) {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-xl border-2 border-primary p-5">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <PhoneOutgoing className="w-5 h-5 text-primary" />{" "}
        {t("Outbound Dial", "आउटबाउंड डायल")}
      </h3>
      <div className="flex gap-2">
        <Input
          value={outboundNumber}
          onChange={(e) => setOutboundNumber(e.target.value)}
          placeholder={t(
            "Enter phone number to dial...",
            "डायल करने के लिए फोन नंबर दर्ज करें...",
          )}
          className="flex-1 bg-white"
        />
        <Button
          type="button"
          onClick={() => onDial && onDial(outboundNumber)}
          className="bg-primary hover:bg-primary/90"
          disabled={!outboundNumber}
        >
          <PhoneCall className="w-4 h-4 mr-1" /> {t("Dial", "डायल")}
        </Button>
      </div>
      <div className="mt-3">
        <div className="text-xs text-muted-foreground mb-2">
          {t(
            "Quick Callback - Recent Citizen Numbers:",
            "त्वरित कॉलबैक - हाल के नागरिक नंबर:",
          )}
        </div>
        <div className="space-y-1">
          {quickNumbers.map((num, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOutboundNumber(num.split(" (")[0])}
              className="w-full text-left px-3 py-2 text-sm rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-all bg-white"
            >
              <PhoneOutgoing className="w-3.5 h-3.5 inline mr-2 text-muted-foreground" />{" "}
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
