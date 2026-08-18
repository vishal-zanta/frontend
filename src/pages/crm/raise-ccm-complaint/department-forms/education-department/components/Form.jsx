import React from "react";
import FormWrappers from "../../FormWrappers";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import RhfTextarea from "@/components/rhfinputs/RhfTextarea";
import RhfBoolean from "@/components/rhfinputs/RhfBoolean";
import {
  FileText,
  User,
  MapPin,
  UserX,
} from "lucide-react";

const Form = ({ fields, isLoading }) => {
  return (
    <FormWrappers heading="Education Department - Raise Grievance" isLoading={isLoading}>
      <div className="px-4 space-y-6">
        {/* Section 1: Complaint & Classification Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <FileText className="w-4 h-4 text-primary" />
            <span>Complaint Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfSelect
              name="categoryId"
              label="Category"
              placeholder="Select Category"
              options={fields?.categoryId || []}
            />
            <RhfInput
              name="categoryOther"
              label="Category (Other)"
              placeholder="Enter category details if other"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfSelect
              name="source"
              label="Source"
              placeholder="Select Source"
              options={fields?.source || []}
            />
            <RhfInput
              name="registeredAt"
              label="Registered At"
              type="date"
            />
          </div>

          <RhfTextarea
            name="complaint"
            label="Complaint Description"
            placeholder="Enter detailed description of the complaint..."
            rows={4}
          />
        </div>

        {/* Section 2: Complainant Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <User className="w-4 h-4 text-primary" />
            <span>Complainant Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfInput
              name="complainant.name"
              label="Complainant Name"
              placeholder="Enter complainant name"
            />
            <RhfInput
              name="complainant.mobile"
              label="Complainant Mobile Number"
              placeholder="Enter 10-digit mobile number"
              isNumsOnly={true}
              maxLength={10}
            />
          </div>

          <RhfBoolean
            name="complainant.shareNumberWithOfficer"
            label="Share Mobile Number with Officer"
            description="Allow the investigating officer to view the complainant's contact number."
          />
        </div>

        {/* Section 3: Location Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Location Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <RhfSelect
              name="location.districtCode"
              label="District"
              placeholder="Select District"
              options={fields?.districtCode || fields?.district || []}
            />
            <RhfSelect
              name="location.blockCode"
              label="Block"
              placeholder="Select Block"
              options={fields?.blockCode || fields?.block || []}
            />
            <RhfSelect
              name="location.clusterCode"
              label="Cluster"
              placeholder="Select Cluster"
              options={fields?.clusterCode || fields?.cluster || []}
            />
            <RhfSelect
              name="location.panchayatCode"
              label="Panchayat"
              placeholder="Select Panchayat"
              options={fields?.panchayatCode || fields?.panchayat || []}
            />
            <RhfSelect
              name="location.villageCode"
              label="Village"
              placeholder="Select Village"
              options={fields?.villageCode || fields?.village || []}
            />
            <RhfSelect
              name="location.schoolCode"
              label="School"
              placeholder="Select School"
              options={fields?.schoolCode || fields?.school || []}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfSelect
              name="location.teacherCode"
              label="Teacher"
              placeholder="Select Teacher"
              options={fields?.teacherCode || fields?.teacher || []}
            />
          </div>
        </div>

        {/* Section 4: Accused Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-semibold text-base">
            <UserX className="w-4 h-4 text-primary" />
            <span>Accused Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RhfInput
              name="accused.name"
              label="Accused Person Name"
              placeholder="Enter accused person's name"
            />
            <RhfInput
              name="accused.designation"
              label="Accused Person Designation"
              placeholder="Enter designation (e.g., Principal, Headmaster, Teacher)"
            />
          </div>
        </div>
      </div>
    </FormWrappers>
  );
};

export default Form;