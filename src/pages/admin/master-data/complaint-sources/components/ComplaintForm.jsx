import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const ComplaintForm = ({ formData, setFormData, errors, setErrors }) => {
  return (
    <div>
      <Label className="mb-1.5 block">Source Name *</Label>
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
  );
};

export default ComplaintForm;
