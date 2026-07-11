import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { isValidNumber } from "@/utils/helpers";
import React from "react";

const DemographyForm = ({ formData, setErrors, setFormData, errors }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1.5 block">District Name (English) *</Label>
        <Input
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, name: e.target.value }));
            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
          }}
          placeholder="e.g., Patna"
          required
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <Label className="mb-1.5 block">जिला (Hindi) *</Label>
        <Input
          value={formData.nameHindi}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              nameHindi: e.target.value,
            }));
            if (errors.nameHindi)
              setErrors((prev) => ({ ...prev, nameHindi: "" }));
          }}
          placeholder="उदा. पटना"
          required
        />
        {errors.nameHindi && (
          <p className="text-red-500 text-xs mt-1">{errors.nameHindi}</p>
        )}
      </div>
      <div>
        <Label className="mb-1.5 block">Division *</Label>
        <Input
          value={formData.division}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              division: e.target.value,
            }));
            if (errors.division)
              setErrors((prev) => ({ ...prev, division: "" }));
          }}
          placeholder="e.g., Patna"
          required
        />
        {errors.division && (
          <p className="text-red-500 text-xs mt-1">{errors.division}</p>
        )}
      </div>
      <div>
        <Label className="mb-1.5 block">Zone *</Label>
        <Select
          value={formData.zone}
          onValueChange={(val) =>
            setFormData((prev) => ({ ...prev, zone: val }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="South Bihar">South Bihar</SelectItem>
            <SelectItem value="North Bihar">North Bihar</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-1.5 block">Population *</Label>
        <Input
          value={formData.population}
          onChange={(e) => {
            if (!isValidNumber(e.target.value, 0)) return;

            setFormData((prev) => ({
              ...prev,
              population: e.target.value,
            }));
            if (errors.population)
              setErrors((prev) => ({ ...prev, population: "" }));
          }}
          placeholder="e.g., 2442383"
          required
        />
        {errors.population && (
          <p className="text-red-500 text-xs mt-1">{errors.population}</p>
        )}
      </div>
      <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Urban</Label>
          <p className="text-xs text-muted-foreground">
            Classified as an urban administrative area
          </p>
        </div>
        <Switch
          checked={formData.urban}
          onCheckedChange={(val) =>
            setFormData((prev) => ({ ...prev, urban: val }))
          }
        />
      </div>
    </div>
  );
};

export default DemographyForm;
