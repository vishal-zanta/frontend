import React from "react";
import RhfWrapper from "@/components/RhfWrapper";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { serviceSchema } from "../schema";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { isValidNumber } from "@/utils/helpers";
import { useLanguage } from "@/context/LanguageContext";

const ServiceFormFields = ({ updatedDeptOptions, onClose, saving }) => {
  const { control, watch, setValue } = useFormContext();
  const { t } = useLanguage();
  const slaType = watch("slaType") || "hrs";

  return (
    <div className="space-y-4">
      <RhfInput
        name="title"
        label="Service Name (English)"
        placeholder="e.g., Public Works"
        required
      />

      <RhfInput
        name="titleHindi"
        label="सेवा का नाम (Hindi)"
        placeholder="उदा. सार्वजनिक कार्य"
        required
      />

      <RhfSelect
        name="department"
        label="Department"
        placeholder="Select department..."
        options={updatedDeptOptions}
        required
        isMultiple={false}
      />

      {/* SLA Duration */}
      <Controller
        name="sla"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            <Label className="mb-1.5 block">
              {t("SLA Duration", "SLA अवधि")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative flex items-center">
              <Input
                type="text"
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val !== "" && Number(val) < 0) return;
                  if (!isValidNumber(val, 1, 9999)) return;
                  field.onChange(val === "" ? "" : Number(val));
                }}
                placeholder="e.g., 48"
                className="pr-16"
                required
              />
              <select
                value={slaType}
                onChange={(e) => setValue("slaType", e.target.value)}
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
            {error && (
              <p className="text-red-500 text-xs mt-1">{error.message}</p>
            )}
          </div>
        )}
      />

      {/* Geo-Tagged */}
      <Controller
        name="geoTagged"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">
                {t("Geo-Tagged", "भू-टैग किया गया")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t(
                  "Require geo-location for this service",
                  "इस सेवा के लिए भू-स्थान आवश्यक है",
                )}
              </p>
            </div>
            <Switch
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
            />
          </div>
        )}
      />

      {/* Field Visit */}
      <Controller
        name="fieldVisit"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">
                {t("Field Visit", "क्षेत्र का दौरा")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t(
                  "Requires physical site inspection by officer",
                  "अधिकारी द्वारा भौतिक स्थल निरीक्षण की आवश्यकता है",
                )}
              </p>
            </div>
            <Switch
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
            />
          </div>
        )}
      />

      <div className="flex gap-2 justify-end pt-4 border-t border-border pb-4 bg-card sticky bottom-0">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="bg-primary hover:bg-primary/90"
        >
          <Check className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

const ServiceForm = ({
  initialValues,
  handleSubmit,
  onClose,
  saving,
  departmentOptions = [],
}) => {
  const updatedDeptOptions =
    initialValues?.departmentObj?.active !== false
      ? departmentOptions
      : [
          ...departmentOptions,
          {
            label:
              initialValues?.departmentObj?.title ||
              initialValues?.departmentObj?.name ||
              "",
            value: initialValues?.departmentObj?._id,
            disabled: true,
            notExist: true,
          },
        ];

  return (
    <RhfWrapper
      initialValues={initialValues}
      isValidation
      validationSchema={serviceSchema}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <ServiceFormFields
        updatedDeptOptions={updatedDeptOptions}
        onClose={onClose}
        saving={saving}
      />
    </RhfWrapper>
  );
};

export default ServiceForm;
