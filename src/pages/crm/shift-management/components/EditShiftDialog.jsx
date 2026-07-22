import React, { useState } from "react";
import EditDialog from "@/components/EditDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignShift } from "../api";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { QUERY_KEYS } from "@/utils/constants";

export default function EditShiftDialog({ agent, onClose, t }) {
  const qc = useQueryClient();
  const [shiftTime, setShiftTime] = useState(agent?.shift?.time || "");
  const [shiftDate, setShiftDate] = useState(() => {
    if (agent?.shift?.date) {
      const d = new Date(agent.shift.date);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split("T")[0];
      }
      return agent.shift.date;
    }
    return new Date().toISOString().split("T")[0];
  });

  const assignShiftMutation = useMutation({
    mutationFn: assignShift,
    onSuccess: () => {
      getSuccessToast(t("Shift assigned successfully", "शिफ्ट सफलतापूर्वक आवंटित किया गया"));
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.SHIFTS] });
      onClose();
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleSaveShift = () => {
    if (!shiftTime) {
      getErrorToast({ message: t("Shift timing is required", "शिफ्ट का समय आवश्यक है") });
      return;
    }
    if (!shiftDate) {
      getErrorToast({ message: t("Date is required", "दिनांक आवश्यक है") });
      return;
    }
    assignShiftMutation.mutate({
      userId: agent._id,
      time: shiftTime,
      date: shiftDate,
    });
  };

  return (
    <EditDialog
      title={t("Edit Shift Timing", "शिफ्ट समय संपादित करें")}
      onClose={onClose}
      onSave={handleSaveShift}
      saving={assignShiftMutation.isPending}
    >
      <div className="space-y-4">
        <div>
          <Label className="mb-1.5 block">{t("Agent Name", "एजेंट का नाम")}</Label>
          <Input type="text" value={agent.name} disabled />
        </div>
        <div>
          <Label className="mb-1.5 block">
            {t("Shift", "शिफ्ट")} <span className="text-destructive">*</span>
          </Label>
          <Select
            value={shiftTime}
            onValueChange={setShiftTime}
            disabled={assignShiftMutation.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Select shift...", "शिफ्ट चुनें...")} />
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
          <Label className="mb-1.5 block">
            {t("Date", "दिनांक")} <span className="text-destructive">*</span>
          </Label>
          <Input
            type="date"
            value={shiftDate}
            onChange={(e) => setShiftDate(e.target.value)}
            disabled={assignShiftMutation.isPending}
            required
          />
        </div>
      </div>
    </EditDialog>
  );
}
