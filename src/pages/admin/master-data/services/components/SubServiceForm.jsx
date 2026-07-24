import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { isValidNumber } from "@/utils/helpers";
import React from "react";

const SubServiceForm = ({
  formData,
  setFormData,
  setErrors,
  errors,
  service,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1.5 block">
          Sub-Service Name (English) <span className="text-red-500">*</span>
        </Label>
        <Input
          value={formData.title}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, title: e.target.value }));
            if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
          }}
          placeholder="e.g., Pothole Repair"
          required
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>
      <div>
        <Label className="mb-1.5 block">
          उप-सेवा (Hindi) <span className="text-red-500">*</span>
        </Label>
        <Input
          value={formData.titleHindi}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              titleHindi: e.target.value,
            }));
            if (errors.titleHindi)
              setErrors((prev) => ({ ...prev, titleHindi: "" }));
          }}
          placeholder="उदा. गड्ढा मरम्मत"
          required
        />
        {errors.titleHindi && (
          <p className="text-red-500 text-xs mt-1">{errors.titleHindi}</p>
        )}
      </div>
      <div>
        <Label className="mb-1.5 block">
          SLA Duration <span className="text-red-500">*</span>
        </Label>
        <div className="relative flex items-center">
          <Input
            type="text"
            value={formData.sla}
            onChange={(e) => {
              const val = e.target.value;
              if (val !== "" && Number(val) < 0) return;
              if (!isValidNumber(val, 1, 9999)) return;
              setFormData((prev) => ({ ...prev, sla : Number(val) }));
              if (errors.sla) setErrors((prev) => ({ ...prev, sla: "" }));
            }}
            placeholder="e.g., 48"
            className="pr-16"
            required
          />
          <select
            value={formData.slaType || "hrs"}
            onChange={(e) => {
              const newType = e.target.value;
              setFormData((prev) => ({ ...prev, slaType: newType }));
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 bg-transparent border-0 text-xs text-muted-foreground focus:outline-none cursor-pointer"
          >
            <option value="hrs" className="bg-popover text-popover-foreground">
              Hrs
            </option>
            <option value="days" className="bg-popover text-popover-foreground">
              Days
            </option>
          </select>
        </div>
        {errors.sla && (
          <p className="text-red-500 text-xs mt-1">{errors.sla}</p>
        )}
      </div>
      <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Geo-Tagged</Label>
          <p className="text-xs text-muted-foreground">
            Require geo-location for this service
          </p>
        </div>
        <Switch
          checked={formData.geoTagged}
          onCheckedChange={(val) =>
            setFormData((prev) => ({ ...prev, geoTagged: val }))
          }
        />
      </div>
      <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Field Visit</Label>
          <p className="text-xs text-muted-foreground">
            Requires physical site inspection by officer
          </p>
        </div>
        <Switch
          checked={formData.fieldVisit}
          onCheckedChange={(val) =>
            setFormData((prev) => ({ ...prev, fieldVisit: val }))
          }
        />
      </div>
      <div>
        <Label className="mb-1.5 block">Parent Service</Label>
        <Input disabled value={service.title} className="bg-muted/50" />
      </div>
    </div>
  );
};

export default SubServiceForm;
