import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const SkillForm = ({ formData, setFormData, errors, setErrors }) => {
  return (
    <div>
      <Label className="mb-1.5 block">Skill Name <span className="text-red-500">*</span></Label>
      <Input
        value={formData.name || ""}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, name: e.target.value }));
          if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
        }}
        placeholder="e.g., Technical Support"
        required
      />
      {errors.name && (
        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
      )}
    </div>
  );
};

export default SkillForm;
