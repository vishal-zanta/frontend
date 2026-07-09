import React from "react";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { Button } from "@/components/ui/button";
import useGetRoles from "@/hooks/query/useGetRoles";
import { useGetDemographics } from "../master-data/hooks";
import { Save, UserPlus, Loader2 } from "lucide-react";

export default function Form({ onCancel, isEdit = false, submitLabel = "Save", isLoading = false }) {
  const { data: rolesApiData } = useGetRoles([], { page: 1, limit: 100 });
  const { data: demographyData } = useGetDemographics([], { page: 1, limit: 100 });

  const roleOptions = (rolesApiData?.data?.docs || []).map((r) => ({
    label: r.designationEnglish,
    value: r._id,
  }));

  const districtOptions = (demographyData?.data?.data?.docs || []).map((d) => ({
    label: d.name,
    value: d._id,
  }));

  const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
    { label: "Suspended", value: "SUSPENDED" },
  ];

  return (
    <div className="space-y-4">
      <RhfInput label="Name" name="name" required placeholder="Enter full name" />
      <RhfInput label="Email" name="email" required placeholder="email@bihar.gov.in" />
      <RhfInput label="Phone" name="phone" required placeholder="Enter 10-digit phone number" />
      <RhfInput label="Password" name="password" type="password" required={!isEdit} placeholder="Enter password" />
      <RhfInput label="Confirm Password" name="confirmPassword" type="password" required={!isEdit} placeholder="Confirm password" />
      
      <RhfSelect
        name="role"
        label="Role"
        required
        options={roleOptions}
        placeholder="Select a role"
      />
      
      <RhfSelect
        name="district"
        label="District"
        required
        options={districtOptions}
        placeholder="Select a district"
      />

      {isEdit && (
        <RhfSelect
          name="status"
          label="Status"
          required
          options={statusOptions}
          placeholder="Select status"
        />
      )}

      <div className="flex gap-2 pt-2  mt-4 sticky bottom-0 bg-white pb-4">
        <Button
          variant="outline"
          className="flex-1"
          type="button"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 bg-primary hover:bg-primary/90"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Saving...
            </>
          ) : isEdit ? (
            <>
              <Save className="w-4 h-4 mr-1" /> {submitLabel}
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-1" /> {submitLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}