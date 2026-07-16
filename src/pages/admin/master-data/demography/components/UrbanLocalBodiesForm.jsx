import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isValidNumber } from "@/utils/helpers";
import React from "react";

const UrbanLocalBodiesForm = ({
  formData,
  errors,
  setErrors,
  setFormData,
  districts,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1.5 block">ULB Name (English) <span className="text-red-500">*</span></Label>
        <Input
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, name: e.target.value }));
            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
          }}
          placeholder="e.g., Patna Municipal Corporation"
          required
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <Label className="mb-1.5 block">नगर निगम (Hindi) <span className="text-red-500">*</span></Label>
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
          placeholder="उदा. पटना नगर निगम"
          required
        />
        {errors.nameHindi && (
          <p className="text-red-500 text-xs mt-1">{errors.nameHindi}</p>
        )}
      </div>
      <div>
        <Label className="mb-1.5 block">District <span className="text-red-500">*</span></Label>
        <Select
          value={formData.district}
          onValueChange={(val) => {
            setFormData((prev) => ({ ...prev, district: val }));
            if (errors.district)
              setErrors((prev) => ({ ...prev, district: "" }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select District" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((d) => (
              <SelectItem key={d._id} value={d._id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.district && (
          <p className="text-red-500 text-xs mt-1">{errors.district}</p>
        )}
      </div>
      <div>
        <Label className="mb-1.5 block">Wards <span className="text-red-500">*</span></Label>
        <Input
          value={formData.wards}
          onChange={(e) => {
            if (!isValidNumber(e.target.value, 0)) return;

            setFormData((prev) => ({ ...prev, wards: e.target.value }));
            if (errors.wards) setErrors((prev) => ({ ...prev, wards: "" }));
          }}
          placeholder="e.g., 75"
          required
        />
        {errors.wards && (
          <p className="text-red-500 text-xs mt-1">{errors.wards}</p>
        )}
      </div>
      {/* <div>
              <Label className="mb-1.5 block">Population <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                value={formData.population}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, population: e.target.value }));
                  if (errors.population) setErrors((prev) => ({ ...prev, population: "" }));
                }}
                placeholder="e.g., 2065784"
                required
              />
              {errors.population && (
                <p className="text-red-500 text-xs mt-1">{errors.population}</p>
              )}
            </div> */}
    </div>
  );
};

export default UrbanLocalBodiesForm;
