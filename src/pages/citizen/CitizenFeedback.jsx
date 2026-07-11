import React, { useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { COMPLAINTS } from "@/lib/biharData";
import { getCitizenComplaints } from "@/lib/complaintStore";
import PortalLayout from "@/components/PortalLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";

export default function CitizenFeedback() {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [complaintId, setComplaintId] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const resolvedComplaints = [
    ...getCitizenComplaints("Ramesh Prasad"),
    ...COMPLAINTS,
  ].filter((c) => ["Resolved", "Closed"].includes(c.status));
  // Deduplicate by ID
  const seen = new Set();
  const uniqueResolved = resolvedComplaints.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  const selectedComplaint = uniqueResolved.find((c) => c.id === complaintId);

  const handleSubmit = () => {
    if (!rating || !complaintId || !message.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PortalLayout role="citizen">
        <div className="p-6 flex items-center justify-center min-h-[80vh]">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              {t(
                "Thank You for Your Feedback!",
                "आपकी प्रतिक्रिया के लिए धन्यवाद!",
              )}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {t(
                `Your feedback for complaint ${complaintId} has been recorded.`,
                `आपकी शिकायत ${complaintId} के लिए आपकी प्रतिक्रिया दर्ज कर ली गई है।`,
              )}
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setRating(0);
                setComplaintId("");
                setMessage("");
              }}
              variant="outline"
            >
              {t("Submit Another", "एक और जमा करें")}
            </Button>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout role="citizen">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">
          {t("Feedback", "प्रतिक्रिया")}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {t(
            "Rate your experience with a resolved complaint.",
            "अपनी हल की गई शिकायत के अनुभव को रेट करें।",
          )}
        </p>

        <div className="bg-white rounded-xl border border-border p-6 space-y-6">
          {/* Select resolved complaint */}
          <div>
            <Label className="mb-1.5 block">
              {t("Select Resolved Complaint *", "हल की गई शिकायत चुनें *")}
            </Label>
            <Select value={complaintId} onValueChange={setComplaintId}>
              <SelectTrigger>
                <SelectValue
                  placeholder={t(
                    "Select a resolved complaint",
                    "हल की गई शिकायत चुनें",
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {uniqueResolved.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.id} - {c.serviceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedComplaint && (
              <div className="mt-2 p-3 bg-muted/50 rounded-lg text-sm">
                <div className="font-medium">
                  {selectedComplaint.serviceName} -{" "}
                  {selectedComplaint.subserviceName}
                </div>
                <div className="text-muted-foreground mt-1">
                  {selectedComplaint.description}
                </div>
                {selectedComplaint.resolvedDate && (
                  <div className="text-xs text-emerald-600 mt-1">
                    {t("Resolved on", "हल किया गया")}:{" "}
                    {new Date(
                      selectedComplaint.resolvedDate,
                    ).toLocaleDateString("en-IN")}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rating */}
          <div>
            <Label className="mb-2 block">
              {t("Rate Your Experience *", "अपना अनुभव रेट करें *")}
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  className="p-1"
                  disabled={!complaintId}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${(hover || rating) >= n ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"} ${!complaintId ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                </button>
              ))}
            </div>
            {!complaintId && (
              <p className="text-xs text-muted-foreground mt-1">
                {t(
                  "Please select a complaint first",
                  "कृपया पहले एक शिकायत चुनें",
                )}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <Label className="mb-1.5 block">
              {t("Your Feedback *", "आपकी प्रतिक्रिया *")}
            </Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t(
                "Share your thoughts about the resolution...",
                "समाधान के बारे में अपने विचार साझा करें...",
              )}
              rows={5}
              disabled={!complaintId}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!rating || !complaintId || !message.trim()}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4 mr-1" />{" "}
            {t("Submit Feedback", "प्रतिक्रिया जमा करें")}
          </Button>
        </div>

        {uniqueResolved.length === 0 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            {t(
              "You have no resolved complaints to give feedback on yet.",
              "आपकी कोई हल की गई शिकायत नहीं है जिस पर प्रतिक्रिया दी जा सके।",
            )}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
