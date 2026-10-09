import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const ComplaintForm = ({ formData, setFormData, errors, setErrors }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1.5 block">Source Name <span className="text-red-500">*</span></Label>
        <Input
          value={formData.title}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, title: e.target.value }));
            if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
          }}
          placeholder="e.g., Mobile App"
          required
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <Label className="mb-1.5 block">Source Name (Hindi) <span className="text-red-500">*</span></Label>
        <Input
          value={formData.titleHindi}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, titleHindi: e.target.value }));
            if (errors.titleHindi) setErrors((prev) => ({ ...prev, titleHindi: "" }));
          }}
          placeholder="उदा. मोबाइल ऐप"
          required
        />
        {errors.titleHindi && (
          <p className="text-red-500 text-xs mt-1">{errors.titleHindi}</p>
        )}
      </div>
    </div>
  );
};

export default ComplaintForm;
