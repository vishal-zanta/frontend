import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react'

const DesignationForm = ({formData,setFormData,errors,setErrors}) => {
  return (
    <>
     <div>
            <Label className="mb-1.5 block">Designation (English) *</Label>
            <Input
              value={formData.designationEnglish}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  designationEnglish: e.target.value,
                }));
                if (errors.designationEnglish) {
                  setErrors((prev) => ({ ...prev, designationEnglish: "" }));
                }
              }}
              required
              placeholder="e.g., Municipal Commissioner"
            />
            {errors.designationEnglish && (
              <p className="text-red-500 text-xs mt-1">
                {errors.designationEnglish}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-1.5 block">पदनाम (Hindi) *</Label>
            <Input
              value={formData.designationHindi}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  designationHindi: e.target.value,
                }));
                if (errors.designationHindi) {
                  setErrors((prev) => ({ ...prev, designationHindi: "" }));
                }
              }}
              required
              placeholder="उदा. नगर आयुक्त"
            />
            {errors.designationHindi && (
              <p className="text-red-500 text-xs mt-1">
                {errors.designationHindi}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-1.5 block">Level *</Label>
            <Select
              value={formData.level}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, level: val }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["L1", "L2", "Zone", "ULB", "Division", "SUDA"].map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
    </>
  )
}

export default DesignationForm