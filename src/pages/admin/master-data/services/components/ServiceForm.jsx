import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react'

const ServiceForm = ({
  serviceFormData,
  setServiceFormData,
  serviceErrors,
  setServiceErrors,
}) => {
  return (
   <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Service Name (English) *</Label>
              <Input
                value={serviceFormData.title}
                onChange={(e) => {
                  setServiceFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }));
                  if (serviceErrors.title)
                    setServiceErrors((prev) => ({ ...prev, title: "" }));
                }}
                placeholder="e.g., Public Works"
                required
              />
              {serviceErrors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {serviceErrors.title}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-1.5 block">सेवा का नाम (Hindi) *</Label>
              <Input
                value={serviceFormData.titleHindi}
                onChange={(e) => {
                  setServiceFormData((prev) => ({
                    ...prev,
                    titleHindi: e.target.value,
                  }));
                  if (serviceErrors.titleHindi)
                    setServiceErrors((prev) => ({ ...prev, titleHindi: "" }));
                }}
                placeholder="उदा. सार्वजनिक कार्य"
                required
              />
              {serviceErrors.titleHindi && (
                <p className="text-red-500 text-xs mt-1">
                  {serviceErrors.titleHindi}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-1.5 block">Department *</Label>
              <Input
                value={serviceFormData.department}
                onChange={(e) => {
                  setServiceFormData((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }));
                  if (serviceErrors.department)
                    setServiceErrors((prev) => ({ ...prev, department: "" }));
                }}
                placeholder="e.g., PWD"
                required
              />
              {serviceErrors.department && (
                <p className="text-red-500 text-xs mt-1">
                  {serviceErrors.department}
                </p>
              )}
            </div>
          </div>
  )
}

export default ServiceForm