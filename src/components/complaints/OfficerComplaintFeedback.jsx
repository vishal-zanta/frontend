import React, { useEffect, useState } from "react";
import { MessageSquare, Send, CheckCircle2, Star } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { postComplaintFeedback } from "@/api/complaint.api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { QUERY_KEYS } from "@/utils/constants";

const RATING_LABELS = {
  1: ["Poor", "खराब"],
  2: ["Fair", "औसत"],
  3: ["Good", "अच्छा"],
  4: ["Very Good", "बहुत अच्छा"],
  5: ["Excellent", "उत्कृष्ट"],
};

function StarRating({ rating, onRatingChange, editable = true }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (editable ? hovered || rating : rating);
        return (
          <button
            key={star}
            type="button"
            disabled={!editable}
            onClick={() => editable && onRatingChange?.(star)}
            onMouseEnter={() => editable && setHovered(star)}
            onMouseLeave={() => editable && setHovered(0)}
            className={`transition-all duration-150 ${editable ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted-foreground/30"
              }`}
            />
          </button>
        );
      })}
      {(hovered || rating) > 0 && (
        <span className="ml-2 text-sm font-semibold text-amber-600">
          {RATING_LABELS[hovered || rating]?.[0] || ""}
        </span>
      )}
    </div>
  );
}

export default function OfficerComplaintFeedback({
  complaintId,
  existingRating,
  existingFeedback,
  t,
}) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(existingRating || 0);
  const [feedback, setFeedback] = useState(existingFeedback || "");

  const isAlreadySubmitted =
    typeof existingRating === "number" && existingRating > 0;

  const mutation = useMutation({
    mutationFn: () =>
      postComplaintFeedback({
        id: complaintId,
        data: { rating, feedbackText: feedback },
      }),
    onSuccess: () => {
      getSuccessToast(
        t("Feedback submitted successfully", "प्रतिक्रिया सफलतापूर्वक सबमिट की गई"),
      );
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.COMPLAINTS_OFFICER] });
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.COMPLAINTS_ALL] });
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.COMPLAINT_DETAIL] });

    },
    onError: (err) => {
      getErrorToast(err);
    },
  });
  useEffect(()=> {
    if(rating!== existingRating){
      setRating(existingRating || 0);
    }
    if(feedback !== existingFeedback){
      setFeedback(existingFeedback || "");
    }
  },[existingRating,existingFeedback])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      getErrorToast({
        message: t(
          "Please select a rating before submitting",
          "कृपया सबमिट करने से पहले रेटिंग चुनें",
        ),
      });
      return;
    }
    if (!feedback.trim()) {
      getErrorToast({
        message: t("Feedback text is required", "प्रतिक्रिया टेक्स्ट आवश्यक है"),
      });
      return;
    }
    mutation.mutate();
  };

  if (isAlreadySubmitted) {
    return (
      <div className="border-t border-border pt-4 mt-2">
        <div className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
          {t("Citizen Feedback", "नागरिक प्रतिक्रिया")}
        </div>
        <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t("Feedback Submitted", "प्रतिक्रिया सबमिट की गई")}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground">
              {t("Rating:", "रेटिंग:")}
            </span>
            <StarRating rating={existingRating} editable={false} />
          </div>
          {existingFeedback && (
            <p className="text-xs text-muted-foreground bg-card rounded-lg border border-emerald-100 dark:border-emerald-900 px-3 py-2 italic">
              "{existingFeedback}"
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-border pt-4 mt-2">
      <div className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
        {t("Citizen Feedback", "नागरिक प्रतिक्रिया")}
      </div>
      <div className="p-3 bg-card border border-border rounded-xl space-y-3">
        <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
          <MessageSquare className="w-4 h-4 text-primary shrink-0" />
          <span>{t("Rate Resolution Experience", "समाधान अनुभव को रेट करें")}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label className="mb-2 block text-xs font-medium text-muted-foreground">
              {t(
                "How satisfied are you with the resolution? *",
                "आप समाधान से कितने संतुष्ट हैं? *",
              )}
            </Label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="officer-feedback-textarea"
              className="text-xs font-medium text-muted-foreground"
            >
              {t("Comments / Suggestions *", "टिप्पणियाँ / सुझाव *")}
            </Label>
            <Textarea
              id="officer-feedback-textarea"
              placeholder={t(
                "Share thoughts on the resolution...",
                "समाधान पर अपने विचार साझा करें...",
              )}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          <Button
            type="submit"
            size="sm"
            disabled={rating === 0 || !feedback.trim() || mutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
          >
            {mutation.isPending ? (
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            {t("Submit Feedback", "प्रतिक्रिया सबमिट करें")}
          </Button>
        </form>
      </div>
    </div>
  );
}
