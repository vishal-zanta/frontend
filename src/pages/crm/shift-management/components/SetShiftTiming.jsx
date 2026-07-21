import React, { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MySelect from "@/components/inputs/MySelect";
import { useGetShifts } from "../hooks";
import { assignShift } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { MAX_LIMIT, QUERY_KEYS } from "@/utils/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function SetShiftTiming() {
  const { t } = useLanguage();
  const qc = useQueryClient();
  const { data, isLoading } = useGetShifts({ page: 1, limit: MAX_LIMIT });
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedShift, setSelectedShift] = useState("Morning (07:00–14:00)");
  const [selectedDate, setSelectedDate] = useState("2024-05-17");

  const shiftsData = data?.data?.data?.docs || [];
  const agentOptions = shiftsData.map((a) => ({
    label: `${a.name} (${a.role?.level || a.role?.designationEnglish || ""})`,
    value: a._id,
  }));

  const assignShiftMutation = useMutation({
    mutationFn: assignShift,
    onSuccess: () => {
      getSuccessToast(t("Shift assigned successfully", "शिफ्ट सफलतापूर्वक आवंटित किया गया"));
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.SHIFTS] });
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleSave = () => {
    if (!selectedAgent) {
      getErrorToast({ message: t("Please select an agent", "कृपया एक एजेंट चुनें") });
      return;
    }
    assignShiftMutation.mutate({
      userId: selectedAgent,
      time: selectedShift,
      date: selectedDate,
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-bold text-foreground mb-4">{t("Set Shift Timing", "शिफ्ट समय निर्धारित करें")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <MySelect
            label={t("Agent Name", "एजेंट का नाम")}
            placeholder={isLoading ? t("Loading...", "लोड हो रहा है...") : t("Select agent...", "एजेंट चुनें...")}
            options={agentOptions}
            value={selectedAgent}
            onValueChange={setSelectedAgent}
            disabled={isLoading || assignShiftMutation.isPending}
            required
          />
        </div>
        <div>
          <Label className="mb-1.5 block">{t("Shift", "शिफ्ट")}</Label>
          <Select
            value={selectedShift}
            onValueChange={setSelectedShift}
            disabled={assignShiftMutation.isPending}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Morning (07:00–14:00)">
                {t("Morning (07:00–14:00)", "सुबह (07:00–14:00)")}
              </SelectItem>
              <SelectItem value="Afternoon (14:00–22:00)">
                {t("Afternoon (14:00–22:00)", "दोपहर (14:00–22:00)")}
              </SelectItem>
              <SelectItem value="Night (22:00–06:00)">
                {t("Night (22:00–06:00)", "रात (22:00–06:00)")}
              </SelectItem>
              <SelectItem value="Full Day (08:00–20:00)">
                {t("Full Day (08:00–20:00)", "पूरा दिन (08:00–20:00)")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 block">{t("Date", "दिनांक")}</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={assignShiftMutation.isPending}
          />
        </div>
      </div>
      <Button
        className="mt-4 bg-primary hover:bg-primary/90"
        onClick={handleSave}
        disabled={assignShiftMutation.isPending}
      >
        {assignShiftMutation.isPending ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <Save className="w-4 h-4 mr-1" />
        )}
        {assignShiftMutation.isPending ? t("Saving Shift...", "शिफ्ट सहेजा जा रहा है...") : t("Save Shift", "शिफ्ट सहेजें")}
      </Button>
    </div>
  );
}
